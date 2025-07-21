import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

// Firebase configuration
// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXLjATJIJxu_18iXFyD1NenGCet-vpAx4",
  authDomain: "todo2-832e4.firebaseapp.com",
  projectId: "todo2-832e4",
  storageBucket: "todo2-832e4.firebasestorage.app",
  messagingSenderId: "713198507446",
  appId: "1:713198507446:web:48d6d31cbda8e861afdd17",
  measurementId: "G-9YDBDXNEE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance
export default app;