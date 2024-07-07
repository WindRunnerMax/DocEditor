import { isDOMElement } from "doc-editor-core";

export const BLOCK_TAG_NAME = ["p", "div"];

export const isMatchTag = (node: Node, name: string) => {
  return isDOMElement(node) && node.tagName.toLocaleLowerCase() === name.toLocaleLowerCase();
};

export const isMatchBlockTag = (node: Node) => {
  return BLOCK_TAG_NAME.some(name => isMatchTag(node, name));
};
