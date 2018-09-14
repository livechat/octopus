import './css/reset.css';
import './css/buttons.css';
import './css/tooltips.css';
import './App.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { Switch, Route, NavLink, Prompt } from 'react-router-dom'

import * as firebase from 'firebase';
import { Firebase, OnlineTracker } from './utils';
import { Config } from './config';
import { PageContainer } from './containers/page';
import { Markdown } from './components/markdown';
import { PeopleOnline } from './components/people-online';
import { MenuSearch } from './components/menu-search';

import {
  menuTemplate,
  companyStructureTemplate,
  productRoadmapTemplate,
  diagramsHelpTemplate,
  newPageTemplate
} from './templates';

class App extends Component {
  stopRedirection = false;
  onBeforeUnloadText = "You have unsaved changes.\n\nAre you sure you want to close this page?";

  state = {
    loggedIn: false,
    accessDenied: false,
    hasUnsavedChanges: false,
    menu: null
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);

    this.bindGlobalNavigationHelper();
    this.followDetailsInMenu();

    const config = {
      apiKey: Config.apiKey,
      authDomain: Config.authDomain,
      databaseURL: Config.databaseURL,
      projectId: Config.projectId,
      storageBucket: Config.storageBucket,
      messagingSenderId: Config.messageingSenderId
    };

    // allow markdown plugins refer to "firebase" global object
    // when injecting custom inline HTML
    window['firebase'] = firebase;

    firebase.initializeApp(config);
    try {
      firebase.auth().getRedirectResult().then((result) => {
        if (result && result.credential && result.credential.accessToken) {
          Firebase.rememberFirebaseAccessToken(result.credential.accessToken);
        }
      }).catch(err => {
        this.stopRedirection = true;
        this.setState({
          authError: true,
          authErrorMessage: err.message
        });
      });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            loggedIn: true
          });

          let menu = firebase.database().ref('pages/menu');
          menu.on('value', (snapshot) => {
            const menuContents = snapshot.val();
            if (menuContents) {
              this.setState({
                menu: menuContents.body
              });
            } else {
              this.createExamplePages();
            }
          }, (error) => {
            this.onAccessDenied();
          });

          OnlineTracker.track(this.props.location.pathname);
        } else {
          if (!this.stopRedirection) {
            firebase.auth().signInWithRedirect(this.getAuthProvider())
              .catch(err => {
                this.stopRedirection = true;
                this.setState({
                  authError: true,
                  authErrorMessage: err.message
                });
              });
          }
        }
      });
    } catch (err) {
      this.stopRedirection = true;
      this.setState({
        authError: true,
        authErrorMessage: err.message
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  onBeforeUnload = (e) => {
    if (this.state.hasUnsavedChanges) {
      e.preventDefault();
      return e.returnValue = this.onBeforeUnloadText;
    }
  }

  getAuthProvider() {
    switch (Config.authProvider) {
      case 'github':
        return new firebase.auth.GithubAuthProvider()
      default:
        return new firebase.auth.GoogleAuthProvider()
    }
  }

  setupPage(ref, template) {
    firebase.database().ref(`pages/${ref}`).once('value').then((snapshot) => {
      if (!snapshot.val()) {
        firebase.database().ref(`pages/${ref}`).set({
          body: template
        });
      }
    }).catch(err => {});
  }

  createExamplePages() {
    this.setupPage('menu', menuTemplate);
    this.setupPage('company-structure', companyStructureTemplate);
    this.setupPage('roadmap', productRoadmapTemplate);
    this.setupPage('project-1', newPageTemplate);
    this.setupPage('project-2', newPageTemplate);
    this.setupPage('diagrams-help', diagramsHelpTemplate);
  }

  // window.navigateTo(event, url)
  // helps components incompatible with React
  // navigate through the app
  // example: [diagram] markdown links
  bindGlobalNavigationHelper() {
    var self = this;
    const re = new RegExp('^' + window.location.origin);

    window.navigateTo = (event, url) => {
      // check if URL is in the same domain
      if (re.test(url)) {
        event.preventDefault();
        url = url.substring(window.location.origin.length);
        self.props.history.push(url);

      // check if URL is a relative path (without protocol)
      } else if (/^https?:/.test(url) === false) {
        event.preventDefault();
        self.props.history.push(url);
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    this.followDetailsInMenu();
    if (this.props.location.pathname !== prevProps.location.pathname) {
      OnlineTracker.track(this.props.location.pathname);
    }
  }

  editModeChanged = (value) => {
    this.setState({
      editMode: value
    });
  }

  onUnsavedChanges = (value) => {
    this.setState({
      hasUnsavedChanges: value
    });
  }

  onAccessDenied = () => {
    this.setState({
      accessDenied: true
    });
  }

  openParentDetailsNode = (node) => {
    if(node){
      if(node.nodeName.toLowerCase() !== 'details')
        this.openParentDetailsNode(node.parentNode);
      else
        node.setAttribute('open', 'true');
    }
  };

  followDetailsInMenu = () => {
    const menuDOMNode = ReactDOM.findDOMNode(this.refs.menu);
    if(menuDOMNode) {
      const actives = menuDOMNode.getElementsByClassName('active');
      for (let i = 0; i < actives.length; i++) {
        this.openParentDetailsNode(actives[i]);
      }
    }
  };

  render() {
    if (this.state.authError) {
      return (
        <div className="app-error content--markdown">
          <p>Firebase app is not configured properly.</p>
          {this.state.authErrorMessage &&
            <p><strong>Error message:</strong><br />{this.state.authErrorMessage}</p>
          }
          {!this.state.authErrorMessage &&
            <div>
            <p>Please go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a> &gt; Authentication &gt; Sign-in method and make sure:</p>
            <ul>
            <li>at least one sign-in method is configured,</li>
            <li><strong>{window.location.origin}</strong> is added to the list of authorized domains.</li>
            </ul>
            </div>
          }
        <p><a href="" onClick={() => { firebase.auth().signOut(); return false; }}>Sign out</a></p>
        </div>
      );
    } else if (this.state.accessDenied) {
      return (
        <div className="app-error content--markdown">
          <p>Access denied for <strong>{firebase.auth().currentUser.email}</strong>.</p>
          <p><a href="" onClick={() => { firebase.auth().signOut(); return false; }}>Sign out</a></p>
        </div>
      );
    } else if (!this.state.loggedIn) {
      return (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      );
    } else {
      return this.renderApp();
    }
  }

  renderApp() {
    const wrapperClass = ['app__wrapper'];
    if (this.state.editMode) {
      wrapperClass.push('app__wrapper--edit-mode');
    }

    return (
      <div className={wrapperClass.join(' ')}>
        <div className="app__menu">
          <p className="app__menu__options">
            <a href="" onClick={() => { firebase.auth().signOut(); return false; }}>Sign out</a> | <NavLink to="/menu">Edit menu</NavLink><br /><br />
            <NavLink to="/online">Show people online</NavLink>
          </p>
          <div className="app__logo">
            <NavLink to="/"><img className="octopus" src="/static/octopus.png" alt="" /></NavLink>
          </div>

          {!this.state.menu &&
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          }

          {this.state.menu &&
            <div>
              <MenuSearch menu={this.state.menu}/>
              <Markdown className="app__menu__container" ref="menu">
                {this.state.menu}
              </Markdown>
            </div>
          }

          <div className="app__menu--made-by">
            <p>Made by <a href="https://www.livechatinc.com/?utm_source=octopus&utm_medium=menu" target="_blank" rel="noopener noreferrer"><img className="octopus" src="/static/livechat.png" alt="" /></a></p>
            <p>See <a href="https://github.com/livechat/octopus" target="_blank" rel="noopener noreferrer">Octopus on GitHub</a></p>
          </div>
        </div>

        <div className="app__content">
          <Switch>
            <Route path="/online" component={PeopleOnline} />
            <Route render={this.renderComponentForRoute()} />
          </Switch>
        </div>
      </div>
    );
  }

  renderComponentForRoute = () => {
    return (route) => {
      const path = route.location.pathname.substring(1);
      const hash = route.location.hash;

      return <div>
        <Prompt
          when={this.state.hasUnsavedChanges}
          message={location => this.onBeforeUnloadText}
        />

        <PageContainer
          onEditModeChange={this.editModeChanged}
          onUnsavedChanges={this.onUnsavedChanges}
          onAccessDenied={this.onAccessDenied}
          path={path}
          key={path}
          hash={hash}
        />
      </div>;
    }
  }
}

export default withRouter(App);
