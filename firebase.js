import firebase from 'firebase';
import 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: 'AIzaSyAkzOxFYnQM5oUTB-aBm_NQdHmmw9JKAWs',
	authDomain: 'test-af2eb.firebaseapp.com',
	projectId: 'test-af2eb',
	storageBucket: 'test-af2eb.appspot.com',
	messagingSenderId: '576102253398',
	appId: '1:576102253398:web:0f77bd9e9d477569f70cf7',
};

const app = initializeApp(firebaseConfig);

export default firebase;
