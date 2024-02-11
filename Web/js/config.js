const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyDSf6PKFSVVJ4pYSezzFyD2mDYOXvBfJ3A",
  authDomain: "signlanguage-users.firebaseapp.com",
  projectId: "signlanguage-users",
  storageBucket: "signlanguage-users.appspot.com",
  messagingSenderId: "213054151045",
  appId: "1:213054151045:web:23303fd0e04b51d04a8cec"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("Users");
module.exports = User;
