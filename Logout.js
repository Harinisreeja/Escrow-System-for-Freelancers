// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBR4zfrQ7kgPW_F24LoHM_gxnvF3Xx4-JQ",
    authDomain: "escrow-system-eaf42.firebaseapp.com",
    projectId: "escrow-system-eaf42",
    storageBucket: "escrow-system-eaf42.appspot.com", //correcting here "escrow-system-eaf42.firebasestorage.app"
    messagingSenderId: "684977230734",
    appId: "1:684977230734:web:b92be74e98962859300adf"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth,(user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if (loggedInUserId){
        console.log(user);
        const docRef=doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
            } else {
                console.log("no document found matching id..!!")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    } else {
        console.log("USer Id not Found in  Local storage");
    }

  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click', ()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='Sign in.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })