import { ChangeEvent, useRef, useState } from "react";
import { BsCloudUploadFill, BsTrashFill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { AiFillSmile } from "react-icons/ai";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { OverflowNode } from "@lexical/overflow";
import "../css/CreatePost/CreatePost.css";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { $createTextNode, $getRoot, $insertNodes, CLEAR_EDITOR_COMMAND, LexicalEditor } from "lexical";
import { useMutation } from "@tanstack/react-query";
import http from "../axios/axios";
import axios, { AxiosResponse } from "axios";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MaxLengthPlugin from "../components/LexicalEditor/Plugins/MaxLengthPlugin";
import GetRefPlugin from "../components/LexicalEditor/Plugins/GetRefPlugin";
import { useAppSelector } from "../redux/hook";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { Inspiration } from "../shared/types";

function CreatePost() {
  const theme = {
    paragraph: "title-input",
    placeholder: "title-placeholder",
  };

  const titleConfig = {
    namespace: "MyEditor",
    theme,
    nodes: [OverflowNode],
    onError: (err: Error) => {
      console.log(err);
    },
  };

  const theme1 = {
    paragraph: "descr-input",
    placeholder: "descr-placeholder",
  };

  const descrConfig = {
    namespace: "MyEditor1",
    editable: true,
    theme: theme1,
    nodes: [OverflowNode],
    onError: (err: Error) => {
      console.log(err);
    },
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ImgPost, setImgPost] = useState<any|null>(null);
  const [imgErr, setImgErr] = useState(false);
  const titleRef = useRef<LexicalEditor|null>(null);
  const descriptionRef = useRef<LexicalEditor|null>(null);
  const imageRef = useRef<HTMLInputElement|null>(null);
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const handleEmojiSelect = (e: any) => {
    if (descriptionRef.current) {
      descriptionRef.current.update(() => {
        const node = $createTextNode(e.native);
        $insertNodes([node]);
      });
    }
  };
  const handleSubmit = async():Promise<AxiosResponse<Inspiration>|undefined>=> {
    if(titleRef.current && descriptionRef.current){
      const plainTitle = titleRef.current
        .getEditorState()
        .read(() => $getRoot().getTextContent());
      const formData = {
        plainTitle,
        title: JSON.stringify(titleRef.current.getEditorState()),
        description: JSON.stringify(descriptionRef.current.getEditorState()),
        heightImg: ImgPost?.data.height,
        widthImg: ImgPost?.data.width,
        artworkURL: ImgPost?.data.display_url,
      };
      return await http.post("inspiration/create", formData);
    }
  };
  const creatPostMutation = useMutation({
    mutationKey: ["createPost"],
    mutationFn: handleSubmit,
  });

  const postImgMutation = useMutation({
    mutationKey: ["ImagePost"],
    mutationFn: async (img:File):Promise<AxiosResponse<any>> => {
      const res = await axios({
        method: "post",
        url: `https://api.imgbb.com/1/upload?key=c43cc945e93c5b72339395d37c97981c`,
        data: { image: img },
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      return res
    },
    onSuccess: (data) => {
      setImgPost(data.data);
    },
  });
  const postImage = async (e:ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      postImgMutation.mutate(e.target?.files[0]);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="w-full font-witch relative bg-black  min-h-screen py-8">
        <div className="created-container mx-2  flex justify-center">
          <div className="created-wrapper mt-[70px] w-full md:w-[880px] h-full min-h-[550px] py-4 bg-white rounded-[16px]">
            <div className="header text-center">
              <h1 className="text text-5xl pt-4 pb-8">Inspiration</h1>
            </div>
            <div className="create-inspiration ">
              <div className="flex flex-col-reverse gap-10 md:flex-row">
                <div className="md:w-[380px] px-3 shrink-0 h-full md:px-5">
                  {ImgPost ? (
                    <>
                      <div className="min-h-[550px] flex items-center justify-center">
                        <div className="img-wrapper group relative">
                          <LazyLoadImage
                            className="rounded-2xl"
                            src={ImgPost.data.display_url}
                            effect={"blur"}
                          ></LazyLoadImage>
                          <div
                            className="absolute p-3 group-hover:block md:hidden rounded-full top-2 left-2 border-2 border-spacing-1 bg-white hover:bg-[#ebebeb]"
                            onClick={() => {
                              if(imageRef.current){
                                imageRef.current.value = "";
                                setImgPost(null);
                              }
                            }}
                          >
                            <BsTrashFill size={20} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={
                          "upload-area h-[550px] w-full min-h-[550px] p-3 rounded-[8px] border cursor-pointer " +
                          (imgErr ? "bg-[#e6002308]" : "bg-[#ebebeb]")
                        }
                      >
                        <label
                          htmlFor="upload-img"
                          className={
                            "w-full h-full border-dashed gap-4 border-2 flex cursor-pointer flex-col relative justify-center items-center rounded-lg " +
                            (imgErr ? "border-red-500" : "border-black")
                          }
                        >
                          {postImgMutation.isPending ? (
                            <>
                              <TailSpin
                                height="80"
                                width="80"
                                color="#cc0000"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                              />
                            </>
                          ) : (
                            <>
                              {imgErr ? (
                                <>
                                  <div>
                                    <GiCancel size={30} color="#cc0000" />
                                  </div>
                                  <div className="text-xl text-[#cc0000]">
                                    An image is required
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>
                                    <BsCloudUploadFill size={30} />
                                  </div>
                                  <div className="text-xl">Click to upload</div>
                                  <div className="absolute bottom-10 text-center">
                                    Recommendation: Use high-quality .jpg files
                                    less than 20MB
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </label>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    id="upload-img"
                    onChange={postImage}
                    ref={imageRef}
                  />

                  <div className="upload-btn mt-3 flex justify-center">
                    <button
                      onClick={() => {
                        if (imageRef.current?.files && imageRef.current.files.length === 0) {
                          setImgErr(true);
                        } else {
                          creatPostMutation.mutateAsync().then((data) => {
                            toast(
                              <>
                                <div className="flex justify-between items-center font-witch">
                                  <img
                                    className="inline-block w-[40px] object-contain h-[40px]"
                                    src={ImgPost?.data.display_url}
                                    alt=""
                                  />
                                  <span>Saved to gallery</span>

                                  <button
                                    onClick={() => {
                                      navigate(
                                        `/artMuseum/inspiration/${data?.data._id}`
                                      );
                                    }}
                                    className={"py-2 px-3 primary-btn"}
                                  >
                                    See it now
                                  </button>
                                </div>
                              </>,
                              {
                                position: "bottom-center",
                                closeButton: false,
                                theme: "light",
                                hideProgressBar: true,
                                autoClose: 2000,
                              }
                            );
                            setTimeout(() => {
                              if(imageRef.current && titleRef.current && descriptionRef.current){
                                imageRef.current.value = "";
                                setImgPost(null);
                                titleRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND,undefined)
                                descriptionRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND,undefined)
                                
                              }
                            }, 3000);
                          });
                        }
                      }}
                      className={"py-2 px-4 w-3/4 text-xl primary-btn"}
                    >
                      Post
                    </button>
                  </div>
                </div>
                <div className="flex-auto px-5 mt-3">
                  <div className="title-and-description  ">
                    <div className="title relative">
                      <LexicalComposer initialConfig={titleConfig}>
                        <PlainTextPlugin
                          contentEditable={
                            <ContentEditable className=" relative outline-none after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:bg-black after:w-full" />
                          }
                          placeholder={
                            <div className="absolute text-4xl top-0 pl-1">
                              Add your title
                            </div>
                          }
                          ErrorBoundary={LexicalErrorBoundary}
                        ></PlainTextPlugin>
                        <GetRefPlugin
                          ref={titleRef}
                        ></GetRefPlugin>
                        <CharacterLimitPlugin maxLength={40} charset="UTF-16" />
                        <MaxLengthPlugin maxLength={40} />
                        <ClearEditorPlugin />
                      </LexicalComposer>
                      <div className="flex justify-between text-xs mt-1">
                        <div className="w-[calc(100%-26px)]">
                          Your first 40 characters are what usually show up in
                          feed
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="author my-4">
                    <div className="flex items-center gap-4">
                      <div className="">
                        <img
                          className="w-[72px] h-[72px] rounded-full"
                          src={currentUser?.photo}
                          alt=""
                        />
                      </div>
                      <div>{currentUser?.userName}</div>
                    </div>
                  </div>
                  <div className="description">
                    <div className="flex items-center">
                      <div className="description-input flex-1 relative">
                        <LexicalComposer initialConfig={descrConfig}>
                          <PlainTextPlugin
                            contentEditable={
                              <ContentEditable className="relative outline-none after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:bg-black after:w-full" />
                            }
                            placeholder={
                              <div className="absolute top-0 left-1">
                                Description
                              </div>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                          ></PlainTextPlugin>
                          <GetRefPlugin ref={descriptionRef}></GetRefPlugin>
                          <CharacterLimitPlugin maxLength={200} charset="UTF-16"/>
                          <MaxLengthPlugin maxLength={200} />
                          <ClearEditorPlugin />
                        </LexicalComposer>
                        <div className="flex justify-between text-xs mt-1">
                          <div className="w-[calc(100%-26px)]">
                            Your first 40 characters are what usually show up in
                            feed
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEmojiPicker(!showEmojiPicker);
                          }}
                          className="emotion relative p-2 cursor-pointer"
                        >
                          <AiFillSmile size={30} />
                        </div>
                        {showEmojiPicker && (
                          <div className="absolute -right-3 md:-top-[150px] md:right-12">
                            <Picker
                              onClickOutside={() => {
                                setShowEmojiPicker(false);
                              }}
                              onEmojiSelect={handleEmojiSelect}
                              data={data}
                              previewPosition={"none"}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
