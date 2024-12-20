// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

function showMessage(message,divId){
    const messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
}

const signUp =document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const confirmPassword=document.getElementById('confirmpassword').value;
    const firstName=document.getElementById('firstname').value;
    const lastName=document.getElementById('lastname').value;

    if(password !== confirmPassword) {
        showMessage('Passwords do not match!','signUpMessage');
        return;
    }

    const auth=getAuth();
    const db=getFirestore(app);

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName: lastName,
            // confirmPassword: confirmPassword,
        };
        // showMessage('Account Created Successfully','signUpMessage');
        const docRef=doc(db,"users",user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            showMessage('Account Created Successfully','signUpMessage');
            window.location.href='Sign up.html';
        })
        .catch((error)=>{
            console.error("error writing document",error)
            showMessage('Error saving user data','signUpMessage');
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists!!','signUpMessage');
        } else {
            showMessage('unable to create User. Please try again','signUpMessage');
        }
    })
})

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        showMessage('Login is successful','signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid);
        window.location.href='homepage.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password','signInMessage');
        } else {
            showMessage('Account does not Exist','signInMessage');
        }
    })
})