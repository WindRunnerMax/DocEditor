import type { BaseNode, BlockElement, Location, Path } from "doc-editor-delta";
import { Editor, ReactEditor } from "doc-editor-delta";

import { existKey } from "./ref";

export const getBlockNode = (
  editor: Editor,
  options: {
    at?: Location;
    key?: string;
    above?: boolean;
  } = {}
) => {
  const { at: location, key, above } = options;
  const match = Editor.above<BlockElement>(editor, {
    match: n => Editor.isBlock(editor, n) && (key ? existKey(n, key) : true),
    at: location,
    // 这里的`Mode`与`TF.setNodes`不一样 会实际改变迭代顺序
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/editor.ts#L350
    mode: above ? "highest" : "lowest",
  });
  if (!match) return null;
  const [block, path] = match;
  return { block, path };
};

export const getNextBlockNode = (
  editor: Editor,
  options: {
    at?: Location;
    key?: string;
    above?: boolean;
  } = {}
) => {
  const { at: location, key, above } = options;
  const match = Editor.next<BlockElement>(editor, {
    match: n => Editor.isBlock(editor, n) && (key ? existKey(n, key) : true),
    at: location,
    mode: above ? "highest" : "lowest",
  });
  if (!match) return null;
  const [block, path] = match;
  return { block, path };
};

export const getOmitAttributes = (
  keys: string[],
  exclude: string[] = []
): { list: string[]; record: Record<string, void> } => {
  const result: Record<string, void> = {};
  keys.forEach(item => exclude.indexOf(item) === -1 && (result[item] = void 0));
  return { record: result, list: Object.keys(result) };
};

export const getLineIndex = (editor: Editor, path: Path) => {
  const [index] = path;
  const count = editor.children.length;
  // 0 - (length - 1)
  if (index !== void 0 && 0 <= index && index < count) return index;
  if (editor.selection) {
    const [selectionIndex] = editor.selection.anchor.path;
    return selectionIndex;
  }
  return 0;
};

/**
 * 根据`Node`获取`Path` 非迭代方式
 * @param editor ReactEditor
 * @param target BaseNode
 * @returns Path | null
 * @compat 在查找失败时会迭代`Editor`数据兜底
 */
export const findNodePath = (editor: ReactEditor, target: BaseNode): Path | null => {
  try {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/react-editor.ts#L90
    return ReactEditor.findPath(editor, target);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("FindNodePath Error", error);
    }
    type QueueNode = { path: number[]; node: BaseNode | Editor };
    const queue: QueueNode[] = [{ path: [], node: editor }];
    while (queue.length) {
      const curNode = queue.pop();
      if (!curNode || !curNode.node || !Array.isArray(curNode.node.children)) continue;
      for (const [index, node] of curNode.node.children.entries()) {
        if (node === target) {
          return [...curNode.path, index];
        }
        queue.push({ path: [...curNode.path, index], node });
      }
    }
    return null;
  }
};

/**
 * 向上查找最近的`Block`节点`Path`
 * @param editor
 * @param at
 */
export const getClosestBlockPath = (editor: Editor, at: Location): Path | null => {
  const path = [...Editor.path(editor, at)];
  while (path.length) {
    const tuple = Editor.node(editor, path);
    if (tuple && Editor.isBlock(editor, tuple[0])) return path;
    path.pop();
  }
  return null;
};

/**
 * 向上查找最近的`Block`节点
 * @param editor
 * @param at
 */
export const getClosestBlockNode = (editor: Editor, at: Location): BlockElement | null => {
  const path = [...Editor.path(editor, at)];
  while (path.length) {
    const tuple = Editor.node(editor, path);
    if (tuple && Editor.isBlock(editor, tuple[0])) return tuple[0];
    path.pop();
  }
  return null;
};

/**
 * 获取指定深度的`Node`元组
 * @param editor
 * @param at
 * @param depth > 0
 */
export const getNodeTupleByDepth = (editor: Editor, at: Location, depth: number) => {
  if (depth <= 0) return null;
  const path = [...Editor.path(editor, at)].slice(0, -depth);
  const target = path.length && Editor.node(editor, path);
  if (target && target[0]) {
    return { node: target[0] as BlockElement, path: target[1] };
  }
  return null;
};
