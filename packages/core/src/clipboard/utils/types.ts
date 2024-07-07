import type { BaseNode } from "doc-editor-delta";

export type CopyContext = {
  node: BaseNode;
  html: Node;
};

export type PasteContext = {
  nodes: BaseNode[];
  html: Node;
  files?: File[];
};

export type PasteNodesContext = {
  nodes: BaseNode[];
};
