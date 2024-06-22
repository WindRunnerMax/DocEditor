import type { Object } from "doc-editor-utils";

export const EDITOR_STATE = {
  IS_MOUSE_DOWN: "IS_MOUSE_DOWN",
};

export type StateMap = Record<Object.Values<typeof EDITOR_STATE>, boolean>;
export type StateKey = Object.Values<typeof EDITOR_STATE>;
