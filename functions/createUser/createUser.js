let adminKey = require('../adminKey.json');
let admin = require('firebase-admin').initializeApp({
  credential: require('firebase-admin').credential.cert(adminKey),
});

async function createUser(email, password, verified, name) {
  console.log(email, password);
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
        resolve(JSON.stringify({ message: 'successfully created account' }));
      });
    })
    .catch((err) => {
      return new Promise((resolve) => {
        resolve(err);
      });
    });
}

exports.handler = function (event, context, callback) {
  console.log(event.httpMethod);

  if (event.httpMethod === 'POST') {
    let body = JSON.parse(event.body);
    let { email, password, verified, name } = body;
    createUser(email, password, verified, name).then((res) => {
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json',
        },
        body: res,
      });
    });
  } else if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Get success' }),
    };
  }
};
