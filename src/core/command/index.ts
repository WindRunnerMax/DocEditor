import { Editor, Path, Location, TextElement } from "slate";

export type CommandFn = (
  editor: Editor,
  key: string,
  data: {
    path?: Path;
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
  editor: Editor,
  commands: EditorCommands,
  key: string,
  data: {
    path?: Path;
    selection?: Location;
    [key: string]: unknown;
  }
) => {
  return commands[key] && commands[key](editor, key, data);
};
