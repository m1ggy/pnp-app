import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
export const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_FIREBASE,
  projectId: process.env.REACT_APP_PROJECT_ID_FIREBASE,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_FIREBASE,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_FIREBASE,
  appId: process.env.REACT_APP_APP_ID_FIREBASE,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID_FIREBASE,
});
export const firebaseAuth = firebaseApp.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
export { firebase };
