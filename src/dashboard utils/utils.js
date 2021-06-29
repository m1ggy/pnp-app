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

export function formatReportDataset(reports, dates, label, date) {
  let reportDates = [];
  let chartDates = [];
  let formattedDataset;

  if (date) {
    if (date.value > 180 && date.label !== 'All Time (per Hour)') {
      let arrayOfMonths = [];
      let now = new Date();
      let newDate = new Date();
      newDate.setDate(newDate.getDate() - date.value);

      for (newDate; newDate <= now; newDate.setMonth(newDate.getMonth() + 1)) {
        arrayOfMonths.push(new Date(newDate));
      }

      let monthsOfReports = [];

      reports.forEach((report) => {
        monthsOfReports.push(report.dateOccurred.toDate());
      });
      let chartMonths = [];

      if (monthsOfReports)
        arrayOfMonths.forEach((month) => {
          chartMonths.push(
            monthsOfReports.reduce(
              (pre, cur) =>
                cur.getFullYear() === month.getFullYear() &&
                cur.toLocaleString('default', { month: 'long' }) ===
                  month.toLocaleString('default', { month: 'long' })
                  ? ++pre
                  : pre,
              0
            )
          );
        });

      chartMonths.forEach((month) => {
        month.toLocaleString('default', { month: 'long' });
      });

      let monthLabels = [];

      arrayOfMonths.forEach((date) => {
        monthLabels.push(
          `${date.toLocaleString('default', {
            month: 'long',
          })} ${date.toLocaleDateString('default', { year: 'numeric' })}`
        );
      });
      return (formattedDataset = {
        labels: monthLabels,
        datasets: [
          {
            label: label.label,
            fill: false,
            borderColor: 'rgb(21,140,186)',
            backgroundColor: 'rgb(21,140,186)',
            tension: 0.3,
            pointStyle: 'rectRot',
            radius: 10,
            hoverRadius: 15,
            data: chartMonths,
          },
        ],
      });
    } else if (date.label === 'All Time (per Hour)') {
      let arrayOfTime = [];
      let arrayOfReports = [];

      reports.forEach((report) => {
        arrayOfReports.push(report.dateOccurred.toDate());
      });

      //// syntax of time string
      // time.toLocaleTimeString('default', {
      //   hour: 'numeric',
      // })

      for (let i = 1; i <= 24; i++) {
        arrayOfTime.push(i);
      }

      ///USE THIS ARRAY FOR REDUCE FUNCTION
      let arrayOfDateTime = [];

      arrayOfTime.forEach((time) => {
        const newTime = new Date('December 1 2021 00:00:00');
        newTime.setHours(time);
        arrayOfDateTime.push(newTime);
      });

      let chartTime = [];

      if (arrayOfReports)
        arrayOfDateTime.forEach((time) => {
          chartTime.push(
            arrayOfReports.reduce(
              (pre, cur) =>
                cur.toLocaleTimeString('default', { hour: '2-digit' }) ===
                time.toLocaleTimeString('default', { hour: '2-digit' })
                  ? ++pre
                  : pre,
              0
            )
          );
        });

      let timeLabel = [];

      arrayOfDateTime.forEach((time) => {
        timeLabel = [
          ...timeLabel,
          time.toLocaleTimeString('default', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        ];
      });

      return (formattedDataset = {
        labels: timeLabel,
        datasets: [
          {
            label: label.label,
            fill: false,
            borderColor: 'rgb(21,140,186)',
            backgroundColor: 'rgb(21,140,186)',
            tension: 0.3,
            pointStyle: 'rectRot',
            radius: 10,
            hoverRadius: 15,
            data: chartTime,
          },
        ],
      });
    }
  }

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
        label: label.label,
        fill: false,
        borderColor: 'rgb(21,140,186)',
        backgroundColor: 'rgb(21,140,186)',
        tension: 0.3,
        pointStyle: 'rectRot',
        radius: 10,
        hoverRadius: 15,
        data: chartDates,
      },
    ],
  };

  return formattedDataset;
}
