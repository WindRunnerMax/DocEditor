import type { BaseNode, Location, Path } from "doc-editor-delta";

import type { EditorSuite } from "../editor/types";
import type { CommandFn, EditorCommands } from "./types";

export class Command {
  private commands: EditorCommands = {};
  constructor(private editor: EditorSuite) {}

  get() {
    return this.commands;
  }

  register = (key: string, fn: CommandFn) => {
    this.commands[key] = fn;
  };

  exec = (
    key: string,
    data: {
      path?: Path;
      selection?: Location;
      element?: BaseNode;
      [key: string]: unknown;
    }
  ) => {
    return this.commands[key] && this.commands[key](this.editor, key, data);
  };

  destroy = () => {
    this.commands = {};
  };
}
