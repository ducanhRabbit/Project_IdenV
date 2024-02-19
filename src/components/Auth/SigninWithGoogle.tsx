import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../../firebase/fireBase";
import http from "../../axios/axios";

const signinWithGoogle = (dispatch: any, setCurrentUser: any) => {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      try {
        const { uid } = result.user;

        const signIn = await http.post("user/login", {
          uid: uid,
        });
          const currentUser = {
            accessToken: signIn.data.token,
            uid: signIn.data.uid,
          };
          localStorage.setItem("user", JSON.stringify(currentUser));
          dispatch(setCurrentUser(signIn.data));
      } catch (err) {
        const { uid, displayName, email, photoURL } = result.user;
        await http.post("user/register", {
          userName: displayName,
          email: email,
          photo: photoURL,
          uid,
        });
        const signIn = await http.post("user/login", {
          uid,
        });
        const currentUser = {
          accessToken: signIn.data.token,
          uid: signIn.data.uid,
        };
        localStorage.setItem("user", JSON.stringify(currentUser));
        dispatch(setCurrentUser(signIn.data));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default signinWithGoogle;
