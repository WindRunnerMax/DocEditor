import type { BaseNode, Path, TextElement } from "doc-editor-delta";

import type { EditorKit } from "../editor";

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
  editor: EditorKit,
  key: string,
  data: CommandPayload
) => void | Promise<void>;

export type EditorCommands = Record<string, CommandFn>;
