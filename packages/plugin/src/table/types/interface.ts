import type { Selection } from "doc-editor-delta";

export type TableSelection = {
  start: [number, number];
  end: [number, number];
};

export type TableViewEvents = {
  onEditorSelectionChange: (sel: Selection) => void;
};
