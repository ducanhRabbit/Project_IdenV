import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChangeEvent, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as Yup from "yup";
import http from "../axios/axios";
import { setCurrentUser } from "../redux/reducers/userReducer";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase/fireBase";
import BlackBackDrop from "../components/shared/BlackBackDrop"
import { useAppDispatch, useAppSelector } from "../redux/hook";
function EditProfile() {
  const [showReAuth, setShowReAuth] = useState<{[key:string]:string}|null>(null);
  const user = auth.currentUser;
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleSubmitPublicForm = async (publicFormData:{[key:string]:string}) => {
    try {
      const res = await http.put(`user/${currentUser._id}`, {
        ...publicFormData,
      });
      dispatch(setCurrentUser(res.data))
      toast.success(<span className="font-witch">Saved</span>,{
        hideProgressBar:true,
        theme:"colored"
      });
    } catch (err) {
      console.log(err);
    }
  };
  const updatePasswordHandler = (passWordData:{[key:string]:string}) => {
    if(auth.currentUser){
      updatePassword(auth.currentUser, passWordData.newPassword)
        .then(() => {
          toast.success(<div className="font-witch">Password changed</div>, {
            theme: "colored",
            hideProgressBar: true,
          });
          setShowReAuth(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const updateEmailHandler = async (emailData:string) => {
    try {
      if(auth.currentUser){

        await http.put(`user/${currentUser._id}`, {
          email: emailData,
        });
        // dispatch(setCurrentUser({...currentUser,email:emailData}))
        updateEmail(auth.currentUser, emailData)
          .then(() => {
            toast.success(<div className="font-witch">Email changed</div>, {
              theme: "colored",
              hideProgressBar: true,
            });
            setShowReAuth(null);
          })
          .catch((err) => {
            console.log(err.response.data.message);
          });
      }
    } catch (err:any) {
      if (err.response.data.message.includes("E11000")) {
        toast.error(
          <div className="error-toast font-witch text-lg">
            Email already used
          </div>,
          {
            theme: "colored",
            hideProgressBar: true,
          }
        );
      }
    }
  };
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const changeProfileImage = async (e:ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoadingImg(true);
      if(e.target.files){
        const dataImg = await axios({
          method: "post",
          url: `https://api.imgbb.com/1/upload?key=c43cc945e93c5b72339395d37c97981c`,
          data: { image: e.target.files[0] },
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        const editProfile = http
          .put(`user/${currentUser._id}`, {
            photo: dataImg.data.data.display_url,
          })
          .then(() => {
            dispatch(
              setCurrentUser({
                ...currentUser,
                photo: dataImg.data.data.display_url,
              })
            );
          })
          .finally(() => {
            setIsLoadingImg(false);
          });
      }

    } catch (err) {
      console.log(err);
    }
  };

  const reauthHandler = (data:{[key:string]:string}) => {
    if(user?.email){
      const credential = EmailAuthProvider.credential(
        user.email,
        data.oldPassword
      );
      reauthenticateWithCredential(user, credential)
        .then(() => {
          if (showReAuth?.type === "email") {
            updateEmailHandler(showReAuth.email);
          } else if (showReAuth?.type === "password") {
            updatePasswordHandler(showReAuth);
          }
        })
        .catch(() => {
          toast.error(<div className="font-witch">Wrong Password</div>, {
            theme: "colored",
          });
        });
    }
  };

  return (
    <>
      {showReAuth && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="reAuth-wrapper z-50 fixed top-1/2 left-1/2 bg-white font-witch min-w-[500px] rounded-xl p-4 -translate-x-1/2 -translate-y-1/2"
          >
            <Formik
              initialValues={{
                oldPassword: "",
              }}
              onSubmit={reauthHandler}
            >
              <Form>
                <div className="text-xl font-bold text-center">
                  Re-Authentication required
                </div>
                <p className="text-center text-sm mb-5">
                  Please enter your password to confirm this change
                </p>
                <Field
                  type="password"
                  name="oldPassword"
                  placeholder="Password"
                  className={"input-form py-3 px-5 w-full mb-7"}
                />
                <div className="text-center">
                  <button
                    type="submit"
                    className="primary-btn text-lg rounded-full bg-[#cc0000] text-white min-w-[60px] hover:bg-[#ac0000] active:scale-95 duration-75 py-2 px-4"
                  >
                    Continue
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
          <BlackBackDrop
            onCloseBlackBackdrop={() => {
              setShowReAuth(null);
            }}
          ></BlackBackDrop>
        </>
      )}
      <ToastContainer />
      <div className="bg-black w-full min-h-screen font-witch pt-[100px] pb-10">
        <div className="edit-container flex justify-center px-4 ">
          <div className="edit-wrapper flex flex-col md:flex-row justify-between p-4 bg-white rounded-[16px] overflow-hidden">
            <div className="public-form pb-8 md:w-1/2 px-2">
              <div className="public-header text-center md:text-left mb-8">
                <h2 className="text-3xl font-semibold tracking-wider">
                  Public Profile
                </h2>
                <p>People visiting your profile will see the following info</p>
              </div>
              <div className="photo">
                <div className="text-sm select-none">Photo</div>
                <div className="avatar flex justify-start items-center gap-2">
                  <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden">
                    <LazyLoadImage
                      src={currentUser?.photo}
                      effect="blur"
                      className={`rounded-full object-cover h-full w-full ${
                        isLoadingImg ? "blur-[2px]" : ""
                      }`}
                      wrapperClassName="w-full h-full"
                    ></LazyLoadImage>
                    {isLoadingImg && (
                      <div className="absolute top-0 w-full h-full flex justify-center bg-black/30 items-center">
                        <Oval
                          width={50}
                          height={50}
                          color={"#cc0000"}
                          secondaryColor=""
                        />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImg"
                    className="change py-2 px-4 primary-btn cursor-pointer"
                  >
                    Change
                  </label>
                  <input
                    id="profileImg"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={changeProfileImage}
                  />
                </div>
              </div>
              {currentUser && <Formik
                enableReinitialize={true}
                initialValues={{
                  firstName: currentUser?.firstName,
                  lastName: currentUser?.lastName,
                  userName: currentUser?.userName,
                  story: currentUser?.story || "",
                }}
                validationSchema={Yup.object({
                  firstName: Yup.string()
                    .max(10, "Must be 10 characters or less")
                    .required("Required"),
                  lastName: Yup.string()
                    .max(20, "Must be 20 characters or less")
                    .required("Required"),
                  userName: Yup.string()
                    .max(30, "Must be 30 characters or less")
                    .required("Required"),
                })}
                onSubmit={handleSubmitPublicForm}
              >
                <Form>
                  <div className="fullName flex gap-2 my-2">
                    <div className="firstName w-1/2">
                      <label htmlFor="firstName" className="text-sm">
                        First name
                      </label>
                      <Field
                        className="input-form w-full py-2 px-4 "
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                      />
                      <p className=" text-red-500 text-sm">
                        <ErrorMessage name="firstName" />
                      </p>
                    </div>
                    <div className="lastName flex-auto">
                      <label htmlFor="lastName" className="text-sm">
                        Last name
                      </label>
                      <Field
                        className="input-form w-full py-2 px-4"
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                      />
                      <p className=" text-red-500 text-sm">
                        <ErrorMessage name="lastName" />
                      </p>
                    </div>
                  </div>
                  <div className="userName my-4">
                    <label htmlFor="userName" className="text-sm">
                      User name
                    </label>
                    <Field
                      className="input-form py-2 px-4 w-full"
                      type="text"
                      id="userName"
                      name="userName"
                      placeholder="Choose wisely and other can find you"
                    />
                    <div className=" text-red-500 text-sm">
                      <ErrorMessage name="userName" />
                    </div>
                  </div>
                  <div className="about my-2">
                    <label htmlFor="about" className="text-sm">
                      About
                    </label>
                    <Field
                      as="textarea"
                      className="resize-none w-full input-form py-2 px-4"
                      name="story"
                      id="about"
                      rows="3"
                      placeholder="Tell your story"
                    ></Field>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="primary-btn rounded-full bg-[#cc0000] text-white min-w-[100px] hover:bg-[#ac0000] active:scale-95 duration-75 py-2 px-4"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              </Formik>}
              
            </div>
            <div className="private-form px-2">
              <div className="public-header text-center md:text-left mb-8">
                <h2 className="text-3xl font-semibold tracking-wider">
                  Personal Information
                </h2>
                <p>
                  This information is private and won't show up in your public
                  profile
                </p>
              </div>
              {currentUser && <Formik
                initialValues={{
                  email: currentUser.email,
                }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email("Invalid email address")
                    .required("Required"),
                })}
                onSubmit={(emailData) => {
                  setShowReAuth({
                    type: "email",
                    ...emailData,
                  });
                }}
                enableReinitialize={true}
              >
                <Form>
                  <div className="email my-2 mb-5 relative">
                    <label htmlFor="email" className="text-sm">
                      Email
                    </label>
                    <div className="flex gap-4 ">
                      <Field
                        className="input-form py-2 px-4 flex-1"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Abc@gmail.com"
                      />
                      <div className="absolute -bottom-5 left-0 text-red-500 text-sm">
                        <ErrorMessage name="email" />
                      </div>
                      <button
                        type="submit"
                        className="py-2 px-4 block primary-btn"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>}
              <div className="password my-2">
                <div className="text-xl">Password Changes</div>
                <Formik
                  initialValues={{
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={Yup.object({
                    newPassword: Yup.string()
                      .required("Required")
                      .min(
                        6,
                        "Password is too short - should be 6 chars minimum."
                      ),
                    confirmPassword: Yup.string()
                      .required("Required")
                      .oneOf([Yup.ref("newPassword")], "Passwords don't match"),
                  })}
                  onSubmit={(passWordData) => {
                    setShowReAuth({
                      type: "password",
                      ...passWordData,
                    });
                  }}
                >
                  <Form>
                    <div className="newPassword my-2 mb-4">
                      <label htmlFor="newPassword" className="text-sm">
                        New password
                      </label>
                      <Field
                        className="input-form py-2 px-4 w-full"
                        type="text"
                        id="newPassword"
                        name="newPassword"
                        placeholder=""
                      />
                      <p className=" text-red-500 text-sm">
                        <ErrorMessage name="newPassword" />
                      </p>
                    </div>
                    <div className="confirmPassword my-2">
                      <label htmlFor="confirmPassword" className="text-sm">
                        Confirm password
                      </label>
                      <Field
                        className="input-form py-2 px-4 w-full"
                        type="text"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder=""
                      />
                      <p className=" text-red-500 text-sm">
                        <ErrorMessage name="confirmPassword" />
                      </p>
                    </div>
                    <div className="text-center mt-4">
                      <button
                        type="submit"
                        className="py-2 px-4 text-lg primary-btn"
                      >
                        Change Password
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
              <div className="delete-account mt-16">
                <div className="flex md:flex-row flex-col  gap-2 justify-between items-center">
                  <div className="text-xl font-semibold tracking-wide">
                    Delete your account and data
                  </div>
                  <button className="secondary-btn  py-3 px-4">
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
