import React, {Component} from 'react';
import * as firebase from 'firebase';
import { Firebase } from '../../utils';
import { Markdown } from '../markdown';
import { distanceInWordsToNow } from 'date-fns';

export default class PeopleOnline extends Component {

  state = {
    fetching: true,
    users: []
  };

  componentDidMount() {
    firebase.database().ref('online').on('value', (snapshot) => {
      const activeUsers = snapshot.val();
      const users = [];
      if (activeUsers) {
        Object.keys(activeUsers)
          // show active from last 5 minutes
          .filter(key => activeUsers[key].lastActive > +(new Date()) - 300 * 1e3)
          .forEach(key => {
            const user = activeUsers[key];
            users.push({
              email: Firebase.decodeFirebaseKey(key),
              lastActive: user.lastActive,
              path: user.path,
              photoUrl: user.photoUrl
            });
        });
      }

      users.sort((a, b) => {
        if (a.lastActive < b.lastActive) return 1;
        if (a.lastActive > b.lastActive) return -1;
        return 0;
      });

      this.setState({
        fetching: false,
        users
      });
    });
  }

  render() {
    return (
      <div className="content content--page-people-online">
        <div className="content__body">
          {this.state.fetching &&
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          }
          {!this.state.fetching &&
<Markdown className="content__markdown content--markdown">
{`
# People online
Active in the last 5 minutes:

 Who | Email | Where | Last Active
:--: | :---- | :---- | :----------
${this.state.users.map((user) => {
  return [`<img src="${user.photoUrl}" alt="${user.email}" title="${user.email}" class="user-avatar" />`, `${user.email}`, `${window.location.origin}${user.path}`, `${distanceInWordsToNow(user.lastActive)} ago`].join('|');
}).join("\n")}
`}
</Markdown>
          }
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    firebase.database().ref('online').off();
  }
}
