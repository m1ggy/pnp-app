import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
export const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBwViIzOoZjdG2uGjsh42SDP63JsDXG3pI',
  authDomain: 'pnp-app-a046a.firebaseapp.com',
  projectId: 'pnp-app-a046a',
  storageBucket: 'pnp-app-a046a.appspot.com',
  messagingSenderId: '857568307959',
  appId: '1:857568307959:web:622a285999bfc8e82641f2',
});
export const firebaseAuth = firebaseApp.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
export { firebase };
