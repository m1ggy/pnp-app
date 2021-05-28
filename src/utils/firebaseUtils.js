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

export async function setDataDoc(id, data, collection, callback) {
  await firestore
    .collection(collection)
    .doc(id)
    .set(data, { merge: true })
    .then(() => {
      return callback({ message: 'report has been filed' });
    })
    .catch((e) => {
      return callback({ message: 'report has not been filed. see error: ', e });
    });
}
