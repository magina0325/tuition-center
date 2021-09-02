'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";

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
const courses = await getDocs(collection(db, "courses"));
const provider = new GoogleAuthProvider();
const auth = getAuth();

if (sessionStorage.getItem("subscribe-form-email")) {
	document.getElementById("email").value = sessionStorage.getItem("subscribe-form-email");
}

window.addEventListener("load", () => {


	// load popular courses
	let coursesSection = document.querySelector("#popularCourses>div>div:first-child");
	let text = "";
	let i = 0;
	courses.forEach(
		(doc) => {
			if (i++ < 2) {
				text += '<div class="col-sm-6"><div class="team-member text-center"><div><img class="img-fluid" src="' +
					doc.data().imgPath + '" alt=""></div><div class="member-content"><h3>' +
					doc.data().title + '</h3><span>by ' +
					doc.data().tutor + '</span><p>' +
					doc.data().desc + '</p><a href="/pages/course-detail/course-detail.html" class="btn-course-detail col-10 btn btn-main" value="' +
					doc.data().title + '">See Details</a></div></div></div>';
			}
		}
	)
	coursesSection.innerHTML += text;

	/* handle course detail button click */
	document.querySelectorAll(".btn-course-detail").forEach(
		(elem) => {
			elem.addEventListener("mousedown",
				(event) => {
					switch (event.which) {
						case 1:
							localStorage.setItem("course-detail-selected-course", event.target.getAttribute("value"));
							window.location.href = "/pages/course-detail/course-detail.html";
							break;
						case 2:
							localStorage.setItem("course-detail-selected-course", event.target.getAttribute("value"));
							window.open("/pages/course-detail/course-detail.html", '_blank');
							break;
						case 3:
							break;
					}
					return true;
				}
			)
		}
	)

	document.getElementById("contact-form").addEventListener("submit",
		(event) => {
			const email = event.target.email.value;
			const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(String(email).toLowerCase())) {
				return;
			}

			addDoc(collection(db, "subscriptions"), {
				email: email,
			}).then(
				(ref) => {
					document.getElementById("error").style.display = "none";
					document.getElementById("success").style.display = "block";

					sessionStorage.removeItem("subscribe-form-email");
					displayNotification("Email Received! Thanks for subscribing!", "We will send you information regarding offers and promotions.", []);
				}
			).catch(
				(err) => {
					document.getElementById("success").style.display = "none";
					document.getElementById("error").style.display = "block";
				}
			);
		}
	);

	document.getElementById("email").addEventListener("change",
		(event) => {
			sessionStorage.setItem("subscribe-form-email", event.target.value);
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
})

