import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAI5TxSzt4kQPqLjQaEBHLBIGoA-6-pKpc",
  authDomain: "baas-demo-e7307.firebaseapp.com",
  projectId: "baas-demo-e7307",
  storageBucket: "baas-demo-e7307.firebasestorage.app",
  messagingSenderId: "229892755138",
  appId: "1:229892755138:web:031c8900ad61cb55bc755b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();