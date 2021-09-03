// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhOMZwsth7ZNzB0WIiG38gkF02_jVXOUw",
  authDomain: "tiny-love-letter.firebaseapp.com",
  projectId: "tiny-love-letter",
  storageBucket: "tiny-love-letter.appspot.com",
  messagingSenderId: "928842499706",
  appId: "1:928842499706:web:83850e4150cf69b1caddc3",
  databaseURL: "https://tiny-love-letter-default-rtdb.europe-west1.firebasedatabase.app/"

  
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

const database = getDatabase();


function writeUserData(tokenId: string, name: string) {
  const db = getDatabase();
  return set(ref(db, 'token/' + tokenId), {
    username: name
  });
}

function readUserData(tokenId: string) {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `token/${tokenId}`)).then((snapshot) => {
    return snapshot.val();
  }).catch((error) => {
    console.error(error);
  });
}

export { writeUserData, readUserData }