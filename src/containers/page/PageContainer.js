import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as firebase from 'firebase';
import { Utils, Firebase } from '../../utils';
import { Page } from '../../components/page';
import { indexPageTemplate, newPageTemplate } from '../../templates';

export default class PageContainer extends Component {
  state = {
    currentlyViewing: [],
    fetched: false,
    body: '',
  };

  getCurrentPath() {
    return this.parsePath(this.props.path);
  }

  parsePath(path) {
    if (path === '') {
      return 'index';
    }
    return path.replace(/[#$[.\]]/g, '');
  }

  componentDidMount() {
    this.setState({
      fetched: false
    });

    firebase.database().ref('online').on('value', (snapshot) => {
      if (snapshot) {
        const activeUsers = snapshot.val();
        const currentlyViewing = Object.keys(activeUsers)
          // show active from this page
          .filter(key => activeUsers[key].path.substring(1) === this.props.path)
          // show active from last 5 minutes
          .filter(key => activeUsers[key].lastActive > +(new Date()) - 300 * 1e3)
          .map(key => {
            return {
              email: Firebase.decodeFirebaseKey(key),
              photoUrl: activeUsers[key].photoUrl
            }
          });

        this.setState({ currentlyViewing });
      }
    }, (error) => {
      if (error.code === 'PERMISSION_DENIED') {
        this.props.onAccessDenied();
      }
    });

    firebase.database().ref(`pages/${this.getCurrentPath()}`).on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && data.body) {
        this.setState({
          fetched: true,
          e404: false,
          body: data.body,
          lastChangeTimestamp: data.lastChangeTimestamp,
          lastChangeAutor: data.lastChangeAutor
        });
      } else if (this.getCurrentPath() === 'index') {
        this.createIndexPage();
      } else {
        this.setState({
          fetched: true,
          e404: true
        });
      }
    }, (error) => {
      if (error.code === 'PERMISSION_DENIED') {
        this.props.onAccessDenied();
      }
    });
  }

  componentWillUnmount() {
    firebase.database().ref(`pages/${this.getCurrentPath()}`).off();
    firebase.database().ref('online').off();
  }

  createIndexPage() {
    firebase.database().ref('pages/index').set({
      body: indexPageTemplate
    });
  }

  onChangesSaved = (newBody) => {
    firebase.database().ref(`pages/${this.getCurrentPath()}`).update({
      body: newBody,
      lastChangeTimestamp: Utils.getTimestamp(),
      lastChangeAutor: Firebase.getUser().email
    });

    this.setState({
      body: newBody
    });
  }

  createPage = () => {
    firebase.database().ref(`pages/${this.getCurrentPath()}`).update({
      body: newPageTemplate,
      lastChangeTimestamp: Utils.getTimestamp(),
      lastChangeAutor: Firebase.getUser().email
    });
  }

  canEditPage() {
    switch (this.getCurrentPath()) {
      case 'diagrams-help':
        return false;

      default:
        return true;
    }
  }

  render() {
    if (!this.state.fetched) {
      if (this.props.spinner === false) {
        return null;
      }

      return (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      );
    } else if (this.state.e404) {
      return (
        <div className="content content--markdown">
          <h1>No such page: {this.getCurrentPath()}</h1>
          <p><button onClick={this.createPage}>Create this page</button></p>
        </div>
      );
    } else {
      return <Page
        canEdit={this.canEditPage()}
        currentlyViewing={this.state.currentlyViewing}
        lastChangeTimestamp={this.state.lastChangeTimestamp}
        lastChangeAutor={this.state.lastChangeAutor}
        body={this.state.body}
        onEditModeChange={this.props.onEditModeChange}
        onChangesSaved={this.onChangesSaved}
        onUnsavedChanges={this.props.onUnsavedChanges}
        hash={this.props.hash}
      />;
    }
  }
}

PageContainer.propTypes = {
  onEditModeChange: PropTypes.func.isRequired,
  onUnsavedChanges: PropTypes.func.isRequired,
  onAccessDenied: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  hash: PropTypes.string
};
