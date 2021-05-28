import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAIEtQLa_1GY6qIVk_npdke43ZLQ57DwW4",
  authDomain: "cs353c-51bbb.firebaseapp.com",
  databaseURL:
    "https://cs353c-51bbb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cs353c-51bbb",
  storageBucket: "cs353c-51bbb.appspot.com",
  messagingSenderId: "904959131599",
  appId: "1:904959131599:web:e73dda6889e4ae40a0dcba"
});

export const auth = app.auth();
export default app;
