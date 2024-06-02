import type { BlockElement, Location, TextElement } from "doc-editor-delta";
import { Editor, Path, Transforms } from "doc-editor-delta";

import { existKey, getAboveNode, getBlockAttributes, isBlock, isText } from "./ref";

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
    // 因此这里需要使用`Editor.above`实现更精确的查找 再将`node`直接传入来精确变换
    // 更加精细化/可预测的节点操作应该是通过`Node.levels`配合定义的边界属性精确控制要操作的节点
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/node.ts#L445
    const above = getAboveNode(editor, {
      at: location,
      match: node => isBlock(editor, node) && (key ? existKey(node, key) : true),
    });
    if (above && above.node) node = above.node as BlockElement;
  }
  if (!node) return void 0;
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/transforms/node.ts#L565
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
    if (above && above.node) node = above.node as BlockElement;
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
  Editor.withoutNormalizing(editor, () => {
    // 配合`Normalizer`在此处的规则是新建内层`Node`
    setBlockNode(editor, wrapConfig, { at });
    Transforms.wrapNodes(editor, itemConfig as BlockElement, { match: isText, at });
  });
};

export const setUnWrapNodes = (
  editor: Editor,
  options: {
    at?: Location;
    wrapKey: string;
    pairKey: string;
  }
) => {
  const { at, wrapKey, pairKey } = options;
  const wrap = getAboveNode(editor, { match: n => existKey(n, wrapKey), at });
  const pair = getAboveNode(editor, { match: n => existKey(n, pairKey), at });
  if (!wrap || !pair) return void 0;
  const wrapAttrs = getBlockAttributes(wrap.node, [wrapKey]);
  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, wrapAttrs, { at: pair.path });
    Transforms.unsetNodes(editor, [pairKey], { at: pair.path });
    Transforms.unwrapNodes(editor, {
      match: (_, p) => Path.equals(p, wrap.path),
      split: true,
      // 这里需要注意`at`会变成`range`
      // 如果此处传入`wrap.path`会导致所有的子节点都会被`unwrap`
      // 即使`match`的结果是一致的 但是变换时会有`rangeRef`来判断相交范围
      // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/transforms/node.ts#L873
      at: pair.path,
    });
  });
};

export const setUnWrapNodesExactly = (
  editor: Editor,
  options: {
    wrapKey: string;
    pairKey: string;
    pairPath: Path;
    wrapNode: BlockElement;
  }
) => {
  const { wrapNode, pairPath, wrapKey, pairKey } = options;
  const wrapAttrs = getBlockAttributes(wrapNode, [wrapKey]);
  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, wrapAttrs, { at: pairPath });
    Transforms.unsetNodes(editor, [pairKey], { at: pairPath });
    Transforms.unwrapNodes(editor, { split: true, at: pairPath });
  });
};
