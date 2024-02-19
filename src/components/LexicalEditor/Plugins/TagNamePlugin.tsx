import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {TypeEditor} from "../../../shared/types"
import {
  $createTextNode,
  $getRoot,
  $getSelection,
} from "lexical";
import { useEffect } from "react";
import { $createTagNameNode } from "../Nodes/TagNameNode";
import { useAppSelector } from "../../../redux/hook";
interface TagNamePluginProps{
  type: TypeEditor
}
function TagNamePlugin({ type }:TagNamePluginProps) {
  const [editor] = useLexicalComposerContext();
  
  if (type === "reply") {
    const { currentInspiration } = useAppSelector((state) => state.inspiration);
    useEffect(() => {
      if(currentInspiration){
        editor.update(() => {
          const root = $getRoot();
          const paragraph = root.getFirstChild();
          const tagChar = '@' + currentInspiration.userName
          if(paragraph){
            const isParaEmpty = paragraph.isEmpty();
            const tagNameNode = $createTagNameNode(tagChar);
            const spaceNode = $createTextNode(" ");
            if (!isParaEmpty) {
              paragraph.clear();
            }
            paragraph.append(tagNameNode, spaceNode);
            root.append(paragraph);
            // Move text cursor to the end
            root.selectEnd()
          }
        });
      }
    }, [currentInspiration]);
  }

  return null;
}

export default TagNamePlugin;
