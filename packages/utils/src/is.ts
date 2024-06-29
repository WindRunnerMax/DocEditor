import type {
  BaseRange,
  BlockElement,
  Location,
  Node,
  Path,
  TextBlockElement,
} from "doc-editor-delta";
import { Editor, Point, Range } from "doc-editor-delta";
import { isEmptyValue, isObject } from "laser-utils";

import { getBlockNode } from "./get";
import { getParentNode, isBlock, isText } from "./ref";

export const isWrappedNode = (editor: Editor) => {
  const match = getBlockNode(editor);
  return match && match.path.length >= 2;
};

export const isMatchedAttributeNode = (
  editor: Editor,
  key: string,
  value: unknown | null,
  path?: Path
) => {
  const [firstKey, ...keys] = key.split(".");
  const match = getBlockNode(editor, { at: path, key: firstKey });
  if (!match) return false;
  const matchedValue = match.block[firstKey];
  let preKeyData: unknown = matchedValue;
  for (let i = 0, n = keys.length; i < n; ++i) {
    if (isObject(preKeyData)) {
      preKeyData = preKeyData[keys[i]];
    } else {
      return false;
    }
  }
  if (isEmptyValue(value)) return true;
  return preKeyData === value;
};

export const isEmptyLine = (editor: Editor, path: Path) => {
  const start = Editor.start(editor, path);
  const end = Editor.end(editor, path);
  return Point.equals(start, end);
};

export const isCollapsed = (editor: Editor, at = editor.selection): at is BaseRange => {
  return !at || Range.isCollapsed(at);
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

export const isInlineBlock = (editor: Editor, node: Node): node is BlockElement => {
  return editor.isInline(node as BlockElement);
};

export const isTextBlock = (editor: Editor, node: Node): node is TextBlockElement => {
  if (!isBlock(editor, node)) return false;
  const firstNode = node.children[0];
  const result = firstNode && isText(firstNode);
  if (process.env.NODE_ENV === "development") {
    const strictInspection = node.children.every(child => isText(child));
    if (result !== strictInspection) {
      console.error("Fatal Error: Text Block Check Fail", node);
    }
  }
  return result;
};

type MatchNode = { block: BlockElement; path: Path } | null;
export function isWrappedEdgeNode(
  editor: Editor,
  mode: "first" | "last" | "or",
  options: { at?: Location; wrapKey: string; itemKey: string }
): boolean;
export function isWrappedEdgeNode(
  editor: Editor,
  mode: "first" | "last" | "or",
  options: { at?: Location; wrapNode: MatchNode; itemNode: MatchNode }
): boolean;
export function isWrappedEdgeNode(
  editor: Editor,
  mode: "first" | "last" | "or" = "last",
  options: {
    at?: Location;
    wrapKey?: string;
    itemKey?: string;
    wrapNode?: MatchNode;
    itemNode?: MatchNode;
  }
): boolean {
  const { at, wrapKey, itemKey } = options;
  const wrapNode = options.wrapNode || getBlockNode(editor, { at, key: wrapKey });
  const itemNode = options.itemNode || getBlockNode(editor, { at, key: itemKey });
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
}

/**
 * 检查最近的`Wrap`节点匹配(两级)
 * @param editor Editor
 * @param wrapKey string
 * @param pairKey string
 * @param at? Location
 * @returns boolean
 */
export const isMatchWrapNode = (
  editor: Editor,
  wrapKey: string,
  pairKey: string,
  at?: Location
) => {
  const location = at || editor.selection;
  if (!location) return false;
  const current = Editor.node(editor, location);
  const currentNode = current && current[0];
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/editor.ts#L1062
  const parent = getParentNode(editor, location);
  const parentNode = parent && parent.node;
  // 如果当前节点即块元素 检查当前块和父级块匹配关系
  if (isBlock(editor, currentNode) && isBlock(editor, parentNode)) {
    if (currentNode[pairKey] && parentNode[wrapKey]) {
      return true;
    }
    // 在这种情况下应该是只检查
    return false;
  }
  const ancestor = parent && getParentNode(editor, parent.path);
  const ancestorNode = ancestor && ancestor.node;
  // 检查父级块和祖先块匹配关系
  if (isBlock(editor, parentNode) && isBlock(editor, ancestorNode)) {
    if (parentNode[pairKey] && ancestorNode[wrapKey]) {
      return true;
    }
  }
  return false;
};
