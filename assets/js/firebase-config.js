// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAnqbRXKs7q2uwUkIxGjJa46OO4zNApnbo",
    authDomain: "cricketstatx.firebaseapp.com",
    databaseURL: "https://cricketstatx-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cricketstatx",
    storageBucket: "cricketstatx.appspot.com",
    messagingSenderId: "532974950362",
    appId: "1:532974950362:web:233b71c929544abfebd2e3"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
var database = firebase.database();
  