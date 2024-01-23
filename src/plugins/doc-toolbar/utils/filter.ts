import type { BaseNode, EditorPath } from "src/types";
import type { EditorSchema } from "src/core/schema";
import { isArray } from "src/utils/is";
import { Editor } from "slate";

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

export const isEmptyLine = (element: BaseNode): boolean => {
  if (
    Object.keys(element).length === 1 &&
    isArray<BaseNode>(element.children) &&
    element.children.length === 1 &&
    element.children[0].text === ""
  ) {
    return true;
  }
  return false;
};

export const isWithinNode = (editor: Editor, path: EditorPath, key: string) => {
  if (path.length <= 1) return false;
  let count = path.length - 1;
  let parent = Editor.parent(editor, path);
  while (parent[0] && count--) {
    const node = parent[0] as BaseNode;
    if (node[key]) return true;
    parent = Editor.parent(editor, parent[1]);
  }
  return false;
};
