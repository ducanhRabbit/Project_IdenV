import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { forwardRef } from "react";
import GetRefPlugin from "./Plugins/GetRefPlugin";
import "../../css/Lexical/LexicalTheme.css"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { TagNameNode } from "./Nodes/TagNameNode";
import ControlEditablePlugin from "./Plugins/ControlEditablePlugin";
import SetInitialTextPlugin from "./Plugins/SetInitialTextPlugin";
import TagNamePlugin from "./Plugins/TagNamePlugin";
import { TypeEditor } from "../../shared/types";


interface MyLexicalEditorProps {
  initialText?: string;
  type: TypeEditor;
  editState: string;
  editable: boolean;
}

function MyLexicalEditor(props: MyLexicalEditorProps, ref: any) {
  const { type, editState, editable = true } = props;
  const theme = {
    hashtag: "editor-hashtag",
    paragraph: "comment-input",
    placeholder: "editor-placeholder",
    tagName: "editor-tagName",
  };
  const initialConfig = {
    namespace: "MyEditor",
    editable: editable,
    theme,
    onError(error:Error) {
      console.log(error);
    },
    nodes: [TagNameNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <ContentEditable className="comment-container outline-none relative min-h-[20px] flex-grow " />
        }
        placeholder={
          <div className="comment-placeholder absolute top-1/2 -translate-y-1/2 left-3 select-none text-[#201918]/50">
            Enter some text...
          </div>
        }
      ></PlainTextPlugin>
      <GetRefPlugin ref={ref}></GetRefPlugin>
      <ControlEditablePlugin editable={editable} />
      <TagNamePlugin type={type}></TagNamePlugin>
      <SetInitialTextPlugin state={editState} dependencie={null}></SetInitialTextPlugin>
      <ClearEditorPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

const forwardedMyLexicalInput = forwardRef(MyLexicalEditor);

export default forwardedMyLexicalInput;
