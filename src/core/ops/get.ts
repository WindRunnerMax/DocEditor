import { Editor, Location, Path, Node, BaseNode } from "slate";
import { BlockElement } from "../../types";
import { isObject } from "../../utils/is";
import { isBaseElement } from "./is";

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

export const getBlockAttributes = (
  node?: BlockElement,
  emit?: string[]
): Record<string, unknown> => {
  if (!node) return {};
  const emits: string[] = emit ? emit : [];
  emits.push("children");
  const result: Record<string, unknown> = {};
  Object.keys(node)
    .filter(item => emits.indexOf(item) === -1)
    .forEach(key => (result[key] = node[key]));
  return result;
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

export const existKey = (node: Node, key: string) => isBaseElement(node) && !!node[key];

export const getPathById = (editor: Editor, uuid: string): Path | null => {
  // TODO: 尝试参考`ReactEditor.findPath`优化 优化查找模式
  type QueueNode = { path: number[]; node: BaseNode };
  const queue: QueueNode[] = [{ path: [], node: editor }];
  while (queue.length) {
    const curNode = queue.pop();
    if (!curNode || !curNode.node || !Array.isArray(curNode.node.children)) continue;
    for (const [index, node] of (curNode.node.children as BaseNode[]).entries()) {
      if (isObject(node) && node.uuid === uuid) return [...curNode.path, index];
      queue.push({ path: [...curNode.path, index], node });
    }
  }
  return null;
};
