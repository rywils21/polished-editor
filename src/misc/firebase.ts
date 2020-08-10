import firebaseClient, { app } from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appID: process.env.REACT_APP_FIREBASE_APP_ID
};

export class Firebase {
  app: app.App;

  constructor() {
    this.app = firebaseClient.initializeApp(firebaseConfig);
  }

  onAuthStateChanged(callback: (user: firebaseClient.User | null) => void) {
    this.app.auth().onAuthStateChanged(callback);
  }

  signOut() {
    this.app
      .auth()
      .signOut()
      .catch((err: any) => {
        console.error("Error sigining out: ", err);
      });
  }

  async createEmailAccount(email: string, password: string) {
    return this.app
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error: any) => {
        console.error("Error creating account: ", error);
        return error;
      });
  }

  async signInWithEmailAccount(email: string, password: string) {
    return this.app
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error: any) => {
        console.error("Error signin in: ", error);
        return error;
      });
  }
}

export const firebase = new Firebase();
