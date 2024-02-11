import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyva6HJIQsabhF8qJrUsKqNOQZuiLQgVQ",
  authDomain: "weatherapp-49219.firebaseapp.com",
  projectId: "weatherapp-49219",
  storageBucket: "weatherapp-49219.appspot.com",
  messagingSenderId: "428920452812",
  appId: "1:428920452812:web:b6351f37dc5f970847b469",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
