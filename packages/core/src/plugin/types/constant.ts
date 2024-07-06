import type { Object } from "doc-editor-utils";

import type { EditorPlugin } from "../modules/declare";

export const PLUGIN_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};

export type PluginType = Object.Keys<typeof PLUGIN_TYPE>;

export const CALLER_TYPE = {
  SERIALIZE: "serialize",
  DESERIALIZE: "deserialize",
} as const;

export type CallerType = Object.Values<typeof CALLER_TYPE>;

export type CallerMap = {
  [CALLER_TYPE.SERIALIZE]: Parameters<Required<EditorPlugin>["serialize"]>["0"];
  [CALLER_TYPE.DESERIALIZE]: Parameters<Required<EditorPlugin>["deserialize"]>["0"];
};

export const KEY_EVENT = {
  STOP: true,
};
