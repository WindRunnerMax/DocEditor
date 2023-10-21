import { ReactEditor } from "slate-react";
import { DocToolBarState } from "../types";
import { focusSelection } from "src/core/ops/set";
import { execCommand } from "src/core/command";

export const exec = (state: DocToolBarState, params: string) => {
  const { editor, element, commands } = state;
  const [key, data] = params.split(".");
  const path = ReactEditor.findPath(editor, element);
  focusSelection(editor, path);
  execCommand(editor, commands, key, { extraKey: data, path });
};
