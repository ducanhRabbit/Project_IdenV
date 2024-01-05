import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Triangle } from "react-loader-spinner";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik, Form } from "formik";
import http from "../../axios/axios";
import ModalNotification from "./AuthNotification";


import signinWithGoogle from "./SigninWithGoogle";
import { auth } from "../../firebase/fireBase";
import { setCurrentUser } from "../../redux/reducers/userReducer";
import { SignUpForm } from "../../shared/types";
import getRandomImage from "../shared/Util";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

interface SignUpProps{
  setShowSignIn:React.Dispatch<React.SetStateAction<boolean>>
}

function SignUp({ setShowSignIn }:SignUpProps) {
  const dispatch = useAppDispatch();
  const [hidePassword, setHidePassword] = useState(true);
  const visiblePassword = () => {
    setHidePassword(!hidePassword);
  };

  const signUpHandler = async (values:SignUpForm) => {
    setIsLoading(true);
    try {
      const user = (
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )
      ).user;
      const register = await http.post("user/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.firstName + values.lastName,
        email: values.email,
        photo: getRandomImage(),
        uid: user.uid,
      });
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
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
          <h1 className="text-6xl text-center mb-4">
            Sign up to Identity <span>V</span>{" "}
          </h1>
          <div className="flex gap-4 mb-2">
            <button
              onClick={()=>{signinWithGoogle(dispatch, setCurrentUser)}}
              className="rounded-full p-3 bg-white"
            >
              <FcGoogle size={20} />
            </button>
            <button className="rounded-full p-3 bg-white">
              <FaFacebookF size={20} style={{ color: "#4267B2" }} />
            </button>
          </div>
          <div className="text-lg">~ or use your email account ~</div>
        </div>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, "Must be 15 characters or less")
              .required("Required"),
            lastName: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .required("Required")
              .min(6, "Password is too short - should be 6 chars minimum."),
          })}
          onSubmit={signUpHandler}
        >
          <Form>
            <div className="mb-4 ">
              <div className="relative  flex justify-between gap-4 mb-5">
                <div className="w-1/2 relative">
                  <label htmlFor="firstName" className="ml-2">
                    First Name:
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    className="placeholder:text-[#ebebeb]/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
                  />
                  <BiUserCircle
                    size={25}
                    style={{ color: "#ebebeb" }}
                    className="absolute top-1/2  right-4"
                  />
                  <p className="absolute -bottom-5 left-2 text-primary text-sm">
                    <ErrorMessage name="firstName" />
                  </p>
                </div>
                <div className="w-1/2 relative">
                  <label htmlFor="lastName" className="ml-2">
                    Last name:
                  </label>
                  <Field
                    name="lastName"
                    id="lastName"
                    placeholder="Last name"
                    type="text"
                    className="placeholder:text-[#ebebeb]/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
                  />
                  <BsTelephone
                    size={20}
                    style={{ color: "#ebebeb" }}
                    className="absolute top-1/2  right-4"
                  />
                  <p className="absolute -bottom-5 left-2 text-primary text-sm">
                    <ErrorMessage name="lastName" />
                  </p>
                </div>
              </div>
              <div className="relative mb-5">
                <label htmlFor="email" className="ml-2">
                  Email:
                </label>
                <Field
                  name="email"
                  type="text"
                  id="email"
                  placeholder="Email"
                  className="placeholder:text-[#ebebeb]/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
                />
                <AiOutlineMail
                  size={24}
                  style={{ color: "#ebebeb" }}
                  className="absolute top-1/2  right-4"
                />
                <p className="absolute -bottom-5 left-2 text-primary text-sm">
                  <ErrorMessage name="email" />
                </p>
              </div>
              <div className="relative mb-5">
                <label htmlFor="password" className="ml-2">
                  Password:
                </label>
                <Field
                  id="password"
                  name="password"
                  type={hidePassword ? "password" : "text"}
                  placeholder="Password"
                  className="placeholder:text-[#ebebeb]/70 text-white w-full bg-[#333333] rounded-xl border-2 border-transparent focus:border-2 focus:border-white focus:shadow-[0_0_10px] focus:shadow-[#f7f7f7]/70 outline-none px-5 py-4 duration-200 "
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
                <p className="absolute -bottom-5 left-2 text-primary text-sm">
                  <ErrorMessage name="password" />
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="mx-auto block px-10 py-4 bg-primary hover:bg-primary-darken duration-200 text-xl rounded-xl"
            >
              Sign up
            </button>
          </Form>
        </Formik>

        <div className="text-center">
          <span>Don't have an account?</span>
          <span
            onClick={() => {
              setShowSignIn(true);
            }}
            className="underline ml-1 cursor-pointer hover:text-primary"
          >
            Sign Up
          </span>
        </div>
      </div>
      {error && (
        <ModalNotification
          isSuccess={0}
          message={error}
          closeControl={() => setError("")}
        />
      )}
      {currentUser && (
        <ModalNotification
          isSuccess={1}
          message={"Sign up successfully"}
          redirect={"/artMuseum"}
        />
      )}
    </>
  );
}

export default SignUp;
