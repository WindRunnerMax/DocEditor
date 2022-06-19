import { Editor, Location, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { BlockElement } from "../types/types";
import { existKey } from "./slate-get";
import { isBlock, isText } from "./slate-is";

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
  location?: Location
) => {
  Transforms.setNodes(editor, config, { at: location, match: node => isBlock(editor, node) });
};

export const setTextNode = (
  editor: Editor,
  config: Record<string, unknown>,
  location?: Location
) => {
  Transforms.setNodes(editor, config, { match: isText, split: true, at: location });
};

export const setWrapNodes = (
  editor: Editor,
  config: Record<string, unknown>,
  location?: Location
) => {
  const wrapConfig: BlockElement = { ...config, children: [] };
  Transforms.wrapNodes(editor, wrapConfig, { at: location });
};

export const setUnWrapNodes = (editor: Editor, matchKey: string, location?: Location) => {
  Transforms.unwrapNodes(editor, {
    match: node => existKey(node, matchKey),
    split: true,
    at: location,
  });
};
