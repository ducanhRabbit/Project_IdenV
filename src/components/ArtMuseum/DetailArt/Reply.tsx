import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import React, { Fragment, useRef } from "react";
import EditMenu from "./EditMenu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Picker from "@emoji-mart/react";
// import "./EmojiPicker.css";
import {
  $createTextNode,
  $insertNodes,
  LexicalEditor,
} from "lexical";
import { AiOutlineSmile } from "react-icons/ai";
import data from "@emoji-mart/data";
import moment from "moment";
import http from "../../../axios/axios";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { ActiveComment, ActiveEmoji, Comment } from "../../../shared/types";
import SetInitialTextPlugin from "../../LexicalEditor/Plugins/SetInitialTextPlugin";
import { TagNameNode } from "../../LexicalEditor/Nodes/TagNameNode";
import MyLexicalEditor from "../../LexicalEditor/MyLexicalEditor"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { setCurrentInspiration } from "../../../redux/reducers/inspirationReducer";

interface ReplyProps{
  replyData:Comment,
  activeComment:ActiveComment|null,
  setActiveComment: React.Dispatch<React.SetStateAction<ActiveComment | null>>,
  target:string,
  editable:boolean,
  showEmojiPicker:ActiveEmoji,
  setShowEmojiPicker:React.Dispatch<React.SetStateAction<ActiveEmoji>>,
  index:number,
}

function Reply({
  replyData,
  activeComment,
  setActiveComment,
  target,
  editable,
  showEmojiPicker,
  setShowEmojiPicker,
  index
}:ReplyProps) {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.user);
  const isOwner = currentUser?._id === replyData.postedBy?._id;
  const editHandler = () => {
    setActiveComment({
      type: "edit",
      id: replyData._id,
    });
  };
  const theme = {
    hashtag: "editor-hashtag",
    tagName: "editor-tagName",
  };

  const initialConfig = {
    namespace: "Comment-read-only",
    editorState: replyData.comment,
    editable: false,
    theme,
    onError(error:Error) {
      console.log(error);
    },
    nodes: [TagNameNode],
  };

  const isEditting =
    activeComment &&
    activeComment.id === replyData._id &&
    activeComment.type === "edit";

  const editRef1 = useRef<LexicalEditor|null>(null);
  const handleEmojiSelect = (e:any) => {
    if(editRef1.current){
      editRef1.current.update(() => {
        const node = $createTextNode(e.native);
        $insertNodes([node]);
      });
    }
  };

  const queryClient = useQueryClient();
  const submitEdit = async() => {
    if (editRef1.current !== undefined && editRef1.current !== null) {
      const latestEditorState = editRef1.current.getEditorState();
      console.log(JSON.stringify(latestEditorState))
      const res = http.post(
        `inspiration/${id}/comment/edit/${target}/${replyData._id}`,
        {
          reply: JSON.stringify(latestEditorState),
        }
      )
      return res;
    }
  };

  const editMutation = useMutation({
    mutationKey: ["editReply"],
    mutationFn: submitEdit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail"] });
      setActiveComment(null);
    },
  });
  return (
    <div className="replies flex gap-1 mb-4 mr-2">
      <div className="w-[41px] mr-2 shrink-0">
        <img
          src={replyData.postedBy?.photo}
          className="w-[41px] h-[41px] rounded-full"
          alt=""
        />
      </div>
      <div className="flex-1">
        {isEditting && (
          <div className="pr-2">
            <div className="flex gap-2">
              {/* <InputComment
                type={"edit"}
                editorRef={editRef1}
                editState={replyData?.comment}
              /> */}
              <div className="relative flex-1">
                <div className="rounded-[36px] bg-[#f2f0f5] overflow-hidden">
                  <div className="flex  items-center relative overflow-y-auto">
                    <MyLexicalEditor
                      ref={editRef1}
                      editState={replyData?.comment}
                      type={"edit"}
                      editable={true}
                    ></MyLexicalEditor>
                    <span
                      className="px-2 "
                      onClick={() => {
                    
                        setShowEmojiPicker((prev)=>{
                          if(prev.index === index){
                            return {
                              active:false,
                              type:"reply",
                              index:-1
                            }
                          }else{
                            return {
                              active:true,
                              type:"reply",
                              index:index
                            }
                          }
                        })
                      }}
                    >
                      <AiOutlineSmile
                        className="cursor-pointer text-[#cc0000]/70"
                        size={25}
                      />
                    </span>
                  </div>
                </div>
                {showEmojiPicker.index === index && showEmojiPicker.active && (
                  <div className="absolute right-4 z-50">
                    <Picker onEmojiSelect={handleEmojiSelect} data={data} />
                  </div>
                )}
              </div>
            </div>
            <div className="edit-controller flex justify-end gap-2 mt-2">
              <button
                className={"py-2 px-3 primary-btn"}
                onClick={() => {
                  setActiveComment(null);
                }}
              >
                Cancel
              </button>
              <button
                className={"py-2 px-3 secondary-btn"}
                onClick={() => {
                  editMutation.mutate();
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
        {!isEditting && (
          <div>
            <div className="min-h-[45px] bg-[#f2f0f5] rounded-lg p-2">
              <div className="font-semibold tracking-wider">
                {replyData.postedBy?.firstName}
              </div>
              <div className="">
                <LexicalComposer initialConfig={initialConfig}>
                  <PlainTextPlugin
                    contentEditable={
                      <ContentEditable className="comment-container outline-none  relative min-h-[20px] flex-grow" />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <SetInitialTextPlugin
                    state={JSON.stringify(replyData.comment)}
                    dependencie={replyData}
                  />
                </LexicalComposer>
              </div>
            </div>
            <div className="react flex justify-start items-ends text-[#65676b] font-semibold text-sm mt-[2px]">
              <div className="time mr-[10px]">
                {moment.tz(replyData.createAt, "Asia/Ho_Chi_Minh").fromNow()}
              </div>
              <div
                className="reply mx-[10px] cursor-pointer"
                onClick={() => {
                  if (editable) {
                    if (!activeComment || activeComment.id !== target) {
                      setActiveComment({
                        type: "reply",
                        id: target,
                      });
                    }
                    dispatch(setCurrentInspiration(replyData.postedBy));
                  }
                }}
              >
                Reply
              </div>
              {isOwner && editable && (
                <Menu as="div" className="leading-none relative">
                <Menu.Button><HiOutlineDotsHorizontal/></Menu.Button>
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
                      data={target}
                      reply={replyData}
                      type={"reply"}
                      editHandler={editHandler}
                    />
                  </Menu.Items>
                </Transition>
              </Menu>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reply;
