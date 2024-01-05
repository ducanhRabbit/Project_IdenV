import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAXsORoJxP74FrLLMvluMKrIpIogRuzUNA",
    authDomain: "identityv-fd11f.firebaseapp.com",
    projectId: "identityv-fd11f",
    storageBucket: "identityv-fd11f.appspot.com",
    messagingSenderId: "293671414220",
    appId: "1:293671414220:web:739ee30c0dbdd3fa15d569",
    measurementId: "G-N926WK9QJ7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);