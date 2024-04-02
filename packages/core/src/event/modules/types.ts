import type { BaseRange, NodeOperation, Range, TextOperation } from "doc-editor-delta";

export type ContentChangeEvent = {
  changes: NodeOperation | TextOperation;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type PaintEvent = {};

export type SelectionChangeEvent = {
  previous: Partial<BaseRange> | Range | null;
  current: Partial<BaseRange> | Range | null;
};

export type ReadonlyStateEvent = {
  prev: boolean;
  next: boolean;
};
