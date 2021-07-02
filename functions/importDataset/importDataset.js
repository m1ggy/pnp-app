const { keys } = require('../keys');
let admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
}

// function formatDataset(data, type) {

// }

exports.handler = function (event, context, callback) {
  const body = JSON.parse(event.body);
  const { data } = body;

  if (event.httpMethod === 'POST') {
    console.log(data);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: `Received data: ${data}` }),
    });
  }
  if (event.httpMethod === 'GET') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Import Dataset function works fine!' }),
    });
  }
};
