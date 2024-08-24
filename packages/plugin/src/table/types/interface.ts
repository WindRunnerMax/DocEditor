import type { SelectChangeEvent } from "../../shared/types/event";

export type TableSelection = {
  start: [number, number];
  end: [number, number];
} | null;

export type TableViewEvents = {
  onEditorSelectionChange: (event: SelectChangeEvent) => void;
};
