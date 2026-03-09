// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
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

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
  
function showMessage(message,divId){
    const messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
}

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
        window.location.href='index.html';
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