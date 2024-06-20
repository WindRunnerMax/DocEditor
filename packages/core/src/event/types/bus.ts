import type { NodeOperation, Range, TextOperation } from "doc-editor-delta";

export type ContentOperation = NodeOperation | TextOperation;

export type ContentChangeEvent = {
  change: ContentOperation;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type PaintEvent = {};

export type SelectionChangeEvent = {
  previous: Range | null;
  current: Range | null;
};

export type ReadonlyStateEvent = {
  prev: boolean;
  next: boolean;
};
