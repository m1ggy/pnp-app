import { firestore, firebase } from '../firebase/firebase';

export function pageView(id) {
  const analytics = firestore.collection('analytics');
  const date = new Date();

  analytics.doc(id).set(
    {
      pageview: firebase.firestore.FieldValue.arrayUnion(date),
    },
    { merge: true }
  );
}
