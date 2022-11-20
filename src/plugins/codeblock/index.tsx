import "./index.scss";
import { CommandFn } from "../../core/command";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { isObject } from "src/utils/is";
import { isMatchedAttributeNode, isWrappedNode } from "../../core/ops/is";
import { setUnWrapNodes, setWrapNodes } from "../../core/ops/set";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const CODE_BLOCK_KEY = "code-block";
export const CODE_BLOCK_ITEM_KEY = "code-block-item";

declare module "slate" {
  interface BlockElement {
    [CODE_BLOCK_KEY]?: boolean;
    [CODE_BLOCK_ITEM_KEY]?: boolean;
  }
}

export const CodeBlockPlugin = (editor: Editor, isRender: boolean): Plugin => {
  const codeBlockCommand: CommandFn = editor => {
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
    setWrapNodes(editor, { [CODE_BLOCK_KEY]: true }, { [CODE_BLOCK_ITEM_KEY]: true });
  };

  return {
    key: CODE_BLOCK_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: codeBlockCommand,
    match: props => !!props.element[CODE_BLOCK_KEY],
    renderLine: context => {
      const path = ReactEditor.findPath(editor, context.element);
      console.log("object :>> ", 2);
      return <div style={{ background: "red" }}>{context.children}</div>;
    },
  };
};
