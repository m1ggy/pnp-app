import firebase from 'firebase/app'
import {firebaseConfig} from './firebaseConfig'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseAnalytics = firebase.analytics();
export const firestore = firebase.firestore();
