import React, { useRef, useState } from "react";
import { OverflowNode } from "@lexical/overflow";
import {
  $createTextNode,
  $getRoot,
  $insertNodes,
  LexicalEditor,
} from "lexical";
import { AiFillSmile } from "react-icons/ai";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Switch } from "@headlessui/react";
import http from "../../../axios/axios";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import MaxLengthPlugin from "../../LexicalEditor/Plugins/MaxLengthPlugin";
import GetRefPlugin from "../../LexicalEditor/Plugins/GetRefPlugin";
import { AxiosResponse } from "axios";
import { Inspiration } from "../../../shared/types";

interface EditInspirationModalProps {
  setActiveEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditInspirationModal({ setActiveEdit }: EditInspirationModalProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const InspirationQuery = queryClient.getQueryData<
    AxiosResponse<Inspiration, any> | undefined
  >(["detail", id]);

  const theme = {
    paragraph: "title-input",
    placeholder: "title-placeholder",
  };
  const [commentPermission, setEnabled] = useState<boolean | undefined>(
    InspirationQuery?.data.commentPermission
  );

  const titleConfig = {
    namespace: "MyEditor",
    editorState: InspirationQuery?.data.title,
    theme,
    nodes: [OverflowNode],
    onError: (err: Error) => {
      console.log(err);
    },
  };

  const handleSubmitEdition = async (): Promise<
    AxiosResponse<any> | undefined
  > => {
    if (titleRef.current && descriptionRef.current) {
      const data = {
        plainTitle: titleRef.current
          .getEditorState()
          .read(() => $getRoot().getTextContent()),
        title: JSON.stringify(titleRef.current.getEditorState()),
        description: JSON.stringify(descriptionRef.current.getEditorState()),
        commentPermission: commentPermission,
      };
      return await http.post(`inspiration/edit/${id}`, data);
    }
  };
  const theme1 = {
    paragraph: "descr-input",
    placeholder: "descr-placeholder",
  };

  const descrConfig = {
    namespace: "MyEditor1",
    editorState: InspirationQuery?.data.description,
    editable: true,
    theme: theme1,
    nodes: [OverflowNode],
    onError: (err: Error) => {
      console.log(err);
    },
  };

  const editMutation = useMutation({
    mutationKey: ["editInspiration", id],
    mutationFn: handleSubmitEdition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detail", id] });
      setActiveEdit(false);
    },
  });
  const titleRef = useRef<LexicalEditor | null>(null);
  const descriptionRef = useRef<LexicalEditor | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (e: any) => {
    if (descriptionRef.current) {
      descriptionRef.current.update(() => {
        const node = $createTextNode(e.native);
        $insertNodes([node]);
      });
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="md:text-4xl text-3xl text-center p-6 shrink-0 shadow-[0px_2px_8px__rgba(0,0,0,0.12)]">
        Edit this inspiration
      </div>
      <div className="h-full realative flex-1 overflow-y-auto no-scrollbar min-h-0 pt-4 px-4 pb-24 md:pb-0">
        <div className="flex flex-col-reverse md:flex-row gap-2 ">
          <div className="flex-auto relative px-5 mt-3 ">
            <div className="title-and-description  ">
              <div className="title relative">
                <div className="text-xl">Title</div>
                <LexicalComposer initialConfig={titleConfig}>
                  <PlainTextPlugin
                    contentEditable={
                      <ContentEditable className=" relative outline-none after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:bg-black after:w-full" />
                    }
                    placeholder={
                      <div className="absolute text-3xl top-1/2 pl-1">
                        Add your title
                      </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  ></PlainTextPlugin>
                  <GetRefPlugin ref={titleRef}></GetRefPlugin>
                  <CharacterLimitPlugin maxLength={40} charset="UTF-16" />
                  <MaxLengthPlugin maxLength={40} />
                  <ClearEditorPlugin />
                </LexicalComposer>
              </div>
            </div>
            <div className="description my-8">
              <div className="flex items-center">
                <div className="description-input flex-1 relative">
                  <div>Description</div>
                  <LexicalComposer initialConfig={descrConfig}>
                    <PlainTextPlugin
                      contentEditable={
                        <ContentEditable className="relative outline-none after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:bg-black after:w-full" />
                      }
                      placeholder={
                        <div className="absolute top-[50%]">Tell a story</div>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    ></PlainTextPlugin>
                    <GetRefPlugin ref={descriptionRef}></GetRefPlugin>
                    <CharacterLimitPlugin maxLength={200} charset="UTF-16" />
                    <MaxLengthPlugin maxLength={200} />
                    <ClearEditorPlugin />
                  </LexicalComposer>
                </div>
                <div className="relative">
                  <div
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="emotion relative p-2 cursor-pointer"
                  >
                    <AiFillSmile size={30} />
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute -right-[50px] md:-top-[150px] md:right-12">
                      <Picker
                        onEmojiSelect={handleEmojiSelect}
                        data={data}
                        previewPosition={"none"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="option">
              <Switch.Group>
                <div className="flex items-center gap-4">
                  <Switch.Label className={"cursor-pointer"}>
                    Comment Permission
                  </Switch.Label>
                  <Switch
                    className={`${
                      commentPermission ? "bg-teal-900" : "bg-[#d1d1d1]"
                    }
                relative inline-flex h-[19px] w-[38px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                    checked={commentPermission}
                    onChange={setEnabled}
                    name="terms"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        commentPermission
                          ? "translate-x-[19px]"
                          : "translate-x-0"
                      }
            pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
          </div>
          <div className="md:w-[40%] w-full min-w-[200px] shrink-0">
            <LazyLoadImage
              effect="blur"
              className="object-cover rounded-xl"
              src={InspirationQuery?.data.artworkURL}
            />
          </div>
        </div>
      </div>
      <div className="control flex justify-end gap-2 p-4 shrink-0">
        <button
          onClick={() => {
            setActiveEdit(false);
            document.body.style.overflow = "auto";
          }}
          className="secondary-btn py-2 px-4 text-lg"
        >
          Cancel
        </button>
        <button
          className="primary-btn py-2 px-4 text-lg min-w-[80px]"
          onClick={() => {
            editMutation.mutate();
            document.body.style.overflow = "auto";
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditInspirationModal;
