import React, { Component } from 'react';
import PropTypes from 'prop-types';

import throttle from 'lodash/throttle';
import { Markdown } from '../markdown';
import { distanceInWordsToNow } from 'date-fns';
import { Person } from '../person';

import './Page.css';
import '../../css/markdown.css';

export default class Page extends Component {

  defaultProps = {
    canEdit: false,
    currentlyViewing: [],
    lastChangeTimestamp: null
  };

  state = {
    body: null,
    originalBody: null,
    hasUnsavedChanges: null,
    editMode: false
  };

  componentDidMount() {
    this.setEditMode(false);
    this.setState({
      body: this.props.body,
      originalBody: this.props.body,
      hasUnsavedChanges: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.body !== this.props.body) {
      this.setState({
        body: this.props.body,
        originalBody: this.props.body
      });
    }

    if (prevState.hasUnsavedChanges !== this.state.hasUnsavedChanges) {
      if (this.props.onUnsavedChanges) {
        this.props.onUnsavedChanges(this.state.hasUnsavedChanges);
      }
    }

    if (this.props.hash)
      this.handleHashAnchor();
  }

  setEditMode(value) {
    this.setState({
      editMode: value
    });

    if (this.props.onEditModeChange) {
      this.props.onEditModeChange(value);
    }
  }

  enableEditMode = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setEditMode(true);
  }

  handleBodyChange = (e) => {
    e.persist();
    this.throttledBodyChange(e);
  }

  throttledBodyChange = throttle((e) => {
    const bodyValue = e.target.value;

    this.setState({
      body: bodyValue,
      hasUnsavedChanges: bodyValue !== this.state.originalBody
    });
  }, 1000);

  handleEditorKeyDown = (e) => {
    const el = e.target;

    if (e.keyCode === 9) {
      // TAB key was pressed
      // get caret position/selection
      var val = el.value,
        start = el.selectionStart,
        end = el.selectionEnd;

      // set textarea value to: text before caret + tab + text after caret
      el.value = val.substring(0, start) + '\t' + val.substring(end);

      // put caret at right position again
      el.selectionStart = el.selectionEnd = start + 1;

      // prevent the focus lose
      e.preventDefault();
    }
  }

  handleHashAnchor = () => {
    const hash = this.props.hash;
    if(hash) {
      const element = document.getElementById(hash.substr(1));
      if (element)
        element.scrollIntoView();
    }
  }

  saveChanges = (e) => {
    this.setEditMode(false);

    this.setState({
      hasUnsavedChanges: false
    });

    if (this.props.onChangesSaved) {
      this.props.onChangesSaved(this.state.body);
    }
  }

  cancelChanges = (e) => {
    e.preventDefault();

    this.setState({
      body: this.state.originalBody,
      hasUnsavedChanges: false
    });
    this.setEditMode(false);
  }

  render() {
    const contentClass = ['content', 'content--page'];
    if (this.state.editMode) {
      contentClass.push('content--edit-mode');
    }

    let meta = [];
    if (this.props.lastChangeTimestamp) {
      meta.push(<span key="last-change-timestamp">Last modified: {distanceInWordsToNow(new Date(this.props.lastChangeTimestamp * 1e3))} ago by {this.props.lastChangeAutor}</span>);
    }
    if (!this.state.editMode) {
      meta.push(<a key="edit-mode" href="" onClick={this.enableEditMode}>Edit this page</a>);
    }

    return (
      <div className={contentClass.join(' ')}>
        <div className="content__meta">
          {this.props.canEdit &&
            <p>{meta.reduce((acc, x) => acc === null ? [x] : [acc, ' | ', x], null)}</p>
          }
          {this.props.currentlyViewing.length > 0 &&
            <p className="content__meta__currently-viewing">
              Reading now: {this.props.currentlyViewing.map(user => <Person data={user} key={user.email} />)}
            </p>
          }
        </div>

        <div className="content__body">
          <Markdown className="content__markdown content--markdown">
          {this.state.body}
          </Markdown>

          {this.state.editMode &&
            <div className="content__editor">
              <textarea
                className="content__editor__textarea"
                defaultValue={this.state.body}
                onKeyDown={this.handleEditorKeyDown}
                onChange={this.handleBodyChange}
                ref={(ref) => ref && ref.focus()}
              />
              <p className="content__editor__buttons">
                <button onClick={this.saveChanges}>Save changes</button> or <a href="" className="content__editor__buttons__cancel" onClick={this.cancelChanges}>cancel</a>
                <span className="content__editor__buttons__guide">
                  <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="noopener noreferrer">Formatting help</a>
                  <span> | </span>
                  <a href="/diagrams-help" target="_blank" rel="noopener noreferrer">Diagrams help</a>
                </span>
              </p>
            </div>
          }
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  body: PropTypes.string.isRequired,
  onEditModeChange: PropTypes.func,
  onUnsavedChanges: PropTypes.func,
  onChangesSaved: PropTypes.func,
  canEdit: PropTypes.bool,
  currentlyViewing: PropTypes.array,
  lastChangeTimestamp: PropTypes.number,
  lastChangeAutor: PropTypes.string,
  hash: PropTypes.string
};
