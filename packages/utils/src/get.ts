import type { BaseNode, BlockElement, Location, Path } from "doc-editor-delta";
import { Editor, ReactEditor } from "doc-editor-delta";
import { isObject } from "laser-utils";

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

export const getPathById = (editor: Editor, uuid: string): Path | null => {
  // 尝试参考`ReactEditor.findPath`优化 优化查找模式
  // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/react-editor.ts#L90
  type QueueNode = { path: number[]; node: BaseNode | Editor };
  const queue: QueueNode[] = [{ path: [], node: editor }];
  while (queue.length) {
    const curNode = queue.pop();
    if (!curNode || !curNode.node || !Array.isArray(curNode.node.children)) continue;
    for (const [index, node] of curNode.node.children.entries()) {
      if (isObject(node) && node.uuid === uuid) return [...curNode.path, index];
      queue.push({ path: [...curNode.path, index], node });
    }
  }
  return null;
};

export const findNodePath = (editor: ReactEditor, target: BaseNode): Path | null => {
  try {
    return ReactEditor.findPath(editor, target);
  } catch (error) {
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
 * 向上查找指定位置的`Block`节点
 * @param editor
 * @param at
 */
export const getBlockPath = (editor: Editor, at: Location): Path | null => {
  const path = [...Editor.path(editor, at)];
  while (path.length) {
    const node = Editor.node(editor, path);
    if (node && Editor.isBlock(editor, node[0])) return path;
    path.pop();
  }
  return null;
};
