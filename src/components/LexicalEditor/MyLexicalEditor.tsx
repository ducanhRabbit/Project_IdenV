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


interface MyLexicalEditorProps {
  initialText?: string;
  type: string;
  editState: string;
  editable: boolean;
}

function MyLexicalEditor(props: MyLexicalEditorProps, ref: any) {
  const { initialText, type, editState, editable = true } = props;
  const theme = {
    hashtag: "editor-hashtag",
    paragraph: "comment-input",
    placeholder: "editor-placeholder",
    tagName: "editor-tagName",
  };
  console.log(editable);
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
          <ContentEditable className="comment-container outline-none relative min-h-[20px] flex-grow" />
        }
        placeholder={
          <div className="comment-placeholder absolute top-1/2 -translate-y-1/2 left-3 select-none text-[#201918]/50">
            Enter some text...
          </div>
        }
      ></PlainTextPlugin>
      <GetRefPlugin ref={ref}></GetRefPlugin>
      {/* <ControlEditablePlugin editable={editable} />
      <UpdateInitialText type={type} initText={initialText}></UpdateInitialText>
      <EditPlugin type={"edit"} state={editState}></EditPlugin> */}
      <ClearEditorPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

const forwardedMyLexicalInput = forwardRef(MyLexicalEditor);

export default forwardedMyLexicalInput;
