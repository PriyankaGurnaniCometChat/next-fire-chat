import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import ChatRoom from "../Components/ChatRoom";

// initialization
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function Home() {
  // initial states
  const [user, setUser] = useState(() => auth.currentUser);

  // automatically check a user's auth status
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // update the user current state
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // sign in
  const signInWithGoogle = async () => {
    // get the google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    // signing in user
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  // signout
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container">
      <main>
        {user ? (
          <>
            <nav id="sign_out">
              <h2>Chat With Friends</h2>
              <button onClick={signOut}>Sign Out</button>
            </nav>
            <ChatRoom user={user} db={db} />
          </>
        ) : (
          <section id="sign_in">
            <h1>Welcome to Chat Room</h1>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
          </section>
        )}
      </main>
    </div>
  );
}