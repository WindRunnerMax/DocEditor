import { Editor, Path } from "slate";
import { orderedListItemKey, orderedListKey, OrderListItemConfig } from ".";
import { ExtendAncestor } from "../../types/types";
import {
  existKey,
  getBlockNode,
  getNextBlockNode,
  isCollapsed,
  isSlateElement,
  setBlockNode,
} from "../../utils/slate-utils";

const applyNewOrderList = (editor: Editor, block: ExtendAncestor, path: Path) => {
  const batchFn: (() => void)[] = [];
  const levelCounter: Record<number, number> = {};
  if (!existKey(block, orderedListKey)) return void 0;
  block.children.forEach((item, index) => {
    const attributes = item[orderedListItemKey] as OrderListItemConfig;
    if (!attributes) return void 0;
    const { level, start } = attributes;
    levelCounter[level] = (levelCounter[level] || 0) + 1;
    const newStart = levelCounter[level];
    if (newStart === start) return void 0;
    batchFn.push(() => {
      setBlockNode(
        editor,
        {
          [orderedListItemKey]: { level, start: newStart },
        },
        [...path, index]
      );
    });
  });
  batchFn.forEach(fn => fn());
};

export const calcOrderListLevels = (editor: Editor, at = editor.selection) => {
  if (isCollapsed(editor, at)) {
    const match = getBlockNode(editor, at, orderedListKey);
    if (match && isSlateElement(match.block)) {
      const { block, path } = match;
      applyNewOrderList(editor, block, path);
    }
  }
  return void 0;
};

export const calcNextOrderListLevels = (editor: Editor) => {
  if (isCollapsed(editor, editor.selection)) {
    const match = getBlockNode(editor, editor.selection);
    if (match && isSlateElement(match.block)) {
      const nextBLockNode = getNextBlockNode(editor, match.path, orderedListKey);
      if (nextBLockNode) applyNewOrderList(editor, nextBLockNode.block, nextBLockNode.path);
    }
  }
};
