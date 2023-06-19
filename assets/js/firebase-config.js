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

const database = firebase.database();
const auth = firebase.auth();

function isUserLoggedIn() {
  return auth.currentUser !== null;
}

function isUserOwnProfile(userId) {
  return auth.currentUser && auth.currentUser.uid === userId;
}

// Function to authenticate a user
function authenticateUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Authentication successful, user is signed in
      var user = userCredential.user;
      console.log("User authenticated:", user);
      // Perform any additional actions or redirect to another page
    })
    .catch((error) => {
      // Authentication failed, handle error
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("Authentication error:", errorCode, errorMessage);
    });
}

// Check login status
auth.onAuthStateChanged(function (user) {
  const logInBtn = document.getElementById('logInBtn')
  if (user) {
    // User is logged in
    if (window.location.pathname.includes('login')) {
      window.location.href = 'index.html';
    }
    if (logInBtn) {
      logInBtn.innerHTML = 'Log Out'
      logInBtn.onclick = signOut
    }
  } else {
    if (logInBtn) {
      logInBtn.innerHTML = 'Log In'
      logInBtn.onclick = () => { window.location.href = 'login.html' }
    }
  }
});

function signIn(event) {
  event.preventDefault(); // Prevent form submission

  var email = document.getElementById('loginEmail').value;
  var password = document.getElementById('loginPassword').value;

  // Call the authenticateUser function with the provided email and password
  authenticateUser(email, password);
}

function signOut() {
  firebase.auth().signOut()
}


// CRUD

function updateOrAddBodyAtPath(path, newBody) {
  const databaseRef = database.ref(path);
  databaseRef.set(newBody);
}

// Remove data at a specific path in Firebase Realtime Database
function removeDataFromFirebase(path) {
  const ref = database.ref(path); 
  // Remove the data at the specified path
  ref.remove()
    .then(function() {
      console.log("Data removed successfully");
    })
    .catch(function(error) {
      console.error("Error removing data:", error);
    });
}
