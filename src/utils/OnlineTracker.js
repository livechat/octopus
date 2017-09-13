import * as firebase from "firebase";
import Firebase from "./Firebase";

class OnlineTracker {
  track(path) {
    const data = {};
    const user = Firebase.getUser();
    data[Firebase.encodeFirebaseKey(user.email)] = {
      lastActive: +new Date(),
      path: path,
      photoUrl: user.photoURL
    };
    firebase
      .database()
      .ref("online")
      .update(data);
  }
}

export default new OnlineTracker();
