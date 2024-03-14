import type { BaseNode, Location, Path, TextElement } from "doc-editor-delta";

import type { EditorSuite } from "../editor/types";

export type CommandFn = (
  editor: EditorSuite,
  key: string,
  data: {
    path?: Path;
    element?: BaseNode;
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>;
    position?: { left: number; top: number };
    marks?: TextElement | null;
    [key: string]: unknown;
  }
) => void | Promise<void>;
export type EditorCommands = Record<string, CommandFn>;

export const registerCommand = (key: string, fn: CommandFn, commands: EditorCommands) => {
  commands[key] = fn;
};

export const execCommand = (
  editor: EditorSuite,
  commands: EditorCommands,
  key: string,
  data: {
    path?: Path;
    selection?: Location;
    element?: BaseNode;
    [key: string]: unknown;
  }
) => {
  return commands[key] && commands[key](editor, key, data);
};
