import { KEY_CODE as _KEY_CODE } from "laser-utils";

export const KEYBOARD = {
  BACKSPACE: "Backspace",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
} as const;

export const EVENT_ENUM = {
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
  MOUSE_DOWN: "mousedown",
  COPY: "copy",
  SELECTION_CHANGE: "selectionchange",
} as const;

export const KEY_CODE = {
  ..._KEY_CODE,
  B: 66,
  I: 73,
  K: 75,
  U: 85,
} as const;

export const DEFAULT_PRIORITY = 100;
