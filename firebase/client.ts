import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBinX4QXgvhe3FKmXcxEm88QNSUtqm9Xnc",
  authDomain: "prepwise-e91fd.firebaseapp.com",
  projectId: "prepwise-e91fd",
  storageBucket: "prepwise-e91fd.firebasestorage.app",
  messagingSenderId: "853566293785",
  appId: "1:853566293785:web:4d43aa99d817f7f6ad6788",
  measurementId: "G-J444FZE4BS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;