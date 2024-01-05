import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";



import { auth } from "../../firebase/fireBase";
import http from "../../axios/axios";


const signinWithGoogle = (dispatch:any,setCurrentUser:any) => {
  const googleProvider = new GoogleAuthProvider();
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      try {
        const { uid, displayName, email,photoURL } = result.user;

        const isSigned = await http.get(`user/${uid}`)
        console.log(isSigned)
        if(isSigned){
          const signIn =  await http.post('user/login',{
            uid: uid
          })
          const currentUser = {
            accessToken: signIn.data.token,
            uid: signIn.data.uid
      
          }
          localStorage.setItem('user',JSON.stringify(currentUser))
          dispatch(setCurrentUser(signIn.data))
          
        }else{
          const register = await http.post("user/register",{
            firstName: displayName,
            userName: displayName,
            email: email,
            photo: photoURL,
            uid
          })
          const signIn =  await http.post('user/login',{
            uid
          })
          const currentUser = {
            accessToken: signIn.data.token,
            uid: signIn.data.uid
      
          }
          localStorage.setItem('user',JSON.stringify(currentUser))
        }
      } catch (err) {
        console.log(err)
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default signinWithGoogle;
