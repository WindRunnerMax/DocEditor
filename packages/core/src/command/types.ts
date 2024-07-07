import type { BaseNode, Path, TextElement } from "doc-editor-delta";

export type CommandPayload = {
  path?: Path;
  element?: BaseNode;
  event?: React.MouseEvent<HTMLDivElement, MouseEvent>;
  position?: { left: number; top: number };
  marks?: TextElement | null;
  origin?: string;
  extraKey?: string;
  [key: string]: unknown;
};

export type CommandFn = (data: CommandPayload) => void | Promise<void>;

export type EditorCommands = Record<string, CommandFn>;
