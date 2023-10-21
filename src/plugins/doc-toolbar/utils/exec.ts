import { ReactEditor } from "slate-react";
import { DocToolBarState } from "../types";
import { focusSelection } from "src/core/ops/set";
import { execCommand } from "src/core/command";

export const exec = (state: DocToolBarState, key: string) => {
  const { editor, element, commands } = state;
  const [type, data] = key.split(".");
  const path = ReactEditor.findPath(editor, element);
  focusSelection(editor, path);
  execCommand(editor, commands, type, { extraKey: data, path });
};
