import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAEf86rJP1_Sq639WsgwDVOQZSLC1v_uyU",
  authDomain: "my-trial-app-cae53.firebaseapp.com",
  projectId: "my-trial-app-cae53",
  storageBucket: "my-trial-app-cae53.firebasestorage.app",
  messagingSenderId: "613708676107",
  appId: "1:613708676107:web:bb843eb5cd36e43539db0e",
  measurementId: "G-SF06G0W7XZ"
};

const app = initializeApp(firebaseConfig);
console.log("🚀 ~ app:", app)

export const auth = initializeAuth(app)
console.log("🚀 ~ auth:", auth)
// Platform.OS === 'web'
//   ? getAuth(app)
//   : initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
//   });

export const db = getFirestore(app);

export default app;