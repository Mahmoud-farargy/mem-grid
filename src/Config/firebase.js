// Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
var firebaseConfig = {
    apiKey: "AIzaSyA0rBV8_PlibwSQaA-02uzVPsOxWbrxjIw",
    authDomain: "memo-grid.firebaseapp.com",
    databaseURL: "https://memo-grid.firebaseio.com",
    projectId: "memo-grid",
    storageBucket: "memo-grid.appspot.com",
    messagingSenderId: "367813539106",
    appId: "1:367813539106:web:b28598e21c8f829931217b",
    measurementId: "G-MFYZCMSS1K"
  };
  // Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

const db = firebaseApp.firestore(); //database
const auth = firebase.auth(); //authentication

export {
    db,
    auth
}