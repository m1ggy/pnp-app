import firebase from 'firebase/app'
import {firebaseConfig} from './firebaseConfig'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-181883397-1');

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseAnalytics = firebase.analytics();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export {firebase};
export {ReactGA}
