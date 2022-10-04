import { BlockElement, Editor, Path } from "slate";
import {
  existKey,
  getBlockNode,
  getNextBlockNode,
  isBlock,
  isCollapsed,
  setBlockNode,
} from "../../utils/slate-utils";

const orderedListKey = "ordered-list";
const orderedListItemKey = "ordered-list-item";
const applyNewOrderList = (editor: Editor, block: BlockElement, path: Path) => {
  const batchFn: (() => void)[] = [];
  const levelCounter: Record<number, number> = {};
  if (!existKey(block, orderedListKey)) return void 0;
  let preLevel = -1;
  block.children.forEach((item, index) => {
    if (!isBlock(editor, item)) return void 0;
    const attributes = item[orderedListItemKey];
    if (!attributes) return void 0;
    const { level, start } = attributes;
    if (level > preLevel) levelCounter[level] = 0;
    preLevel = level;
    levelCounter[level] = (levelCounter[level] || 0) + 1;
    const newStart = levelCounter[level];
    if (newStart === start) return void 0;
    batchFn.push(() => {
      setBlockNode(
        editor,
        { [orderedListItemKey]: { level, start: newStart } },
        { at: [...path, index] }
      );
    });
  });
  batchFn.forEach(fn => fn());
};

export const calcOrderListLevels = (editor: Editor, at = editor.selection) => {
  if (isCollapsed(editor, at)) {
    const match = getBlockNode(editor, { key: orderedListKey });
    if (match) {
      const { block, path } = match;
      applyNewOrderList(editor, block, path);
    }
  }
  return void 0;
};

export const calcNextOrderListLevels = (editor: Editor) => {
  if (isCollapsed(editor, editor.selection)) {
    const match = getBlockNode(editor, { at: editor.selection });
    if (match) {
      const nextBLockNode = getNextBlockNode(editor, { at: match.path, key: orderedListKey });
      if (nextBLockNode) applyNewOrderList(editor, nextBLockNode.block, nextBLockNode.path);
    }
  }
};
