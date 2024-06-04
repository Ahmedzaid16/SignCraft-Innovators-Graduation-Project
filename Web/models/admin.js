const admin = require("firebase-admin");
const serviceAccount = require("./signlanguage-users-firebase-adminsdk-dr983-e842fc39df.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://signlanguage-users.appspot.com",
});

module.exports = admin;
