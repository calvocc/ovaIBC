import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
	apiKey: "AIzaSyDIMSkbUvJSAVGw8YVxzLhBgDAckBI3Byc",
	authDomain: "ova-app.firebaseapp.com",
	databaseURL: "https://ova-app.firebaseio.com",
	projectId: "ova-app",
	storageBucket: "ova-app.appspot.com",
	messagingSenderId: "784286026543"
};

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
	db,
	auth,
};