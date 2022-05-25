import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAasi5BIfgd9pArZqfUVWHuW6bHdATzO04",
    authDomain: "portfolio-f7924.firebaseapp.com",
    databaseURL: "https://portfolio-f7924.firebaseio.com",
    projectId: "portfolio-f7924",
    storageBucket: "portfolio-f7924.appspot.com",
    messagingSenderId: "859602942821",
    appId: "1:859602942821:web:c72e290c955e3d6ac9bf8c",
    measurementId: "G-2GM9SFMWFD"
};
const firebaseApp=firebase.initializeApp(firebaseConfig);
const db=firebaseApp.firestore();

export {firebaseApp};
export default db;