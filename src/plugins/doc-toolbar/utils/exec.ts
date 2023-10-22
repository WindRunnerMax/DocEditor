import { ReactEditor } from "slate-react";
import { DocToolBarState } from "../types";
import { focusSelection } from "src/core/ops/set";
import { execCommand } from "src/core/command";
import { Transforms } from "slate";

export const exec = (state: DocToolBarState, key: string) => {
  const { editor, element, commands } = state;
  const [type, data] = key.split(".");
  const path = ReactEditor.findPath(editor, element);
  focusSelection(editor, path);
  if (state.status.isNextLine) {
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
    Promise.resolve().then(() => {
      const selection = state.editor.selection;
      if (!selection) return void 0;
      execCommand(editor, commands, type, { extraKey: data, path: selection.focus.path, element });
    });
  } else {
    execCommand(editor, commands, type, { extraKey: data, path, element });
  }
};
