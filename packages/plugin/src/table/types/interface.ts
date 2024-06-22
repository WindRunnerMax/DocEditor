import type { EDITOR_EVENT, EventMap } from "doc-editor-core";

export type TableSelection = {
  start: [number, number];
  end: [number, number];
} | null;

export type TableViewEvents = {
  onEditorSelectionChange: (event: EventMap[typeof EDITOR_EVENT.SELECTION_CHANGE]) => void;
};
