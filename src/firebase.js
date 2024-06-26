import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDWjV1Y8tuXG-pfmn06C32Yabe5fyJe_3A",
  authDomain: "integracion-d1e60.firebaseapp.com",
  projectId: "integracion-d1e60",
  storageBucket: "integracion-d1e60.appspot.com",
  messagingSenderId: "626594391061",
  appId: "1:626594391061:web:9879844f5fcb6e57ff5a1c"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
