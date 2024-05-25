import type { BlockElement, Location, Path, TextElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";

import { existKey, getAboveNode, isBlock, isText } from "./ref";

export const setBlockNode = (
  editor: Editor,
  config: Record<string, unknown>,
  options: {
    at?: Location;
    node?: BlockElement;
    key?: string;
  } = {}
) => {
  let { node } = options;
  const { at: location, key } = options;
  if (!node) {
    // 注意`setNodes Match`的查找顺序可能与直觉不一致 顺序是由顶`Editor`至底`Node`
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/transforms/node.ts#L565
    // 因此这里需要使用`Editor.above`实现更精确的查找 再将`node`直接传入来精确变换
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/editor.ts#L334
    const above = getAboveNode(editor, {
      at: location,
      match: node => isBlock(editor, node) && (key ? existKey(node, key) : true),
    });
    if (above && above[0]) node = above[0] as BlockElement;
  }
  if (!node) return void 0;
  Transforms.setNodes(editor, config, { match: n => n === node, at: location });
};

export const setUnBlockNode = (
  editor: Editor,
  props: string[],
  options: {
    at?: Location;
    node?: BlockElement;
    key?: string;
  } = {}
) => {
  let { node } = options;
  const { at: location, key } = options;
  if (!node) {
    const above = getAboveNode(editor, {
      at: location,
      match: node => isBlock(editor, node) && (key ? existKey(node, key) : true),
    });
    if (above && above[0]) node = above[0] as BlockElement;
  }
  if (!node) return void 0;
  Transforms.unsetNodes(editor, props, { match: n => n === node, at: location });
};

export const setTextNode = (
  editor: Editor,
  config: Record<string, unknown>,
  options: {
    at?: Location;
    node?: TextElement;
  } = {}
) => {
  const { at: location, node } = options;
  if (node) {
    Transforms.setNodes(editor, config, { match: n => n === node, split: true, at: location });
  } else {
    Transforms.setNodes(editor, config, { match: isText, split: true, at: location });
  }
};

export const setUnTextNode = (
  editor: Editor,
  props: string[],
  options: {
    at?: Location;
    node?: TextElement;
  } = {}
) => {
  const { at: location, node } = options;
  if (node) {
    Transforms.unsetNodes(editor, props, { match: n => n === node, at: location });
  } else {
    Transforms.unsetNodes(editor, props, { match: isText, split: true, at: location });
  }
};

export const setWrapNodes = (
  editor: Editor,
  wrapConfig: Record<string, unknown>,
  itemConfig: Record<string, unknown>,
  options: {
    at?: Location;
  } = {}
) => {
  const { at } = options;
  const config = { ...wrapConfig } as BlockElement;
  Editor.withoutNormalizing(editor, () => {
    Transforms.wrapNodes(editor, config, { match: n => isBlock(editor, n), at });
    setBlockNode(editor, itemConfig, { at });
  });
};

export const setUnWrapNodes = (
  editor: Editor,
  options: {
    at?: Location;
    wrapKey: string;
    itemKey: string;
  }
) => {
  Editor.withoutNormalizing(editor, () => {
    setUnBlockNode(editor, [options.itemKey], { key: options.itemKey });
    Transforms.unwrapNodes(editor, {
      match: n => existKey(n, options.wrapKey),
      split: true,
    });
  });
};

type MatchNode = { block: BlockElement; path: Path } | null;
export const setWrapStructure = (
  editor: Editor,
  wrapMatch: MatchNode,
  itemMatch: MatchNode,
  itemKey: string
) => {
  if (wrapMatch && !itemMatch) {
    Transforms.unwrapNodes(editor, {
      match: n => n === wrapMatch.block,
      split: true,
    });
  } else if (!wrapMatch && itemMatch) {
    setUnBlockNode(editor, [itemKey], { node: itemMatch.block });
  }
};
