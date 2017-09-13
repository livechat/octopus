import * as firebase from "firebase";

class Firebase {
  getUser() {
    return firebase.auth().currentUser;
  }

  rememberFirebaseAccessToken(accessToken) {
    try {
      window.localStorage.setItem("firebase.accessToken", accessToken);
    } catch (e) {
      console.warn("Could not save firebase accessToken in localStorage");
    }
  }

  getFirebaseAccessToken() {
    try {
      return window.localStorage.getItem("firebase.accessToken");
    } catch (e) {
      console.warn("Could not get firebase access token from localStorage");
      return null;
    }
  }

  encodeFirebaseKey(key) {
    return encodeURIComponent(key).replace(/\./g, "%2E");
  }

  decodeFirebaseKey(key) {
    return decodeURIComponent(key);
  }
}

export default new Firebase();
