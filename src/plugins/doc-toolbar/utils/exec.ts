import { ReactEditor } from "slate-react";
import type { DocToolBarState } from "../types";
import { execCommand } from "src/core/command";
import { Transforms } from "slate";

export const exec = (state: DocToolBarState, key: string) => {
  const { editor, element, commands } = state;
  const [type, data] = key.split(".");
  const path = ReactEditor.findPath(editor, element);
  ReactEditor.focus(editor);
  if (state.status.isNextLine) {
    if (!path.length) return void 0;
    const nextPath = path.slice(0, -1);
    const lastPath = path[path.length - 1] + 1;
    nextPath.push(lastPath);
    Transforms.insertNodes(editor, { children: [{ text: "" }] }, { at: nextPath, select: true });
    Promise.resolve().then(() => {
      const selection = state.editor.selection;
      if (!selection) return void 0;
      execCommand(editor, commands, type, { extraKey: data, path: selection.focus.path, element });
    });
  } else {
    execCommand(editor, commands, type, { extraKey: data, path, element });
  }
};
