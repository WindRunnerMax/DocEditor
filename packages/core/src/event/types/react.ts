export const REACT_EVENTS = {
  COMPOSITION_START: "react_compositionstart",
  COMPOSITION_UPDATE: "react_compositionupdate",
  COMPOSITION_END: "react_compositionend",
  COPY: "react_copy",
  CUT: "react_cut",
  PASTE: "react_paste",
  KEY_DOWN: "react_keydown",
  KEY_PRESS: "react_keypress",
  KEY_UP: "react_keyup",
  FOCUS: "react_focus",
  BLUR: "react_blur",
  MOUSE_DOWN: "react_mousedown",
  MOUSE_UP: "react_mouseup",
  MOUSE_MOVE: "react_mousemove",
  DROP: "react_drop",
  DROP_OVER: "react_dragover",
} as const;

export type ReactEventMap = {
  [REACT_EVENTS.COMPOSITION_START]: React.CompositionEvent<HTMLDivElement>;
  [REACT_EVENTS.COMPOSITION_UPDATE]: React.CompositionEvent<HTMLDivElement>;
  [REACT_EVENTS.COMPOSITION_END]: React.CompositionEvent<HTMLDivElement>;
  [REACT_EVENTS.COPY]: React.ClipboardEvent<HTMLDivElement>;
  [REACT_EVENTS.CUT]: React.ClipboardEvent<HTMLDivElement>;
  [REACT_EVENTS.PASTE]: React.ClipboardEvent<HTMLDivElement>;
  [REACT_EVENTS.KEY_DOWN]: React.KeyboardEvent<HTMLDivElement>;
  [REACT_EVENTS.KEY_PRESS]: React.KeyboardEvent<HTMLDivElement>;
  [REACT_EVENTS.KEY_UP]: React.KeyboardEvent<HTMLDivElement>;
  [REACT_EVENTS.FOCUS]: React.FocusEvent<HTMLDivElement>;
  [REACT_EVENTS.BLUR]: React.FocusEvent<HTMLDivElement>;
  [REACT_EVENTS.MOUSE_DOWN]: React.MouseEvent<HTMLDivElement>;
  [REACT_EVENTS.MOUSE_MOVE]: React.MouseEvent<HTMLDivElement>;
  [REACT_EVENTS.MOUSE_UP]: React.MouseEvent<HTMLDivElement>;
  [REACT_EVENTS.DROP]: React.DragEvent<HTMLDivElement>;
  [REACT_EVENTS.DROP_OVER]: React.DragEvent<HTMLDivElement>;
};
