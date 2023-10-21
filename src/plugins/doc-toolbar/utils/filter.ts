import { BaseNode } from "src/types";
import { EditorSchema } from "src/core/schema";

let blockNodes: Set<string> | null = null;
export const getBlockNodes = (schema: EditorSchema) => {
  if (!blockNodes) {
    blockNodes = new Set(Object.keys(schema).filter(key => schema[key] && schema[key].block));
  }
  return blockNodes;
};

export const isBlockNode = (schema: EditorSchema, element: BaseNode) => {
  const blockNodes = getBlockNodes(schema);
  const mixed = Object.keys(element).filter(key => blockNodes.has(key));
  return mixed.length > 0;
};
