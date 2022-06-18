import { Editor, Path, Location } from "slate";

export type CommandFn = (
  editor: Editor,
  key: string,
  data?: {
    path?: Path;
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>;
    position?: { left: number; top: number };
    [key: string]: unknown;
  }
) => void | Promise<void>;

const commands: Record<string, CommandFn> = {};

export const registerCommand = (key: string, fn: CommandFn) => {
  commands[key] = fn;
};

export const execCommand = (
  editor: Editor,
  key: string,
  data?: {
    path?: Path;
    selection?: Location;
    [key: string]: unknown;
  }
) => {
  return commands[key] && commands[key](editor, key, data);
};
