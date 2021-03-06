import { firestore, storage } from '../firebase/firebase';
import axios from 'axios';
import XLSX from 'xlsx';
import uniqid from 'uniqid';
const analytics = firestore.collection('analytics');
const storageRef = storage.ref();

export function convertDataType(files, setLogs, callback) {
  let newJSON;
  const id = uniqid();
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    newJSON = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
    if (setLogs) {
      setLogs((logs) => (logs = [...logs, log('🔃 Converting')]));
    }
    const converted = JSON.stringify(newJSON);
    const newBlob = new Blob([converted], {
      type: 'application/json',
    });

    callback(newBlob, id);
  };
  reader.readAsArrayBuffer(files[0]);
}

export function log(content) {
  const time = new Date();
  return (
    <p>
      <span
        style={{
          fontSize: 10,
          color: 'green',
          fontFamily: 'monospace',
        }}
      >
        [{time.toLocaleTimeString()}]:
      </span>{' '}
      {content}
    </p>
  );
}

export function uploadDataset(file, setLogs, id, author, setLoading) {
  let fileUrl;

  const uploadTask = storageRef.child(`datasets/${file.name}`);
  setLogs(
    (logs) =>
      (logs = [...logs, log(<span>📡 Starting upload of {file.name} </span>)])
  );
  uploadTask.put(file).on(
    'state-changed',
    (snapshot) => {
      if (setLogs) {
        setLogs(
          (logs) =>
            (logs = [
              ...logs,
              log(`📡 ${(
                (100.0 * snapshot.bytesTransferred) /
                snapshot.totalBytes
              ).toFixed(2)}%
             done.`),
            ])
        );
      }
    },
    (e) => {
      if (setLogs) {
        setLogs((logs) => (logs = [...logs, log(`❌ Error: ${e}`)]));
      }
    },
    () => {
      if (setLogs) {
        uploadTask
          .getDownloadURL()
          .then((url) => {
            fileUrl = url;
            setLogs(
              (logs) =>
                (logs = [
                  ...logs,
                  log(
                    <>
                      <span>🏁 Upload Finished. URL is :</span>
                      <a href={fileUrl}>{fileUrl}</a>
                    </>
                  ),
                ])
            );
            setLogs(
              (logs) =>
                (logs = [
                  ...logs,
                  log(`📩 Sending JSON file to server for formatting ...`),
                ])
            );
            axios
              .post('/.netlify/functions/importDataset', {
                fileUrl,
                id,
                author,
              })
              .then((res) => {
                setLoading(false);
                setLogs(
                  (logs) =>
                    (logs = [
                      ...logs,
                      log(
                        <>
                          <span>{res.data.message}</span>
                          <br></br>
                          {res.data.count && (
                            <>
                              <span style={{ color: 'green' }}>
                                Successful: {res.data.count.success}
                              </span>
                              <br></br>
                              <span style={{ color: 'red' }}>
                                Failed: {res.data.count.failed}
                              </span>
                            </>
                          )}
                        </>
                      ),
                    ])
                );
              });
          })
          .catch((e) => {
            setLogs(
              (logs) =>
                (logs = [...logs, log(`❌ Cannot fetch file URL: ${e}`)])
            );
          });
      }
    }
  );

  ///send json link to lambda function

  return { fileUrl, id };
}

export function getDataType(files) {
  const arrayOfFiles = [...files];
  const temp = [];

  arrayOfFiles.forEach((file) => temp.push(file.name.split('.').pop()));

  return temp;
}

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

export function randomNumber(max) {
  if (max === 0) return 0;
  return Math.floor(Math.random() * max + 2);
}
export function formatReportDataset(reports, dates, label, date) {
  let reportDates = [];
  let chartDates = [];
  let formattedDataset;
  let random = [];

  ///check if date exists
  if (date) {
    ///check if the value is greater than 6 months and the label is not `All Time (per Hour)`
    if (date.value > 180 && date.label !== 'All Time (Hourly)') {
      return new Promise((resolve) => {
        ///initialize variables for ease of use
        let arrayOfMonths = [];
        let now = new Date();
        let newDate = new Date();
        ///get the start date
        newDate.setDate(newDate.getDate() - date.value);

        //generate dates for array using start date
        for (
          newDate;
          newDate <= now;
          newDate.setMonth(newDate.getMonth() + 1)
        ) {
          arrayOfMonths.push(new Date(newDate));
        }

        let monthsOfReports = [];
        /// convert firebase timestamps into javascript date objects
        reports.forEach((report) => {
          monthsOfReports.push(report.dateOccurred.toDate());
        });
        let chartMonths = [];

        ////aggregate the number of frequency of each month
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

        ///convert date object to locale string
        chartMonths.forEach((month) => {
          month.toLocaleString('default', { month: 'long' });
        });

        let monthLabels = [];
        ///generate new array for chart labels
        arrayOfMonths.forEach((date) => {
          monthLabels.push(
            `${date.toLocaleString('default', {
              month: 'long',
            })} ${date.toLocaleDateString('default', { year: 'numeric' })}`
          );
        });

        chartMonths.forEach((data) => {
          random.push(randomNumber(data));
        });

        ///return dataset
        resolve(
          (formattedDataset = {
            labels: monthLabels,
            datasets: [
              {
                label: label.label,
                fill: false,
                borderColor: 'rgb(21,140,186)',
                backgroundColor: 'rgb(21,140,186)',
                data: chartMonths,
                stack: 'combined',
              },
              {
                label: 'Prediction',
                fill: false,
                borderColor: 'red',
                backgroundColor: 'red',
                data: random,
                type: 'line',
                stack: 'combined',
              },
            ],
          })
        );
      });
    } else if (date.label === 'All Time (Hourly)') {
      return new Promise((resolve) => {
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

        chartTime.forEach((data) => {
          random.push(randomNumber(data));
        });
        resolve(
          (formattedDataset = {
            labels: timeLabel,
            datasets: [
              {
                label: label.label,
                fill: false,
                borderColor: 'rgb(21,140,186)',
                backgroundColor: 'rgb(21,140,186)',
                data: chartTime,
                stack: 'combined',
              },
              {
                label: 'Prediction',
                fill: false,
                borderColor: 'red',
                backgroundColor: 'red',
                data: random,
                type: 'line',
                stack: 'combined',
              },
            ],
          })
        );
      });
    }

    return new Promise((resolve) => {
      reports.forEach((report) => {
        reportDates.push(report.dateOccurred.toDate().toDateString());
      });

      if (dates)
        dates.forEach((date) => {
          chartDates.push(
            reportDates.reduce((pre, cur) => (cur === date ? ++pre : pre), 0)
          );
        });

      chartDates.forEach((data) => {
        random.push(randomNumber(data));
      });

      formattedDataset = {
        labels: dates,
        datasets: [
          {
            label: label.label,
            fill: false,
            borderColor: 'rgb(21,140,186)',
            backgroundColor: 'rgb(21,140,186)',
            data: chartDates,
            stack: 'combined',
          },
          {
            label: 'Prediction',
            fill: false,
            borderColor: 'red',
            backgroundColor: 'red',
            data: random,
            type: 'line',
            stack: 'combined',
          },
        ],
      };

      resolve(formattedDataset);
    });
  }
}
