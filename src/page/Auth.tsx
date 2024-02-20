import { useState } from "react";
import SignIn from "../components/Auth/SignIn";
import SignUp from "../components/Auth/SignUp";

function Auth() {
  const [showSignin, setShowSignin] = useState(true);
  return (
    <>
      <video
        className="w-screen object-cover fixed top-0 md:aspect-video -z-10 block h-screen"
        src="https://raw.githubusercontent.com/ducanhRabbit/Video/main/Signet.mp4"
        autoPlay
        muted
        loop
      ></video>

      <div className="h-screen overflow-hidden relative bg-black/50">
        {showSignin ? (
          <SignIn setShowSignIn={setShowSignin} />
        ) : (
          <SignUp setShowSignIn={setShowSignin} />
        )}
      </div>
    </>
  );
}

export default Auth;
