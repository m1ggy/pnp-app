import { firestore } from '../firebase/firebase';
const analytics = firestore.collection('analytics');

export function formatData(id, dates, title, callback) {
  let arr = [];
  analytics
    .doc(id)
    .get()
    .then((q) => {
      if (q.exists) {
        arr = q.data().pageview;
        return callback(arr, dates, title);
      }
      return callback([], dates, title);
    })
    .catch((e) => {
      console.log(e);
    });
}

export function formatDate(range) {
  let defaultDate = new Date();
  let newDate = new Date();

  newDate.setDate(newDate.getDate() - range);
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

  return dateString;
}

export function formatReportDataset(reports, dates, title) {
  let reportDates = [];
  let chartDates = [];
  let formattedDataset;

  reports.forEach((report) => {
    reportDates.push(report.timestamp.toDate().toDateString());
  });

  if (dates)
    dates.forEach((date) => {
      chartDates.push(
        reportDates.reduce((pre, cur) => (cur === date ? ++pre : pre), 0)
      );
    });

  formattedDataset = {
    labels: dates,
    datasets: [
      {
        label: title,
        fill: true,
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        data: chartDates,
      },
    ],
  };

  return formattedDataset;
}
