import type { BaseNode, BlockElement, Node, TextElement } from "doc-editor-delta";
import { Editor, Element, Text } from "doc-editor-delta";

// 此文件是为了避免循环引用

export const isBaseElement = (block: Node): block is BaseNode => {
  return !Editor.isEditor(block) && Element.isElement(block);
};

export const existKey = (node: Node, key: string) => isBaseElement(node) && !!node[key];

export const isBlock = (editor: Editor, node: Node): node is BlockElement =>
  Editor.isBlock(editor, node);

export const isText = (node: Node): node is TextElement => Text.isText(node);
