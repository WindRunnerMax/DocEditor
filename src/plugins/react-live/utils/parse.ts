import Prism from "prismjs";
import "prismjs/themes/prism.min.css";
import "prismjs/components/prism-javascript";
import type { BlockElement, Path } from "slate";
import { Editor, Node } from "slate";
import { isBlock, isText, isTextBlock } from "src/core/ops/is";
import { getBlockNode } from "src/core/ops/get";
import { REACT_LIVE_KEY } from "../types";

type CodeRange = {
  type: string;
  start: number;
  end: number;
};

const getLength = (token: Prism.Token | string) => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  }
  return 0;
};

export const codeTokenize = (code: string) => {
  const tokens = Prism.tokenize(code, Prism.languages["Javascript".toLowerCase()]);
  const ranges: CodeRange[] = [];
  let start = 0;
  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;
    if (typeof token !== "string") {
      ranges.push({ type: token.type, start, end });
    }
    start = end;
  }
  return ranges;
};

export const collectReactLiveText = (
  editor: Editor,
  node: BlockElement,
  path: Path
): string | null => {
  const textNode = node.children[0];
  if (isText(textNode)) {
    const codeblockNode = getBlockNode(editor, { at: path, key: REACT_LIVE_KEY });
    if (codeblockNode) {
      const str = Editor.string(editor, path);
      return str;
    }
  }
  return null;
};

export const collectText = (editor: Editor, node: BlockElement) => {
  const parseText = (node: BlockElement): string => {
    return (node.children || [])
      .map(item => {
        if (isText(item)) return Node.string(item);
        else if (isTextBlock(editor, item)) return parseText(item) + "\n";
        else if (isBlock(editor, item)) return parseText(item);
        else return "";
      })
      .join("");
  };
  return parseText(node);
};
