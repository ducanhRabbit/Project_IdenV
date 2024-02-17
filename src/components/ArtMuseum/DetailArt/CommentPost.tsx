import React, { Fragment, useRef } from "react";
import { CgCornerDownRight } from "react-icons/cg";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import EditMenu from "./EditMenu";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import moment from "moment";
import "moment-timezone";
import Picker from "@emoji-mart/react";
// import "./EmojiPicker.css";
import Reply from "./Reply";
import { AiOutlineSmile } from "react-icons/ai";
import data from "@emoji-mart/data";
import { $createTextNode, $insertNodes, LexicalEditor } from "lexical";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import http from "../../../axios/axios";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import SetInitialTextPlugin from "../../LexicalEditor/Plugins/SetInitialTextPlugin";
import useModal from "../../../hook/useModal";
import MyLexicalEditor from "../../LexicalEditor/MyLexicalEditor";
import { Menu, Transition } from "@headlessui/react";
import { ActiveComment, ActiveEmoji, Comment } from "../../../shared/types";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { setCurrentInspiration } from "../../../redux/reducers/inspirationReducer";

interface CommentPostProps {
  commentData: Comment;
  activeComment: ActiveComment|null;
  setActiveComment: React.Dispatch<React.SetStateAction<ActiveComment|null>>;
  editable: boolean;
  showEmojiPicker: ActiveEmoji;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<ActiveEmoji>>;
}

function CommentPost({
  commentData,
  activeComment,
  setActiveComment,
  editable,
  showEmojiPicker,
  setShowEmojiPicker,
}: CommentPostProps) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { showModal, toogleModal } = useModal();
  const { currentUser } = useAppSelector((state) => state.user);
  const isReplying =
    activeComment &&
    activeComment.id === commentData._id &&
    activeComment.type === "reply";
  const isEditting =
    activeComment &&
    activeComment.id === commentData._id &&
    activeComment.type === "edit";
  const initContent = commentData.comment;
  const isOwner = currentUser?._id === commentData.postedBy._id;
  const replyRef = useRef<LexicalEditor | null>(null);
  const editRef = useRef<LexicalEditor | null>(null);
  const submitReply = async () => {
    if (replyRef.current !== undefined && replyRef.current !== null) {
      const latestEditorState = replyRef.current.getEditorState();
      const res = await http.put(`inspiration/${id}/reply/${commentData._id}`, {
        comment: JSON.stringify(latestEditorState),
      });
      return res;
    }
  };
  const handleEmojiSelect = (e: any) => {
    if (replyRef.current) {
      replyRef.current.update(() => {
        const node = $createTextNode(e.native);
        $insertNodes([node]);
      });
    }
  };
  const submitEdit = async () => {
    if (editRef.current !== undefined && editRef.current !== null) {
      const latestEditorState = editRef.current.getEditorState();
      const res = await http.post(
        `inspiration/${id}/comment/edit/${commentData._id}`,
        {
          comment: JSON.stringify(latestEditorState),
        }
      );
      return res;
    }
  };
  const editHandler = () => {
    setActiveComment({
      type: "edit",
      id: commentData._id,
    });
  };
  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationKey: ["submitEdit"],
    mutationFn: submitEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail",id] });
      setActiveComment(null);
    },
  });
  const addReplyMutation = useMutation({
    mutationKey: ["addReply"],
    mutationFn: submitReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail",id] });
      setActiveComment(null);
    },
  });
  return (
    <div className="comment-post ">
      <div className="flex gap-1 mb-4 mr-2">
        <div className="w-[41px] mr-2 shrink-0">
          <img
            src={commentData.postedBy.photo}
            className="w-[41px] h-[41px] rounded-full"
            alt=""
          />
        </div>
        <div className="flex-1">
          {!isEditting && (
            <div className="">
              <div className="min-h-[45px] bg-[#f2f0f5] rounded-lg p-2">
                <Link to={`/artMuseum/profile/${commentData.postedBy._id}/created`} className="font-semibold tracking-wider hover:underline">
                  {commentData.postedBy.userName}
                </Link>
                <div className="">
                  <LexicalComposer
                    initialConfig={{
                      editorState: initContent,
                      editable: false,
                      onError: (err) => {
                        throw err;
                      },
                      namespace: "display",
                    }}
                  >
                    <PlainTextPlugin
                      contentEditable={
                        <ContentEditable className="comment-container outline-none  relative min-h-[20px] flex-grow" />
                      }
                      placeholder={<></>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <SetInitialTextPlugin
                      state={JSON.stringify(commentData.comment)}
                      dependencie={commentData}
                    />
                    <ClearEditorPlugin />
                  </LexicalComposer>
                </div>
              </div>
              <div className="react flex justify-start items-end text-[#65676b] font-semibold">
                <div className="time mr-[10px]">
                  {moment
                    .tz(commentData.createAt, "Asia/Ho_Chi_Minh")
                    .fromNow()}
                </div>
                <div
                  className="reply mx-[10px] cursor-pointer"
                  onClick={() => {
                    if (editable) {
                      setActiveComment({
                        type: "reply",
                        id: commentData._id,
                      });
                      dispatch(setCurrentInspiration(commentData.postedBy));
                    }
                  }}
                >
                  Reply
                </div>
                {isOwner && editable && (
                  <Menu as="div" className="leading-none relative">
                    <Menu.Button>
                      <HiOutlineDotsHorizontal />
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
                          "absolute mt-2 right-0 rounded-xl p-1 min-w-[100px] z-50 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none "
                        }
                      >
                        <EditMenu
                          data={commentData._id}
                          type={"comment"}
                          editHandler={editHandler}
                        />
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          )}
          {isEditting && (
            <div className="pr-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="rounded-[36px] bg-[#f2f0f5] overflow-hidden">
                    <div className="flex  items-center relative overflow-y-auto ">
                      <MyLexicalEditor
                        ref={editRef}
                        editState={commentData?.comment}
                        type={"edit"}
                        editable={true}
                      ></MyLexicalEditor>
                      <span
                        className="px-2 "
                        onClick={() => {
                          setShowEmojiPicker((prev) => {
                            if (prev.active && prev.type === 'edit') {
                              return {
                                active: false,
                                type: "",
                              };
                            } else {
                              return {
                                active: true,
                                type: "edit",
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
                    showEmojiPicker.type === "edit" && (
                      <div className="absolute -right-2 md:right-4 z-50">
                        <Picker
                          onEmojiSelect={(emoji: any) => {
                            if (editRef.current) {
                              editRef.current.update(() => {
                                const node = $createTextNode(emoji.native);
                                $insertNodes([node]);
                              });
                            }
                          }}
                          data={data}
                          perLine={8}
                        />
                      </div>
                    )}
                </div>
              </div>
              <div className="edit-controller flex justify-end gap-2 mt-2">
                <button
                  className={"py-2 px-3 secondary-btn"}
                  onClick={() => {
                    setActiveComment(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={"py-2 px-3 primary-btn"}
                  onClick={() => {
                    editMutation.mutate();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {commentData.replies.length > 5 && (
            <div
              onClick={() => {
                toogleModal();
              }}
            >
              <span className="text-sm cursor-pointer hover:underline text-[#65676b] font-bold">
                <CgCornerDownRight size={16} className="inline-block " />
                {commentData.replies.length} replies
              </span>
            </div>
          )}
          {((commentData.replies.length <= 5 &&
            commentData.replies.length > 0) ||
            showModal) && (
            <div className="sub-comment mt-2">
              {commentData.replies.map((item, index) => (
                <Reply
                key={index}
                  target={commentData._id}
                  replyData={item}
                  activeComment={activeComment}
                  setActiveComment={setActiveComment}
                  editable={editable}
                  showEmojiPicker={showEmojiPicker}
                  setShowEmojiPicker={setShowEmojiPicker}
                  index={index}
                />
              ))}
              {/* {addReplyMutation.isLoading && <div className="h-[86px] w-full bg-red-500"></div>} */}
            </div>
          )}

          {isReplying && (
            <div className="mt-3 pr-2">
              <div className="flex gap-2">
                <div className="avatar-user">
                  <img
                    src={currentUser?.photo}
                    className="w-[48px] h-[48px] rounded-full"
                    alt=""
                  />
                </div>
                <div className="relative flex-1">
                  <div className="rounded-[36px] bg-[#f2f0f5] overflow-hidden">
                    <div className="flex  items-center relative overflow-y-auto">
                      <MyLexicalEditor
                        initialText={commentData?.postedBy.firstName}
                        ref={replyRef}
                        type={"reply"}
                        editable={true}
                        editState=""
                      ></MyLexicalEditor>
                      <span
                        className="px-2 "
                        onClick={() => {
                          setShowEmojiPicker((prev) => {
                            if (prev.active && prev.type === "reply") {
                              return {
                                active: false,
                                type: "",
                              };
                            } else {
                              return {
                                active: true,
                                type: "reply",
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
                    showEmojiPicker.type === "reply" && (
                      <div className="absolute -right-2 md:right-4 z-50">
                        <Picker perLine={8} onEmojiSelect={handleEmojiSelect} data={data} />
                      </div>
                    )}
                </div>
              </div>
              <div className="edit-controller flex justify-end gap-2 mt-2">
                <button
                  className={"py-2 px-3 secondary-btn"}
                  onClick={() => {
                    setActiveComment(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={"py-2 px-3 primary-btn"}
                  onClick={() => {
                    addReplyMutation.mutate();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default CommentPost;
