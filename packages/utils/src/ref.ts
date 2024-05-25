import type { BaseNode, BlockElement, Location, Node, TextElement } from "doc-editor-delta";
import { Editor, Element, Path, Text } from "doc-editor-delta";

// 此文件是为了避免循环引用

export const isBaseElement = (block: Node): block is BaseNode => {
  return !Editor.isEditor(block) && Element.isElement(block);
};

export const existKey = (node: Node, key: string) => isBaseElement(node) && !!node[key];

export const isBlock = (editor: Editor, node: Node): node is BlockElement =>
  Editor.isBlock(editor, node);

export const isText = (node: Node): node is TextElement => Text.isText(node);

export const getAboveNode = (
  editor: Editor,
  options?: {
    at?: Location;
    match?: (node: Node, path: Path) => boolean;
    self?: boolean;
  }
): [BlockElement, Path] | undefined => {
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
      return [n as BlockElement, p];
    }
  }
};
