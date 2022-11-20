import "./index.scss";
import { CommandFn } from "../../core/command";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { isObject } from "src/utils/is";
import {
  isBlock,
  isMatchedAttributeNode,
  isText,
  isTextBlock,
  isWrappedNode,
} from "../../core/ops/is";
import { setUnWrapNodes, setWrapNodes } from "../../core/ops/set";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { codeTokenize, DEFAULT_LANGUAGE } from "./utils";

export const CODE_BLOCK_KEY = "code-block";
export const CODE_BLOCK_TYPE = "code-block-type";
export const CODE_BLOCK_ITEM_KEY = "code-block-item";

declare module "slate" {
  interface BlockElement {
    [CODE_BLOCK_KEY]?: { language: string };
    [CODE_BLOCK_ITEM_KEY]?: boolean;
  }
  interface TextElement {
    [CODE_BLOCK_TYPE]?: string;
  }
}

export const CodeBlockPlugin = (editor: Editor, isRender: boolean): Plugin => {
  const codeBlockCommand: CommandFn = editor => {
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
    setWrapNodes(
      editor,
      { [CODE_BLOCK_KEY]: { language: DEFAULT_LANGUAGE } },
      { [CODE_BLOCK_ITEM_KEY]: true }
    );
  };

  return {
    key: CODE_BLOCK_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: codeBlockCommand,
    match: props => !!props.element[CODE_BLOCK_KEY],
    renderLine: context => {
      if (context.element[CODE_BLOCK_ITEM_KEY]) return context.children;
      return <div className="code-block">{context.children}</div>;
    },
    matchLeaf: props => !!props.leaf[CODE_BLOCK_TYPE],
    renderLeaf: context => {
      context.classList.push("token", context.element[CODE_BLOCK_TYPE] || "");
      return context.children;
    },
    decorate: entry => {
      const [node, path] = entry;
      const ranges: Range[] = [];
      if (isBlock(editor, node) && node[CODE_BLOCK_ITEM_KEY]) {
        const textNode = node.children[0];
        if (isText(textNode)) {
          const textPath = [...path, 0];
          const str = Editor.string(editor, path);
          const codeRange = codeTokenize(str, "javascript");
          codeRange.forEach(item => {
            ranges.push({
              anchor: { path: textPath, offset: item.start },
              focus: { path: textPath, offset: item.end },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              [CODE_BLOCK_TYPE]: item.type,
            });
          });
        }
      }
      return ranges;
    },
  };
};
