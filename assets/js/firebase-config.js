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
      alert(errorMessage)
    });
}

// Check login status
auth.onAuthStateChanged(function (user) {
  const logInBtn = document.getElementById('logInBtn')
  const profileLink = document.getElementById('profileLink')
  if (user) {
    // User is logged in
    if (window.location.pathname.includes('auth')) {
      window.location.href = 'index.html';
    }
    if (logInBtn) {
      logInBtn.innerHTML = 'Log Out'
      logInBtn.onclick = signOut
    }
    if (profileLink) { 
      profileLink.classList.remove("d-none");
      profileLink.setAttribute('href', `player.html?user=${user.uid}`);
    }
  } else {
    if (logInBtn) {
      logInBtn.innerHTML = 'Log In'
      logInBtn.onclick = () => { window.location.href = 'auth.html' }
    }
    if (profileLink) { 
      profileLink.classList.add("d-none");
      profileLink.setAttribute('href', `index.html`);
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

function signUp(event) {
  event.preventDefault();

  const fullName = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupPassword2').value;

  // Validate inputs
  if (!fullName || !email || !password || !confirmPassword) {
    alert("Please enter all details")
    return;
  }

  // Validate password match
  if (password !== confirmPassword) {
    alert("Password don't match!")
    return;
  }

  // Create new user on Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const userDetailsRef = firebase.database().ref(`/players/${userId}/details`);
      userDetailsRef.set({
        name: fullName
      })
    })
    .catch((error) => {
      alert(error)
    });
}

function forgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById('forgotEmail').value;

  // Validate email
  if (!email) {
    alert("Enter a valid email")
    return;
  }
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert('Password reset link has been sent to your email.');
    })
    .catch((error) => {
      alert(error);
    });
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
