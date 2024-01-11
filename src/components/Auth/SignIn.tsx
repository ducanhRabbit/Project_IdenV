import React, { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Triangle } from "react-loader-spinner";
import { ErrorMessage, Field, Form, Formik } from "formik";
import signinWithGoogle from "./SigninWithGoogle";
import http from "../../axios/axios";
import { auth } from "../../firebase/fireBase";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setCurrentUser } from "../../redux/reducers/userReducer";
import AuthNotification from "./AuthNotification";
import { SignInForm } from "../../shared/types";

interface SignInProps{
  setShowSignIn:React.Dispatch<React.SetStateAction<boolean>>
}

function SignIn({ setShowSignIn }:SignInProps) {
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleSignInWithGoogle = () => {
    signinWithGoogle(dispatch,setCurrentUser);
  };
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signInHandler = async (values:SignInForm) => {
    try {
      setIsLoading(true);
      const user = (
        await signInWithEmailAndPassword(auth, values.email, values.password)
      ).user;
      const signIn = await http.post("user/login", {
        uid: user.uid,
      });

      const currentUser = {
        accessToken: signIn.data.token,
        uid: signIn.data.uid,
      };
      localStorage.setItem("user", JSON.stringify(currentUser));
      dispatch(setCurrentUser(signIn.data));
    } catch (err:any) {
      setError(err.code);
    }
    setIsLoading(false);
  };
  const [hidePassword, setHidePassword] = useState(true);
  const visiblePassword = () => {
    setHidePassword(!hidePassword);
  };
  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen bg-black/60 flex justify-center relative z-50 items-center">
          <Triangle
            height="120"
            width="120"
            color="#cc0000"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      )}
      <div className="absolute px-4 py-8 font-witch  text-white top-1/2 -translate-y-1/2 w-full max-w-xl left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-6xl text-center mb-4">Sign in to Identity <span className="text-primary">V</span></h1>
          <div className="flex gap-4 mb-2">
            <button
              onClick={handleSignInWithGoogle}
              className="rounded-full p-3 bg-white"
            >
              <FcGoogle size={20} />
            </button>
            <button
              className="rounded-full p-3 bg-white"
            >
              <FaFacebookF size={20} style={{ color: "#4267B2" }} />
            </button>
          </div>
          <div className="text-lg">~ or use your email account ~</div>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .required("Required")
              .min(6, "Password is too short - should be 6 chars minimum."),
          })}
          onSubmit={signInHandler}
          className="mb-4"
        >
          <Form>
            <div className="relative mb-6">
              <label htmlFor="email" className="ml-2">
                Email:
              </label>
              <Field
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                className="placeholder:text-grey-100/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
              />
              <AiOutlineMail
                size={24}
                style={{ color: "#ebebeb" }}
                className="absolute top-1/2  right-4"
              />
              <p className="absolute -bottom-5 left-2 text-red-500 text-sm">
                <ErrorMessage name="email" />
              </p>
            </div>
            <div className="relative mb-6">
              <label htmlFor="passsword" className="ml-2">
                Password:
              </label>
              <Field
                id="password"
                name="password"
                type={hidePassword ? "password" : "text"}
                placeholder="Password"
                className="placeholder:text-grey-100/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
              />
              {hidePassword ? (
                <AiOutlineEyeInvisible
                  size={24}
                  style={{ color: "#ebebeb" }}
                  onClick={visiblePassword}
                  className="absolute top-1/2 cursor-pointer right-4 "
                />
              ) : (
                <AiOutlineEye
                  size={24}
                  style={{ color: "#ebebeb" }}
                  onClick={visiblePassword}
                  className="absolute top-1/2 cursor-pointer right-4 "
                />
              )}
              <p className="absolute -bottom-5 left-2 text-red-500 text-sm">
                <ErrorMessage name="password" />
              </p>
            </div>

            <button
              type="submit"
              className="mx-auto block px-10 py-4 bg-primary hover:bg-primary-darken duration-200 text-xl rounded-xl"
            >
              Sign in
            </button>
          </Form>
        </Formik>

        <div className="text-center">
          <span>Don't have an account?</span>
          <button
            onClick={() => {
              setShowSignIn(false);
            }}
            className="ml-2 hover:underline hover:text-primary"
          >
            Sign In
          </button>
        </div>
      </div>
      {error && (
        <AuthNotification
          isSuccess={0}
          message={error}
          closeControl={() => setError("")}
        />
      )}
      {currentUser && (
        <AuthNotification
          redirect={"/artMuseum"}
          isSuccess={1}
          message={"Sign in successfully"}
        />
      )}
    </>
  );
}

export default SignIn;
