import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: "image-processing-service-31a8c",
  storageBucket: "image-processing-service-31a8c.firebasestorage.app",
  messagingSenderId: "297225177906",
  appId: "1:297225177906:web:e7a050f22b21e66cb0e52b",
  measurementId: "G-H6GXCFEM0J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(firebaseConfig);
export { app as firebaseApp, db, analytics };