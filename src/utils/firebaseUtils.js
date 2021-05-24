import { firestore, firebase, firebaseAuth } from '../firebase/firebase';
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

export function getDataFromDocument(collection, document, callback) {
  const db = firestore.collection(collection).doc(document);

  db.get().then((doc) => {
    if (doc.exists) {
      return callback(doc.data());
    }
    return callback([]);
  });
}

export function getDataFromCollection(collection, callback) {
  const db = firestore.collection(collection);

  db.get().then((docs) => {
    let temp = [];
    if (docs.empty) {
      return callback([]);
    }

    docs.forEach((doc) => {
      temp.push(doc.data());
    });

    return callback(temp);
  });
}

export function getDataWhereQuery(
  collection,
  criteria,
  operator,
  value,
  callback
) {
  const db = firestore.collection(collection);
  db.where(criteria, operator, value)
    .get()
    .then((docs) => {
      if (docs.empty) {
        return callback([]);
      }
      let temp = [];
      docs.forEach((doc) => {
        temp.push(doc.data());
      });

      return callback(temp);
    });
}

export function signUp(email, password, name, role) {
  const users = firestore.collection('users');
  firebaseAuth.createUserWithEmailAndPassword(email, password).then((q) => {
    users.doc(q.user.uid).set(
      {
        name,
        email,
        password,
        id: q.user.uid,
        role,
        timestamp: new Date(),
      },
      { merge: true }
    );
  });
}
