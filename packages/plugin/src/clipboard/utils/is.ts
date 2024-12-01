import { isDOMElement } from "doc-editor-core";

export const BLOCK_TAG_NAME = ["p", "div"];

/**
 * 匹配节点标签
 * @param node
 * @param name
 * @returns
 */
export const isMatchTag = (node: Node, name: string) => {
  return isDOMElement(node) && node.tagName.toLocaleLowerCase() === name.toLocaleLowerCase();
};

/**
 * 判断节点为块级节点
 * @param node
 * @returns
 */
export const isMatchBlockTag = (node: Node) => {
  return BLOCK_TAG_NAME.some(name => isMatchTag(node, name));
};
