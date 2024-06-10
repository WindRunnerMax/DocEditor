import type { BaseNode, EditorPath } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { isArray } from "doc-editor-utils";

export const isEmptyLine = (element: BaseNode): boolean => {
  if (
    Object.keys(element).length === 1 &&
    isArray(element.children) &&
    element.children.length === 1 &&
    (element.children[0] as BaseNode).text === ""
  ) {
    return true;
  }
  return false;
};

export const withinIterator = (
  editor: Editor,
  path: EditorPath,
  callback: (node: BaseNode) => void
) => {
  if (path.length <= 1) return false;
  let count = path.length - 1;
  let parent = Editor.parent(editor, path);
  while (parent[0] && count--) {
    const node = parent[0] as BaseNode;
    callback(node);
    parent = Editor.parent(editor, parent[1]);
  }
  return false;
};
