import { Fragment, useEffect, useRef, useState } from "react";
import { HiHeart } from "react-icons/hi";
import { FiShare } from "react-icons/fi";
import { AiOutlineSend, AiOutlineSmile } from "react-icons/ai";
import { BsThreeDots, BsLink45Deg } from "react-icons/bs";
import "../css/DetailArt/DetailArt.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../axios/axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "../css/EmojiPicker/EmojiPicker.css";
import {
  $createTextNode,
  $getRoot,
  $insertNodes,
  CLEAR_EDITOR_COMMAND,
  LexicalEditor,
} from "lexical";
import MyLexicalEditor from "../components/LexicalEditor/MyLexicalEditor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ToastContainer, toast } from "react-toastify";
import { setCurrentUser } from "../redux/reducers/userReducer";
import { Menu, Transition } from "@headlessui/react";

import useScreenSize from "../hook/useScreenSize";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import BlackBackdrop from "../components/shared/BlackBackDrop";
import { ActiveComment, ActiveEmoji, Inspiration } from "../shared/types";
import SetInitialTextPlugin from "../components/LexicalEditor/Plugins/SetInitialTextPlugin";
import CommentPost from "../components/ArtMuseum/DetailArt/CommentPost";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { AxiosResponse } from "axios";
import SingleLinePlugin from "../components/LexicalEditor/Plugins/SingleLinePlugin";
import EditInspirationModal from "../components/ArtMuseum/DetailArt/EditInspirationModal";
function DetailArt() {
  const { id } = useParams();
  const ref = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [height, setHeight] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState<ActiveEmoji>({
    active: false,
    type: "",
  });
  const { currentUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { isMobile } = useScreenSize();
  const { data: detailData } = useQuery({
    queryKey: ["detail", id],
    queryFn: () => getDetailInspiration(id),
    refetchOnWindowFocus: false,
  });
  const navigate = useNavigate();
  const getDetailInspiration = async (
    idDetail: string | undefined
  ): Promise<AxiosResponse<Inspiration> | undefined> => {
    const res = await http.get(`/inspiration/${idDetail}`);
    return res;
  };
  const followAPI = async (idUser: string) => {
    const res = await http.post(`/user/follow/${idUser}`);
    return res;
  };
  const followMutation = useMutation({
    mutationKey: ["followUser"],
    mutationFn: followAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
  });
  const editorRef = useRef<LexicalEditor | null>(null);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  const commentAreaRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Set image height
    if (imgRef.current && imgRef.current.offsetHeight !== height) {
      setHeight(imgRef.current.offsetHeight);
    }
    // Auto scroll to lastest comment
    if (commentAreaRef.current) {
      commentAreaRef.current.scrollTop = commentAreaRef.current.scrollHeight;
    }
  }, [detailData, location.pathname]);
  const [activeEdit, setActiveEdit] = useState(false);
  const [activeDelete, setActiveDelete] = useState(false);
  const likePostMutation = useMutation({
    mutationKey: ["likePost"],
    mutationFn: () => {
      return http.put(`inspiration/${id}/likes`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
  });
  const saveMutation = useMutation({
    mutationKey: ["savePost"],
    mutationFn: (postId: string) => {
      return http.put(`user/save/${postId}`);
    },
    onSuccess: async () => {
      const user = await http.get(`user/info/${currentUser?._id}`);
      dispatch(setCurrentUser(user.data));
    },
  });
  const handleLikePost = () => {
    likePostMutation.mutate();
  };

  const isOwner = currentUser?._id === detailData?.data.postedBy._id;

  const booLike = detailData?.data.likes.some((like) => {
    return like._id == currentUser?._id;
  });
  const handleLexical = async () => {
    if (editorRef.current !== undefined) {
      if (editorRef.current !== null) {
        const latestEditorState = editorRef.current.getEditorState();
        editorRef.current.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        return await http.put(`inspiration/${id}/comment/add`, {
          comment: JSON.stringify(latestEditorState),
        });
      }
    }
  };
  const queryClient = useQueryClient();
  const addCommentMutation = useMutation({
    mutationKey: ["addComment"],
    mutationFn: handleLexical,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
    },
  });
  const deleteInspiMutation = useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: () => {
      return http.delete(`inspiration/${id}`);
    },
    onSuccess: () => {
      navigate("/artMuseum");
    },
  });
  const handleEmojiSelect = (emoji: any) => {
    if (editorRef.current) {
      editorRef.current.update(() => {
        const node = $createTextNode(emoji.native);
        $insertNodes([node]);
      });
    }
  };
  const [activeComment, setActiveComment] = useState<ActiveComment | null>(
    null
  );
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname, location.search]);

  return (
    <>
      <ToastContainer />
      {activeEdit && (
        <>
          <div className="fixed   top-1/2 left-1/2 w-[calc(100%_-_16px)] bg-white font-witch md:w-[60%] h-[90vh] rounded-xl -translate-x-1/2 -translate-y-1/2 z-[111]">
            <EditInspirationModal setActiveEdit={setActiveEdit} />
          </div>
          <BlackBackdrop
            className={"z-[110]"}
            onCloseBlackBackdrop={() => {
              setActiveEdit(false);
              document.body.style.overflow = "auto";
            }}
          />
        </>
      )}
      {activeDelete && (
        <>
          <BlackBackdrop
            className={""}
            onCloseBlackBackdrop={() => {
              setActiveDelete(false);
            }}
          />
          <div className=" confirm-wrapper text-center text-[#111] z-50 fixed top-1/2 left-1/2 bg-white font-witch w-[calc(100%-32px)] md:min-w-[500px] rounded-xl p-6 -translate-x-1/2 -translate-y-1/2">
            <div className="text-3xl font-bold">Are you sure?</div>
            <div className="my-8">
              Once you delete this Inspiration, you can't{" "}
              <span className="text-[#cc0000] font-semibold">undo</span> it.
            </div>
            <div className="control flex justify-center gap-2">
              <button
                onClick={() => {
                  setActiveDelete(false);
                }}
                className="secondary-btn px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteInspiMutation.mutate();
                }}
                className="primary-btn px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
      <div className="w-full second-track font-witch relative bg-black flex justify-center min-h-screen">
        <div className="detail-container mt-[80px]  md:w-[80%] py-8 px-2">
          <div
            style={{
              height: isMobile ? `auto` : `${height + 32}px`,
            }}
            className={`detail-wrapper flex md:flex-row flex-col w-full   bg-white  scrollbar-hide rounded-[32px] min-h-[600px]`}
          >
            <div
              ref={ref}
              className="left md:w-[50%] shrink-0 flex items-center"
            >
              <div className="p-4 w-full">
                <img
                  src={detailData?.data.artworkURL}
                  className="w-full rounded-[32px] "
                  ref={imgRef}
                  alt=""
                />
              </div>
            </div>
            <div className="right  md:w-1/2 flex flex-col relative pt-2">
              <div className="px-4 pt-6 flex-1 flex flex-col overflow-auto no-scrollbar">
                <div className="tool-top mb-2 flex justify-between items-center">
                  <div className="tool-left flex gap-1">
                    <Menu as="div" className={"relative z-20"}>
                      <Menu.Button
                        className={"p-3 rounded-full hover:bg-black/[0.06]"}
                      >
                        <BsThreeDots className="" size={20} />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          className={
                            "absolute left-0 min-w-[150px] mt-2 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2"
                          }
                        >
                          {isOwner && (
                            <Menu.Item as={Fragment}>
                              <button
                                onClick={() => {
                                  setActiveEdit(true);
                                  document.body.style.overflow = "hidden";
                                }}
                                className=" text-left py-2 px-2 rounded-md hover:text-white hover:bg-[#cc0000] w-full inline-block"
                              >
                                Edit
                              </button>
                            </Menu.Item>
                          )}

                          <Menu.Item as={Fragment}>
                            <div className="py-2 px-2 rounded-md hover:text-white hover:bg-[#cc0000] w-full inline-block">
                              Download Image
                            </div>
                          </Menu.Item>
                          <Menu.Item as={Fragment}>
                            <div className="py-2 px-2 rounded-md hover:text-white hover:bg-[#cc0000] w-full inline-block">
                              Report
                            </div>
                          </Menu.Item>
                          {isOwner && (
                            <Menu.Item as={Fragment}>
                              <button
                                onClick={() => {
                                  setActiveDelete(true);
                                }}
                                className=" text-left py-2 px-2 rounded-md hover:text-white hover:bg-[#cc0000] w-full inline-block"
                              >
                                Delete
                              </button>
                            </Menu.Item>
                          )}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <button className="p-3 rounded-full hover:bg-black/[0.06]">
                      <FiShare className="" size={20} />
                    </button>
                    <button className="p-3 rounded-full hover:bg-black/[0.06]">
                      <BsLink45Deg className="" size={20} />
                    </button>
                  </div>
                  <div className="tool right">
                    {currentUser?.save.some((item) => item === id) ? (
                      <button
                        onClick={() => {
                          if (id) saveMutation.mutate(id);
                        }}
                        className={
                          "px-4 py-3 bg-[#111111] hover:bg-[#111111] text-white text-lg rounded-full"
                        }
                      >
                        Saved
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (id) {
                            saveMutation.mutateAsync(id).then(() => {
                              toast(
                                <>
                                  <div className="flex font-witch justify-center items-center">
                                    <img
                                      className="w-[40px] h-[40px] mr-2 rounded-md object-cover block"
                                      src={detailData?.data.artworkURL}
                                      alt=""
                                    />

                                    <div className="flex-1">
                                      Saved to gallery!{" "}
                                    </div>
                                  </div>
                                </>,
                                {
                                  position: "bottom-center",
                                  autoClose: 3000,
                                  theme: "light",
                                  hideProgressBar: true,
                                }
                              );
                            });
                          }
                        }}
                        className={"px-4 py-3 text-lg primary-btn min-w-[80px]"}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
                <div className=" mb-8">
                  <div className="main-title text-3xl font-semibold tracking-wider mb-2 ">
                    <LexicalComposer
                      initialConfig={{
                        editorState: detailData?.data.title,
                        editable: false,
                        namespace: "title",
                        onError: (err) => {
                          throw err;
                        },
                      }}
                    >
                      <PlainTextPlugin
                        contentEditable={
                          <ContentEditable className="title-container outline-none overflow-y-auto scrollbar-hide relative min-h-[40px]" />
                        }
                        placeholder={<></>}
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <SetInitialTextPlugin
                        state={JSON.stringify(detailData?.data.title)}
                        dependencie={detailData?.data.title}
                      />
                    </LexicalComposer>
                  </div>
                  <div className="sub-tilte text-lg">
                    <LexicalComposer
                      initialConfig={{
                        editorState: detailData?.data.description,
                        editable: false,
                        namespace: "sub-title",
                        onError: (err) => {
                          throw err;
                        },
                      }}
                    >
                      <PlainTextPlugin
                        contentEditable={
                          <ContentEditable className="descr-container outline-none max-h-[125px] overflow-y-auto relative min-h-[20px] flex-grow" />
                        }
                        placeholder={<></>}
                        ErrorBoundary={LexicalErrorBoundary}
                      />
                      <SetInitialTextPlugin
                        state={JSON.stringify(detailData?.data.description)}
                        dependencie={detailData?.data.description}
                      />
                      <ClearEditorPlugin />
                      <SingleLinePlugin />
                    </LexicalComposer>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <div className="author flex">
                    <Link
                      to={`/artMuseum/profile/${detailData?.data.postedBy._id}`}
                    >
                      <div className="avatar">
                        <img
                          src={detailData?.data.postedBy.photo}
                          className="w-[48px] h-[48px] rounded-full"
                          alt=""
                        />
                      </div>
                    </Link>
                    <div className="info flex flex-col justify-center gap-1 ml-2">
                      <Link
                        to={`/artMuseum/profile/${detailData?.data.postedBy._id}`}
                      >
                        <p className="leading-none text-lg hover:underline underline-offset-4">
                          {detailData?.data.postedBy.firstName}
                        </p>
                      </Link>

                      <p className="leading-none">{`${detailData?.data.postedBy.followers.length} followers`}</p>
                    </div>
                  </div>
                  {!isOwner &&
                    (currentUser &&
                    detailData?.data.postedBy.followers.some((item) => {
                      console.log(item);
                      return item._id === currentUser._id;
                    }) ? (
                      <button
                        onClick={() => {
                          followMutation.mutate(detailData?.data.postedBy._id);
                        }}
                        className={"px-4 py-3 secondary-btn text-lg"}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (detailData) {
                            followMutation
                              .mutateAsync(detailData.data.postedBy._id)
                              .then(() => {
                                toast(
                                  <>
                                    <div className="flex font-witch justify-center items-center">
                                      <img
                                        className="w-[40px] h-[40px] mr-2 rounded-md object-cover block"
                                        src={detailData?.data.postedBy.photo}
                                        alt=""
                                      />

                                      <div className="flex-1">Following! </div>
                                    </div>
                                  </>,
                                  {
                                    position: "bottom-center",
                                    autoClose: 3000,
                                    theme: "light",
                                    hideProgressBar:true
                                  }
                                );
                              });
                          }
                        }}
                        className={"px-4 py-3 text-lg primary-btn"}
                      >
                        Follow
                      </button>
                    ))}
                </div>

                <div className="comments pb-4  flex-1 flex flex-col ">
                  <div className="flex justify-between items-center mb-1">
                    <h1 className="title text-3xl">Comments</h1>
                    <div className="mr-2">
                      <HiHeart
                        onClick={() => {
                          handleLikePost();
                        }}
                        size={30}
                        className={
                          "inline-block " +
                          `${booLike ? "text-primary" : "text-grey-300"}`
                        }
                      />
                      <span className="ml-1 inline-block translate-y-[2px]">
                        {detailData?.data.likes.length}
                      </span>
                    </div>
                  </div>
                  <div
                    ref={commentAreaRef}
                    className="comment-area flex-1 max-h-[calc(100%_-_40px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#585858] scrollbar-track-[#ebebeb] scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                  >
                    {detailData?.data.comments.length
                      ? detailData?.data?.comments.map((item, index) => (
                          <CommentPost
                            key={index}
                            commentData={item}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                            editable={detailData?.data.commentPermission}
                            showEmojiPicker={showEmojiPicker}
                            setShowEmojiPicker={setShowEmojiPicker}
                          />
                        ))
                      : detailData?.data.commentPermission && (
                          <div className="py-4 text-lg">
                            No comments yet. Add one to start the conversation.
                          </div>
                        )}
                    {!detailData?.data.commentPermission && (
                      <div className="text-xl text-center p-2 text-[#757575]">
                        ~Comments are not enabled~
                      </div>
                    )}
                    <div ref={lastCommentRef}></div>
                  </div>
                </div>
              </div>
              <div className="input-comment border-t-[1px] border-black/20 p-4 sticky top-0">
                <div>
                  <div className="flex gap-1 items-center">
                    <div className="avatar-user">
                      <img
                        src={currentUser?.photo}
                        className="w-[48px] h-[48px] rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 relative">
                      <div className="rounded-[36px] bg-[#f2f0f5] overflow-hidden">
                        <div className="flex  items-center relative">
                          <MyLexicalEditor
                            editable={!!detailData?.data.commentPermission}
                            ref={editorRef}
                            editState=""
                            type="comment"
                          ></MyLexicalEditor>
                          <span
                            id="comment-emoji"
                            className="px-2 "
                            onClick={() => {
                              setShowEmojiPicker((prev) => {
                                if (prev.type === "main") {
                                  return {
                                    active: false,
                                    type: "",
                                  };
                                } else {
                                  return {
                                    active: true,
                                    type: "main",
                                  };
                                }
                              });
                            }}
                          >
                            <AiOutlineSmile
                              className="cursor-pointer text-[#cc0000]/70"
                              size={25}
                            />
                          </span>
                        </div>
                      </div>
                      {showEmojiPicker.active &&
                        showEmojiPicker.type === "main" && (
                          <div className="absolute bottom-[60px] -right-[60px] md:-top-[620%]">
                            <Picker
                              onEmojiSelect={handleEmojiSelect}
                              data={data}
                            />
                          </div>
                        )}
                    </div>
                    <button
                      disabled={!detailData?.data.commentPermission}
                      onClick={() => {
                        if (editorRef.current) {
                          editorRef.current.getEditorState().read(() => {
                            const root = $getRoot();
                            if (root.__cachedText) {
                              const isEmpty = root.__cachedText.trim() === "";
                              if (!isEmpty) {
                                addCommentMutation.mutate();
                              }
                            }
                          });
                        }
                      }}
                      className={`cursor-pointer rounded-full p-2 ${
                        detailData?.data.commentPermission
                          ? "text-[#cc0000]/70 hover:bg-[#d7d6d6] active:bg-[#d9d9d9]"
                          : "text-[#d4d4d4]"
                      }    `}
                    >
                      <AiOutlineSend size={25} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="related-features bg-black ">
        <h1 className=" text-6xl text-center text-white font-witch pt-10 pb-4">
          Related Features
        </h1>
      </div>
    </>
  );
}
export default DetailArt;
