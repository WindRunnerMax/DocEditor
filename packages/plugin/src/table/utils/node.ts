import type { BlockElement } from "doc-editor-delta";
import type { BaseNode } from "doc-editor-delta";

export const NODE_TO_INDEX = new WeakMap<BaseNode, number>();
export const NODE_TO_PARENT = new WeakMap<BaseNode, BlockElement>();
