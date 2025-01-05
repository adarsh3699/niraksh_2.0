import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCBdnOoONAPhcl0L0O1VR8B9tfE4vmtrLw",
	authDomain: "sih-2024-74fde.firebaseapp.com",
	projectId: "sih-2024-74fde",
	storageBucket: "sih-2024-74fde.appspot.com",
	messagingSenderId: "445147597466",
	appId: "1:445147597466:web:82843d4a8dab771f7cad23",
	measurementId: "G-8PPFSQ01EM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth();
const database = getFirestore();

export { storage, app, auth, database };
