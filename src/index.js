import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import Main from './Main';
import firebase from './config/database'
import Config from   './config/app';



//AUTHENTICATION
var loggedIn=false;
if(Config.firebaseConfig.apiKey){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("User is signed in "+user.uid);
    loggedIn=true;

    displayApp();


  } else {
    // No user is signed in.
    console.log("No user is signed in ");
    loggedIn=false;
    displayApp();
    if(window.display){
        window.display();
    }

  }
})
}else{
  // No user is signed in.
    console.log("No user is signed in, step 1 ");
    loggedIn=false;
    displayApp();
    if(window.display){
        window.display();
    }
}


function displayApp(){
  if(loggedIn){
    ReactDOM.render(
      <Dashboard />,
      document.getElementById('root')
    );
  }else{
    ReactDOM.render(
      <Main />,
      document.getElementById('root')
    );
  }
}
displayApp();
