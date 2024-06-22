export const NATIVE_EVENTS = {
  GLOBAL_MOUSE_DOWN: "mousedown",
  GLOBAL_MOUSE_UP: "mouseup",
} as const;

export type NativeEventMap = {
  [NATIVE_EVENTS.GLOBAL_MOUSE_DOWN]: MouseEvent;
  [NATIVE_EVENTS.GLOBAL_MOUSE_UP]: MouseEvent;
};
