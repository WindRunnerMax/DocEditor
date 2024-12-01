import type { BaseNode } from "doc-editor-delta";

/** Fragment => HTML */
export type CopyContext = {
  /** Node 基准 */
  node: BaseNode;
  /** HTML 目标 */
  html: Node;
};

/** HTML => Fragment */
export type PasteContext = {
  /** Node 目标 */
  nodes: BaseNode[];
  /** HTML 基准 */
  html: Node;
  /** FILE 基准 */
  files?: File[];
};

/** Clipboard => Context */
export type PasteNodesContext = {
  /** Node 基准 */
  nodes: BaseNode[];
};
