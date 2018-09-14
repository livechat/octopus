import React, { Component } from 'react';
import Remarkable from 'remarkable';
import hljs from 'highlight.js';

import diagramPlugin from '../../markdown-plugins/diagram/diagram';
import flowchartPlugin from '../../markdown-plugins/flowchart/flowchart';
import googleStorageImagesPlugin from '../../markdown-plugins/google-storage-images/google-storage-images';
import reactRouterLinksPlugin from '../../markdown-plugins/react-router-links/react-router-links';
import headingAnchors from "../../markdown-plugins/heading-anchors/heading-anchors";

import './hljs-github.css';

export default class Markdown extends Component {
  componentWillMount() {
    this.md = new Remarkable({
      linkTarget: '_blank',
      breaks: true,
      linkify: true,
      typographer: true,
      html: true,

      // https://github.com/jonschlinkert/remarkable#syntax-highlighting
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
      }
    });

    this.md.use(diagramPlugin);
    this.md.use(flowchartPlugin);
    this.md.use(googleStorageImagesPlugin);
    this.md.use(reactRouterLinksPlugin);
    this.md.use(headingAnchors);
  }

  render() {
    return (
      <div style={{width:'100%'}}>
        {React.Children.map(this.props.children, child => {
          if (typeof child === 'string') {
            return (
              <div
                className={this.props.className}
                dangerouslySetInnerHTML={{__html: this.md.render(child)}}
              />
            );
          } else {
            return child;
          }
        })}
      </div>
    );
  }
}
