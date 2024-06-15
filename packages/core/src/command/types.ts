import type { BaseNode, Path, TextElement } from "doc-editor-delta";

import type { EditorSuite } from "../editor/types";

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

export type CommandFn = (
  editor: EditorSuite,
  key: string,
  data: CommandPayload
) => void | Promise<void>;

export type EditorCommands = Record<string, CommandFn>;
