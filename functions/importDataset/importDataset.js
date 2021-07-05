const { keys } = require('../keys');
let admin = require('firebase-admin');
const { default: axios } = require('axios');
const { headerValues } = require('./constants');

let baseValue = {
  age: Number(),
  address: String(),
  dateOccurred: Date(),
  violation: String(),
  sex: String(),
  status: String(),
  actionsTaken: String(),
  remarks: String(),
};

let formattedArray = [];
let headers = [];

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
}

async function formatDataset(url, id, callback) {
  var response = await axios.get(url);
  const { data } = response;
  var keys;
  if (data == null || data.length === 0) {
    callback({
      message: ' ❌ Cannot read file. The file might be too big to convert.',
    });
  }

  callback({
    message: '🔁 Received file in the server. formatting ....',
  });

  if (data != null && data.length > 0) {
    keys = Object.keys(data[0]);
    for (let i = 0; i < keys.length; i++) {
      for (let k = 0; i < headerValues.length; i++) {
        console.log(
          keys[i].toLowerCase().search(headerValues[k].toLowerCase())
        );
      }
    }
  }
}

exports.handler = function (event, context, callback) {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const { fileUrl, id } = body;
    formatDataset(fileUrl, id, (message) => {
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
