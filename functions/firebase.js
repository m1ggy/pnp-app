var adminKey = require('./adminKey.json');
var admin = require('firebase-admin');

const adminapp = checkFirebaseApp();

function checkFirebaseApp() {
  let app;
  if (admin.app.length === 0) {
    app = admin
      .initializeApp({
        credential: admin.credential.cert(adminKey),
      })
      .then(() => {
        return app;
      });
  }
}

module.exports = adminapp;
