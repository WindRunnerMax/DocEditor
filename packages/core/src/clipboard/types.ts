import type { BaseNode } from "doc-editor-delta";

export type CopyContext = {
  node: BaseNode;
  element: HTMLElement;
  stop: () => void;
};
