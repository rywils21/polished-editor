import { User } from "firebase";
import { firebase } from "./../misc/firebase";
import { AppData, AuthState } from "types";
import { useEffect } from "react";

export function useAuth(data: AppData) {
  useEffect(() => {
    firebase.onAuthStateChanged(async (user: User | null) => {
      console.log(">>>> fired auth state changed: ", user);
      if (user) {
        data.authState = AuthState.INITIALIZING_SESSION;

        const email = user.email;

        if (email !== null && user.uid) {
          data.uid = "123-firebase-failed";

          data.authState = AuthState.AUTHENTICATED;

          try {
            const userData = await initializeSession(email, user.uid);
            // TODO: send user data down to electron

            data.uid = user.uid;
            data.userData = userData;
            // TODO: process user data to determine state of the app

            data.authState = AuthState.AUTHENTICATED;
          } catch (e) {
            data.uid = "123-firebase-failed";

            data.authState = AuthState.AUTHENTICATED;
          }
        } else {
          data.authState = AuthState.MISSING_EMAIL;
        }
      } else {
        data.authState = AuthState.UNAUTHENTICATED;
      }

      if (data.authStatus === "initializing") {
        data.authStatus = "ready";
      }
    });
  }, [data]);
}

async function initializeSession(email: string, uid: string) {
  // TODO: set up authentication for these endpoints
  const response = await fetch(
    `${process.env.REACT_APP_FUNCTION_HOST}/user/initialize-session?email=${email}&id=${uid}`
  );
  const result = await response.json();
  return result;
}
