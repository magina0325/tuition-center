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

let courses = [];
if (localStorage.getItem("favorite-courses")) {
    await getDocs(
        query(
            collection(db, "courses"),
            where("title", "in", localStorage.getItem("favorite-courses").split(", "))
        )
    ).then(
        (snapshot) => {
            snapshot.forEach(
                (doc) => {
                    courses.push(doc.data());
                }
            )
        }
    )
}

let favoriteCourseSection = document.querySelector("#favorite-courses>div>div");
if (courses.length === 0) {
    favoriteCourseSection.innerHTML = "<p>You have no favorite courses yet.</p>";
} else {
    let text = "";
    courses.forEach(
        (course) => {
            text += '<div class="col-sm-6"><div class="team-member text-center"><div><img class="img-fluid" src="' +
                course.imgPath + '" alt=""></div><div class="member-content"><h3>' +
                course.title + '</h3><span>by ' +
                course.tutor + '</span><p>' +
                course.desc + '</p><a href="/pages/course-detail/course-detail.html" class="btn-course-detail col-10 btn btn-main" value="' +
                course.title + '">See Details</a></div></div></div>';
        }
    )
    favoriteCourseSection.innerHTML = text;
}


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
            }
        ).catch(
            (error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
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

document.getElementById("btn-sign-out").addEventListener("click", (event) => {
    signOut(auth)
    .then((res) => {
        sessionStorage.removeItem("access-token");
        sessionStorage.removeItem("user");

        displayNotification("You have been signed out from the website.", "Have a nice day!", []);
    })
    .catch((err) => {
        console.err(err);
    })
})