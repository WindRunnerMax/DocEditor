import type { Object } from "doc-editor-utils";

export const EDITOR_ELEMENT_TYPE = {
  BLOCK: "BLOCK" as const,
  INLINE: "INLINE" as const,
};

export const KEY_EVENT = {
  STOP: true,
};

export type ElementType = Object.Keys<typeof EDITOR_ELEMENT_TYPE>;
