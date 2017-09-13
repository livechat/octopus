import React, {Component} from 'react';

export default class Person extends Component {
  render() {
    return (
      <img
        src={this.props.data.photoUrl}
        alt={this.props.data.email}
        title={this.props.data.email}
        className="user-avatar" />
    );
  }
}
