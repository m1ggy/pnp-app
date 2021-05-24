let adminApp = require('../firebase');

let adminAuth = adminApp;

function createUser(email, password) {
  console.log(email, password);
  adminAuth
    .createUser({ email, password })
    .then(() => {
      return new Promise((resolve) => {
        resolve(JSON.stringify({ message: 'Successfully created account.' }));
      });
    })
    .catch(() => {
      return new Promise((resolve) => {
        resolve(JSON.stringify({ message: 'failed to create account.' }));
      });
    });
}

exports.handler = async function (event) {
  console.log(event.httpMethod);

  if (event.httpMethod === 'POST') {
    let body = JSON.parse(event.body);
    console.log(body.email, body.password);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Post success' }),
    };
  } else if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Get success' }),
    };
  }
};
