import { Editor, Location, Path, TextElement, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { BlockElement } from "../../types/types";
import { existKey } from "./get";
import { isBlock, isText } from "./is";

export const focusSelection = (editor: Editor, path?: Path, edge?: "start" | "end") => {
  ReactEditor.focus(editor);
  if (path) {
    Transforms.select(editor, path);
    Transforms.collapse(editor, { edge: edge || "end" });
  } else {
    Transforms.collapse(editor, { edge: "focus" });
  }
};

export const setBlockNode = (
  editor: Editor,
  config: Record<string, unknown>,
  options: {
    at?: Location;
    node?: BlockElement;
    key?: string;
  } = {}
) => {
  const { at: location, node, key } = options;
  if (node) {
    Transforms.setNodes(editor, config, { match: n => n === node });
  } else {
    Transforms.setNodes(editor, config, {
      at: location,
      match: node => isBlock(editor, node) && (key ? existKey(node, key) : true),
    });
  }
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
  const { at: location, node, key } = options;
  if (node) {
    Transforms.unsetNodes(editor, props, { match: n => n === node });
  } else {
    Transforms.unsetNodes(editor, props, {
      at: location,
      match: node => isBlock(editor, node) && (key ? existKey(node, key) : true),
    });
  }
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
    Transforms.setNodes(editor, config, { match: n => n === node, split: true });
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
    Transforms.unsetNodes(editor, props, { match: n => n === node });
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
  const computedWrapConfig: BlockElement = { ...wrapConfig, children: [] };
  Transforms.wrapNodes(editor, computedWrapConfig, { match: n => isBlock(editor, n), at });
  setBlockNode(editor, itemConfig, { at });
};

export const setUnWrapNodes = (
  editor: Editor,
  options: {
    at?: Location;
    wrapKey: string;
    itemKey: string;
  }
) => {
  setUnBlockNode(editor, [options.itemKey], { key: options.itemKey });
  Transforms.unwrapNodes(editor, {
    match: n => existKey(n, options.wrapKey),
    split: true,
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
