import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


exports.firebase = function () {
const firebaseConfig = {
  apiKey: "AIzaSyAOdc-lRT5PQtsVJel2TAahtJ6g4GaI378",
  authDomain: "hirewell-15f5c.firebaseapp.com",
  projectId: "hirewell-15f5c",
  storageBucket: "hirewell-15f5c.appspot.com",
  messagingSenderId: "187112575176",
  appId: "1:187112575176:web:ccb4c0a220ad2ea2bb55fd",
  measurementId: "G-7VDNL6JLWT"
};
  return firebaseConfig;
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



// const { getAnalytics } = require("firebase/analytics");
// const analytics = getAnalytics(app);