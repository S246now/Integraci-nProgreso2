import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC4AMtpdqIrFGJvCpH6R_dOmdbTZn72N64",
  authDomain: "integracion-3bba0.firebaseapp.com",
  projectId: "integracion-3bba0",
  storageBucket: "integracion-3bba0.appspot.com",
  messagingSenderId: "2748154650",
  appId: "1:2748154650:web:d20483cacfa2b488ae22a3"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
