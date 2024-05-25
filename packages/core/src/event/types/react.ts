export const NATIVE_EVENTS = {
  COMPOSITION_START: "compositionstart",
  COMPOSITION_UPDATE: "compositionupdate",
  COMPOSITION_END: "compositionend",
  COPY: "copy",
  CUT: "cut",
  PASTE: "paste",
  KEY_DOWN: "keydown",
  KEY_PRESS: "keypress",
  KEY_UP: "keyup",
  FOCUS: "focus",
  BLUR: "blur",
  MOUSE_DOWN: "mousedown",
  MOUSE_UP: "mouseup",
  MOUSE_MOVE: "mousemove",
  DROP: "drop",
  DROP_OVER: "dragover",
} as const;

export type NativeEventMap = {
  [NATIVE_EVENTS.COMPOSITION_START]: React.CompositionEvent<HTMLDivElement>;
  [NATIVE_EVENTS.COMPOSITION_UPDATE]: React.CompositionEvent<HTMLDivElement>;
  [NATIVE_EVENTS.COMPOSITION_END]: React.CompositionEvent<HTMLDivElement>;
  [NATIVE_EVENTS.COPY]: React.ClipboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.CUT]: React.ClipboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.PASTE]: React.ClipboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.KEY_DOWN]: React.KeyboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.KEY_PRESS]: React.KeyboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.KEY_UP]: React.KeyboardEvent<HTMLDivElement>;
  [NATIVE_EVENTS.FOCUS]: React.FocusEvent<HTMLDivElement>;
  [NATIVE_EVENTS.BLUR]: React.FocusEvent<HTMLDivElement>;
  [NATIVE_EVENTS.MOUSE_DOWN]: React.MouseEvent<HTMLDivElement>;
  [NATIVE_EVENTS.MOUSE_MOVE]: React.MouseEvent<HTMLDivElement>;
  [NATIVE_EVENTS.MOUSE_UP]: React.MouseEvent<HTMLDivElement>;
  [NATIVE_EVENTS.DROP]: React.DragEvent<HTMLDivElement>;
  [NATIVE_EVENTS.DROP_OVER]: React.DragEvent<HTMLDivElement>;
};
