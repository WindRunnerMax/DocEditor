import type { BaseNode, BlockElement, Location, Node, TextElement } from "doc-editor-delta";
import { Editor, Element, Path, Text } from "doc-editor-delta";
import { isArray } from "laser-utils";

// 此文件是为了避免循环引用

export const isBaseElement = (block: Node): block is BaseNode => {
  return !Editor.isEditor(block) && Element.isElement(block);
};

export const existKey = (node: Node, key: string) => isBaseElement(node) && !!node[key];

export const isBlock = (editor: Editor, node: Node | null): node is BlockElement => {
  if (!node) return false;
  return Editor.isBlock(editor, node);
};

export const isText = (node: Node): node is TextElement => Text.isText(node);

export const getAboveNode = (
  editor: Editor,
  options?: {
    at?: Location;
    match?: (node: Node, path: Path) => boolean;
    self?: boolean;
  }
) => {
  // 这里与`getBlockNode`最大区别是会有`self`的判断
  // 这是很重要的行为 特别是在类似于`Normalizer`的场景中
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/editor.ts#L334
  const { at = editor.selection, match, self = true } = options || {};
  if (!at) return void 0;
  const path = Editor.path(editor, at);
  const voids = false;
  const reverse = true;
  for (const [n, p] of Editor.levels(editor, {
    at: path,
    voids,
    match,
    reverse,
  })) {
    if (!Text.isText(n) && (self || !Path.equals(path, p))) {
      return { node: n as BlockElement, path: p };
    }
  }
};

export const getParentNode = (editor: Editor, at: Location) => {
  // fix: 如果是顶层元素则会直接抛异常
  if (isArray(at) && !at.length) return null;
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/editor.ts#L1062
  const parent = Editor.parent(editor, at);
  if (!parent) return null;
  const [node, path] = parent;
  return { node: node as BlockElement, path };
};

export const getBlockAttributes = (
  node?: BlockElement,
  omit?: string[]
): Record<string, unknown> => {
  if (!node) return {};
  const omits: string[] = omit ? omit : [];
  omits.push("children");
  const result: Record<string, unknown> = {};
  Object.keys(node)
    .filter(item => omits.indexOf(item) === -1)
    .forEach(key => (result[key] = node[key]));
  return result;
};
