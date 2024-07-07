import type { EditorKit } from "../editor";
import type { CommandFn, CommandPayload, EditorCommands } from "./types";

export class Command {
  private commands: EditorCommands = {};
  constructor(private editor: EditorKit) {}

  get() {
    return this.commands;
  }

  register = (key: string, fn: CommandFn) => {
    this.commands[key] = fn;
  };

  exec = (key: string, data: CommandPayload) => {
    return this.commands[key] && this.commands[key](data);
  };

  destroy = () => {
    this.commands = {};
  };
}
