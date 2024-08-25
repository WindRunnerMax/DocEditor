import type { Object } from "doc-editor-utils";

import type {
  ContentChangeEvent,
  PaintEvent,
  ReadonlyStateEvent,
  SelectionChangeEvent,
} from "../types/bus";
import type { NativeEventMap } from "../types/native";
import { NATIVE_EVENTS } from "../types/native";
import type { ReactEventMap } from "../types/react";
import { REACT_EVENTS } from "../types/react";

export const EDITOR_EVENT = {
  CONTENT_CHANGE: "CONTENT_CHANGE",
  SELECTION_CHANGE: "SELECTION_CHANGE",
  PAINT: "PAINT",
  MOUNT: "MOUNT",
  READONLY_CHANGE: "READONLY_CHANGE",
  ...REACT_EVENTS,
  ...NATIVE_EVENTS,
} as const;

type EditorEventMap = {
  [EDITOR_EVENT.PAINT]: PaintEvent;
  [EDITOR_EVENT.CONTENT_CHANGE]: ContentChangeEvent;
  [EDITOR_EVENT.SELECTION_CHANGE]: SelectionChangeEvent;
  [EDITOR_EVENT.MOUNT]: PaintEvent;
  [EDITOR_EVENT.READONLY_CHANGE]: ReadonlyStateEvent;
};

export type Handler<T extends EventType> = {
  once: boolean;
  priority: number;
  listener: Listener<T>;
};

export type EventContext = {
  key: string;
  stopped: boolean;
  prevented: boolean;
  stop: () => void;
  prevent: () => void;
};

export type EventType = Object.Values<typeof EDITOR_EVENT>;
export type Listeners = { [T in EventType]?: Handler<T>[] };
export type EventMap = NativeEventMap & ReactEventMap & EditorEventMap;
export type Listener<T extends EventType> = (value: EventMap[T], context: EventContext) => void;
