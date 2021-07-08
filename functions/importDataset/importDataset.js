const { keys } = require('../keys');
let admin = require('firebase-admin');
const { default: axios } = require('axios');
const { headerValues, municipalities } = require('./constants');
const uniqid = require('uniqid');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

let count = {
  success: 0,
  failed: 0,
};

const db = admin.firestore().collection('reports');

async function formatDataset(url, id, author, callback) {
  count = {
    success: 0,
    failed: 0,
  };
  var response = await axios.get(url);
  const { data } = response;
  if (data == null || data.length === 0) {
    callback({
      message: ' ❌ Cannot read file. The file might be too big to convert.',
    });
  }

  let formattedData = [];
  if (data != null && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      ////get the keys of the current object
      let keys = Object.keys(data[i]);
      let modified = {};

      ///loop through the array of keys
      for (let k = 0; k < keys.length; k++) {
        ///loop through the default header values
        for (let j = 0; j < headerValues.length; j++) {
          ///if we find a match, replace the keys of the object
          if (
            keys[k].toLowerCase().search(headerValues[j].toLowerCase()) > -1
          ) {
            ////set the new objects properties. DO NOT TOUCH
            Object.defineProperty(
              modified,
              headerValues[j],
              Object.getOwnPropertyDescriptor(data[i], keys[k])
            );
            delete data[keys[k]];
          }
        }
      }

      formattedData.push(modified);
    }

    /////format the data to fit database
    formattedData.forEach((report) => {
      const id = uniqid();
      ///convert the excel serial date to javascript date object
      report.date = new Date(Math.round((report.date - 25569) * 86400 * 1000));
      ///convert the excel serial time to javascript date object
      report.time = new Date(Math.round((report.time - 25569) * 86400 * 1000));
      report.timestamp = new Date();
      ///merge the date and time objects
      report.dateOccurred = new Date(
        report.date.getFullYear(),
        report.date.getMonth(),
        report.date.getDate(),
        report.time.getHours(),
        report.time.getMinutes()
      );
      let municipality = {};

      ////find the preexisting municipality

      municipalities.forEach((m) => {
        if (report.address != null) {
          if (report.address.toLowerCase().includes(m.value.toLowerCase())) {
            municipality = m;
          }
        }
      });
      report.description = {
        actionTaken: report.action,
        address: report.address,
        remarks: report.remarks,
        status: {
          value: report.status,
          label: report.status,
        },
        violation: {
          value: report.violation.toLowerCase(),
          label: report.violation,
        },
        municipality,
      };
      report.id = id;
      report.profile = {
        age: report.age,
        first: null,
        last: null,
        sex: {
          value:
            typeof report.sex === 'string' ? report.sex.toLowerCase() : null,
          label:
            typeof report.sex === 'string' ? report.sex.toLowerCase() : null,
        },
      };
      report.author = author;
      ///delete unstructured keyvalue pairs
      delete report.date;
      delete report.time;
      delete report.address;
      delete report.violation;
      delete report.age;
      delete report.sex;
      delete report.action;
      delete report.status;
      delete report.remarks;
    });
  }

  formattedData.forEach((report) => {
    db.doc(report.id)
      .set(report)
      .then(() => {
        count.success++;
      })
      .catch(() => {
        count.failed++;
      });
  });

  callback({
    message: '🏁 Upload Finished: Successfully imported data!',
    count,
  });
}

exports.handler = function (event, context, callback) {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const { fileUrl, id, author } = body;
    formatDataset(fileUrl, id, author, (message) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(message),
      });
    });
  }
  if (event.httpMethod === 'GET') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Import Dataset function works fine!' }),
    });
  }
};
