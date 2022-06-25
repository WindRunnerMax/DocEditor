import {
  Editor,
  Range,
  Element as SlateElement,
  Point,
  Path,
  Text,
  Node,
  BaseRange,
  Location,
  BlockElement,
  TextElement,
} from "slate";
import { BaseNode } from "../types/types";
import { isObject } from "./is";
import { getBlockNode } from "./slate-get";

export const isWrappedNode = (editor: Editor) => {
  const match = getBlockNode(editor);
  return match && match.path.length >= 2;
};

export const isMatchedAttributeNode = (
  editor: Editor,
  key: string,
  value: unknown,
  path?: Path
) => {
  const [firstKey, ...keys] = key.split(".");
  const match = getBlockNode(editor, path, firstKey);
  if (!match) return false;
  const matchedValue = match.block[firstKey];
  let preKeyData: unknown = matchedValue;
  for (let i = 0, n = keys.length; i < n; ++i) {
    if (isObject(preKeyData)) preKeyData = preKeyData[keys[i]];
    else return false;
  }
  return preKeyData === value;
};

export const isEmptyLine = (editor: Editor, path: Path) => {
  const start = Editor.start(editor, path);
  const end = Editor.end(editor, path);
  return Point.equals(start, end);
};

export const isSlateElement = (block: Node): block is BaseNode => {
  return !Editor.isEditor(block) && SlateElement.isElement(block);
};

export const isCollapsed = (editor: Editor, at = editor.selection): at is BaseRange => {
  return !!(at && Range.isCollapsed(at));
};

export const isFocusLineStart = (editor: Editor, path: Path) => {
  const start = Editor.start(editor, path);
  return isCollapsed(editor, editor.selection) && Point.equals(start, editor.selection.anchor);
};

export const isFocusLineEnd = (editor: Editor, path: Path) => {
  const end = Editor.end(editor, path);
  return isCollapsed(editor, editor.selection) && Point.equals(end, editor.selection.anchor);
};

export const isMatchedEvent = (event: React.KeyboardEvent<HTMLDivElement>, ...args: string[]) => {
  const key = event.key;
  return args.indexOf(key) > -1;
};

export const isBlock = (editor: Editor, node: Node): node is BlockElement =>
  Editor.isBlock(editor, node);

export const isText = (node: Node): node is TextElement => Text.isText(node);

export const isWrappedEdgeNode = (
  editor: Editor,
  at: Location,
  wrapKey: string,
  itemKey: string,
  mode: "first" | "last" | "or" = "last"
) => {
  const wrapNode = getBlockNode(editor, at, wrapKey);
  const itemNode = getBlockNode(editor, at, itemKey);
  if (wrapNode && itemNode && wrapNode.block.children.length) {
    const children = wrapNode.block.children;
    if (mode === "last") {
      return children[children.length - 1] === itemNode.block;
    } else if (mode === "first") {
      return children[0] === itemNode.block;
    } else {
      return children[0] === itemNode.block || children[children.length - 1] === itemNode.block;
    }
  }
  return false;
};
