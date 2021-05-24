import * as admin from 'firebase-admin';
import adminKey from './adminKey.json';

const adminapp = admin.initializeApp({
  credential: admin.credential.cert(adminKey),
});

const adminAuth = adminapp.auth();

function createUser(email, password) {
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
  let { email, password } = event.body;
  console.log('INSIDE THE FUNCTION!!!');
  if (event) {
    createUser(email, password).then((res) => {
      let message = JSON.parse(res.message);
      return {
        statusCode: 200,
        body: JSON.stringify({ message }),
      };
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'THE FUNCTION IS WORKING!!!!' }),
  };
};
