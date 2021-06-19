const { keys } = require('../keys');
let admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(keys),
  });
}

async function createUser(email, password, verified, name) {
  return await admin
    .auth()
    .createUser({
      email,
      emailVerified: verified,
      password,
      displayName: `${name.first}+' '+${name.last}`,
    })
    .then((user) => {
      admin.firestore().collection('users').doc(user.uid).set({
        email,
        password,
        name,
        id: user.uid,
        role: 'A',
        timestamp: new Date(),
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
          body: JSON.stringify({ message: 'successfully created account' }),
        });
      });
    })
    .catch((err) => {
      return new Promise((resolve) => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json',
          },
          body: JSON.stringify(err),
        });
      });
    });
}

exports.handler = function (event, context, callback) {
  console.log(event.httpMethod);

  if (event.httpMethod === 'POST') {
    let body = JSON.parse(event.body);
    let { email, password, verified, name } = body;
    createUser(email, password, verified, name).then((res) => {
      callback(null, res);
    });
  } else if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Get success' }),
    };
  }
};
