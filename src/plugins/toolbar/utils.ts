import { Descendant, Editor, Transforms } from "slate";
import { isArray } from "src/utils/is";
import { getOmitAttributes, isText } from "../../utils/slate-utils";

export const toNormalText = (editor: Editor) => {
  if (editor.selection) {
    let marks: Record<string, void> = {};
    const [element] = Editor.fragment(editor, editor.selection);
    const queue: Descendant[] = [element];
    while (queue.length) {
      const node = queue.shift();
      if (!node) continue;
      if (isArray(node.children)) queue.push(...(node.children as Descendant[]));
      if (node.text) {
        const keys = Object.keys(node);
        marks = { ...marks, ...getOmitAttributes(keys, ["text"]) };
      }
    }
    Transforms.setNodes(editor, marks, { match: isText, split: true });
  }
};

export const maskMenuToolBar = (element: HTMLDivElement) => {
  element.style.opacity = "0";
  element.style.left = "-1000px";
  element.style.top = "-1000px";
};

export const getSelectionRect = () => {
  const domSelection = window.getSelection();
  if (domSelection) {
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    return rect;
  }
  return null;
};
