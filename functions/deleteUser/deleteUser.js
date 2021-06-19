const { keys } = require('../keys');
let admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
}

async function deleteUser(users) {
  return await admin
    .auth()
    .deleteUsers(users)
    .then(() => {
      users.forEach((user) => {
        admin.firestore().collection('users').doc(user).delete();
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ message: 'successfully deleted account/s' }),
        });
      });
    });
}

exports.handler = function (event, context, callback) {
  const body = JSON.parse(event.body);
  const { data } = body;

  if (event.httpMethod === 'POST') {
    deleteUser(data).then((res) => {
      callback(null, res);
    });
  }
  if (event.httpMethod === 'GET') {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Delete user function works fine!' }),
    });
  }
};
