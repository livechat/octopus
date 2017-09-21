import React, {Component} from 'react';

export default class Person extends Component {
  render() {
    return (
      <a
        href="#"
        className="tooltip-200"
        data-tooltip={this.props.data.email} >
          <img
            src={this.props.data.photoUrl}
            alt={this.props.data.email}
            className="user-avatar" />
      </a>
    );
  }
}
