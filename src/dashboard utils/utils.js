import { firestore } from '../firebase/firebase';
const analytics = firestore.collection('analytics');

export function formatData(id, dates, title, callback) {
  let arr = [];
  console.log(id);
  analytics
    .doc(id)
    .get()
    .then((q) => {
      if (q.exists) {
        arr = q.data().pageview;
        return callback(arr, dates, title);
      }
      callback([], dates, title);
    })
    .catch((e) => {
      console.log(e);
    });
}

export function formatDate(range) {
  let defaultDate = new Date();
  let newDate = new Date();

  newDate.setDate(newDate.getDate() - range);
  console.log(newDate);
  let temp = [];
  for (
    newDate;
    newDate <= defaultDate;
    newDate.setDate(newDate.getDate() + 1)
  ) {
    temp.push(new Date(newDate));
  }

  let dateString = [];

  temp.forEach((date) => {
    dateString.push(date.toDateString());
  });
  console.log(dateString);

  return dateString;
}
