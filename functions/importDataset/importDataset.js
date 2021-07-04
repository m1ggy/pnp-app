const { keys } = require('../keys');
let admin = require('firebase-admin');
let xlsx = require('xlsx');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
}

function formatDataset(files) {
  if (files) {
    return { message: 'Received file' };
  }
}

exports.handler = function (event, context, callback) {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const { data } = body;
    const res = formatDataset(data);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
    });
  }
  if (event.httpMethod === 'GET') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Import Dataset function works fine!' }),
    });
  }
};
