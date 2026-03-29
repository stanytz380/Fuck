import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAGQqAiYCnWR7X8XkxEXCGu19PU45qXDnc",
  authDomain: "stanyappstore.firebaseapp.com",
  projectId: "stanyappstore",
  storageBucket: "stanyappstore.firebasestorage.app",
  messagingSenderId: "735017831251",
  appId: "1:735017831251:web:9fa4184ef141349fb9afa6",
  measurementId: "G-EM3RTMBKTN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);