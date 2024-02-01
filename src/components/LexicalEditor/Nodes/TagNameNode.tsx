import { EditorConfig, SerializedTextNode, TextNode } from "lexical";

export class TagNameNode extends TextNode {
  static getType():string {
    return "tagName";
  }

  static clone(node:TagNameNode):TagNameNode {
    return new TagNameNode(node.__text, node.__key);
  }

  createDOM(config:EditorConfig):HTMLElement {
    const element = document.createElement("span");
    element.classList.add(config.theme.tagName);
    element.innerText = this.__text;
    return element;
  }

  exportJSON() {
    // return super.exportJSON()
    return { ...super.exportJSON(), type:"tagName",version:1 };
  }
  static importJSON(serializedNode:SerializedTextNode) {
    // We don't create a root, and instead use the existing root.
    const node = $createTagNameNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    return node;
  }
}

export function $createTagNameNode(text:string):TagNameNode {
  return new TagNameNode(text);
}
