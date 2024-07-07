/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NodeEntry, Range, RenderElementProps, RenderLeafProps } from "doc-editor-delta";
import type { Object } from "doc-editor-utils";

export type ApplyPlugins = {
  renderBlock: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  decorate: (entry: NodeEntry) => Range[];
};

import type { EditorPlugin } from "../modules/declare";

export const PLUGIN_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};

export type PluginType = Object.Keys<typeof PLUGIN_TYPE>;

export const CALLER_TYPE = {
  SERIALIZE: "serialize",
  DESERIALIZE: "deserialize",
  NORMALIZE: "normalize",
  WILL_SET_CLIPBOARD: "willSetToClipboard",
  WILL_PASTE_NODES: "willApplyPasteNodes",
} as const;

export type CallerType = Object.Values<typeof CALLER_TYPE>;

type AnyFn = (...args: any[]) => any;
type PickPluginType<key extends keyof EditorPlugin> = Required<EditorPlugin>[key] extends AnyFn
  ? Parameters<Required<EditorPlugin>[key]>[0]
  : null;

export type CallerMap = {
  [CALLER_TYPE.SERIALIZE]: PickPluginType<typeof CALLER_TYPE.SERIALIZE>;
  [CALLER_TYPE.DESERIALIZE]: PickPluginType<typeof CALLER_TYPE.DESERIALIZE>;
  [CALLER_TYPE.NORMALIZE]: PickPluginType<typeof CALLER_TYPE.NORMALIZE>;
  [CALLER_TYPE.WILL_SET_CLIPBOARD]: PickPluginType<typeof CALLER_TYPE.WILL_SET_CLIPBOARD>;
  [CALLER_TYPE.WILL_PASTE_NODES]: PickPluginType<typeof CALLER_TYPE.WILL_PASTE_NODES>;
};
