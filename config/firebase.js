// Firebase Configuration for Noa
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDYCLCClVCksr31bfhb7w_3JlVaDCbEbRo",
  authDomain: "noa-app-ai7.firebaseapp.com",
  projectId: "noa-app-ai7",
  storageBucket: "noa-app-ai7.firebasestorage.app",
  messagingSenderId: "87526008291",
  appId: "1:87526008291:web:de8a6c42a05de4de82acd6",
  measurementId: "G-JDREE685YP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'australia-southeast1');
export default app;