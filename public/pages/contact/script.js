'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getFirestore, collection, query, getDocs, where, addDoc } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0Jm1rz-cU0Cr3XUoBo6VxQQz9sVnp5uw",
    authDomain: "tuition-center-fcb02.firebaseapp.com",
    projectId: "tuition-center-fcb02",
    storageBucket: "tuition-center-fcb02.appspot.com",
    messagingSenderId: "939795890296",
    appId: "1:939795890296:web:cfe8349a180e7091396d8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

if (sessionStorage.getItem("contact-form-name")) {
    document.getElementById("name").value = sessionStorage.getItem("contact-form-name");
}
if (sessionStorage.getItem("contact-form-email")) {
    document.getElementById("email").value = sessionStorage.getItem("contact-form-email");
}
if (sessionStorage.getItem("contact-form-subject")) {
    document.getElementById("subject").value = sessionStorage.getItem("contact-form-subject");
}
if (sessionStorage.getItem("contact-form-message")) {
    document.getElementById("message").value = sessionStorage.getItem("contact-form-message");
}

window.addEventListener("load",
    () => {
        document.getElementById("contact-form").addEventListener("submit",
            (event) => {
                let name = event.target.name.value;
                let email = event.target.email.value;
                let subject = event.target.subject.value;
                let message = event.target.message.value;

                if (name.length < 4 || !email || !message) {
                    return;
                }

                addDoc(collection(db, "contact-forms"), {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                }).then(
                    (ref) => {
                        document.getElementById("error").style.display = "none";
                        document.getElementById("success").style.display = "block";

                        sessionStorage.removeItem("contact-form-name");
                        sessionStorage.removeItem("contact-form-email");
                        sessionStorage.removeItem("contact-form-subject");
                        sessionStorage.removeItem("contact-form-message");

                        displayNotification("Form Received!", "Thanks for getting in touch!", []);
                    }
                ).catch(
                    (err) => {
                        document.getElementById("success").style.display = "none";
                        document.getElementById("error").style.display = "block";
                    }
                );
            }
        )

        document.getElementById("name").addEventListener("change",
            (event) => {
                sessionStorage.setItem("contact-form-name", event.target.value);
            }
        )

        document.getElementById("email").addEventListener("change",
            (event) => {
                sessionStorage.setItem("contact-form-email", event.target.value);
            }
        )

        document.getElementById("subject").addEventListener("change",
            (event) => {
                sessionStorage.setItem("contact-form-subject", event.target.value);
            }
        )

        document.getElementById("message").addEventListener("change",
            (event) => {
                sessionStorage.setItem("contact-form-message", event.target.value);
            }
        )

        onAuthStateChanged(auth,
            (user) => {
                if (user) {
                    document.getElementById("btn-sign-in").style.display = "none";
    
                    const userDropdown = document.getElementById("user-dropdown");
                    userDropdown.style.display = "block";
                    userDropdown.getElementsByTagName("a")[0].textContent = user.displayName;
    
                } else {
                    document.getElementById("btn-sign-in").style.display = "block";
                    document.getElementById("user-dropdown").style.display = "none";
                }
            }
        )
    
        document.getElementById("btn-sign-in").addEventListener("click",
            (event) => {
                signInWithPopup(auth, provider).then(
                    (result) => {
                        let credential = GoogleAuthProvider.credentialFromResult(result);
                        sessionStorage.setItem("access-token", JSON.stringify(credential.accesToken));
                        sessionStorage.setItem("user", JSON.stringify(result.user));
    
                        displayNotification("You're now signed in!", "Welcome to the website.", []);
                        //var  displayName  =  user.displayName; 
                        //var  email  =  user.email;
                        // var  emailVerified  =  user.emailVerified; 
                        //var  photoURL  =  user.photoURL;
                        // var  isAnonymous  =  user.isAnonymous; 
                        //var  uid  =  user.uid;
                        // var  providerData  =  user.providerData; 
                    }
                ).catch(
                    (error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        //  The  email  of  the  user's  account  used. 
                        var email = error.email;
                        //  The  firebase.auth.AuthCredential  type  that  was  used. 
                        var credential = error.credential;
                        if (errorCode === 'auth/account-exists-with-different-credential') {
                            alert('You  have  already  signed  up  with  a  different  auth  provider  for  that  email.')
                        } else {
                            console.error(error);
                        }
                    }
                )
            }
        )
    
        document.getElementById("btn-sign-out").addEventListener("click",
            (event) => {
                signOut(auth).then(
                    (res) => {
                        sessionStorage.removeItem("access-token");
                        sessionStorage.removeItem("user");
    
                        displayNotification("You have been signed out from the website.", "Have a nice day!", []);
                    }
                ).catch(
                    (err) => {
                        console.err(err);
                    }
                )
            }
        )
    }
)
