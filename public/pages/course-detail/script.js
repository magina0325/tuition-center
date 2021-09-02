'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getFirestore, collection, query, getDocs, where } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";

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

if (!localStorage.getItem("course-detail-selected-course")) {
    window.location.href = "/pages/courses.html";
    throw new Error("Could not retrieve selected course title.");
}

// add to favorite ===================

const course = await getDocs(query(collection(db, "courses"), where("title", "==", localStorage.getItem("course-detail-selected-course"))));
course.forEach(
    (doc) => {
        document.querySelector("section.single-page-header h2").textContent = "Detailed Course Overview - " + doc.data().title;

        let text = '<div class="col-12"><div class="title text-center"><h4>' +
            doc.data().desc + '</h4><div class="border"></div></div></div><div class="col-md-6"><img src="' +
            doc.data().imgPath + '" class="img-fluid" alt=""></div><div class="col-md-6"><ul class="checklist">';
        
        doc.data().topics.forEach(
            (topic) => {
                text += "<li>" + topic + "</li>";
            }
        );
        
        text += '</ul></div><div class="border"></div><div class="col-md-12"><ul class="checklist">' +
            '<li>Fee: ' + doc.data().fee + '</li>' +
            '<li>Tutor: ' + doc.data().tutor + '</li>' +
            '</ul></div><div style="width:100%;" class="row justify-content-center"><button onclick="addFavoriteCourse(this)" class="col-md-4 add-to-favorites btn btn-main mt-20" value="' +
            doc.data().title + '">Add to Favorites</button></div>';
        
        document.querySelector("#course-detail>div>div:first-child").innerHTML = text;
    }
)


// document.querySelectorAll(".add-to-favorites").forEach(
//     (elem) => {
//         elem.addEventListener("click",
//             (event) => {
//                 const actions = [
//                     {
//                         action: '/pages/favorite-courses/favorite-courses.html',
//                         title: 'See all favorite courses',
//                         icon: '/images/notification_icons/checkmark.png'
//                     },
//                     {
//                         action: 'close',
//                         title: 'Close the notification',
//                         icon: '/images/notification_icons/xmark.png'
//                     },

//                 ];

//                 let favoriteCourses = localStorage.getItem("favorite-courses") === null ? [] : localStorage.getItem("favorite-courses").split(", ");
//                 favoriteCourses.find(title => {
//                     if (title === temp.title) {
//                         displayNotification("This subject is already in your favorites.", "", actions)
//                         return false;
//                     }
//                 })

//                 if (favoriteCourses.length === 0) {
//                     localStorage.setItem("favorite-courses", temp.title);
//                 } else {
//                     localStorage.setItem("favorite-courses", localStorage.getItem("favorite-courses") + ", " + temp.title);
//                 }
//                 displayNotification("Subject added to favorites.", "", actions)
//             }
//         );
//     }
// )

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