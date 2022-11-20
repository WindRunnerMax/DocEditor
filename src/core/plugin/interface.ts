import { Editor, Range, NodeEntry } from "slate";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { CommandFn, SlateCommands } from "../command";

export const EDITOR_ELEMENT_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};
export const KEY_EVENT = {
  STOP: true,
};

type BasePlugin = {
  key: string;
  priority?: number; // 优先级越高 在越外层
  command?: CommandFn;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean | void;
  decorate?: (entry: NodeEntry) => Range[];
};
export type ElementPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.BLOCK;
  match: (props: RenderElementProps) => boolean;
  renderLine?: (context: ElementContext) => JSX.Element;
  render?: (context: ElementContext) => JSX.Element;
  matchLeaf?: (props: RenderLeafProps) => boolean;
  renderLeaf?: (context: LeafContext) => JSX.Element;
};
export type LeafPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.INLINE;
  match: (props: RenderLeafProps) => boolean;
  render?: (context: LeafContext) => JSX.Element;
};

export type Plugin = ElementPlugin | LeafPlugin;

type BaseContext = {
  classList: string[];
  children: JSX.Element;
  style: React.CSSProperties;
};
export type ElementContext = BaseContext & {
  element: RenderElementProps["element"];
  props: RenderElementProps;
};
export type LeafContext = BaseContext & {
  element: RenderLeafProps["text"];
  props: RenderLeafProps;
};

export type RenderPlugins = {
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => unknown;
  decorate: (entry: NodeEntry) => Range[];
  commands: SlateCommands;
  onCopy: (event: React.ClipboardEvent<HTMLDivElement>, editor: Editor) => void;
};
