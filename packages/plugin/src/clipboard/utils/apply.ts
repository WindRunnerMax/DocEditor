import type { EditorKit } from "doc-editor-core";
import type { BaseNode } from "doc-editor-delta";
import type { BlockElement } from "doc-editor-delta";
import { isText, isTextBlock } from "doc-editor-utils";

/**
 * 将 Mark 应用到文本节点上
 * 原地修改 返回传入的节点引用
 * @param nodes
 * @param map
 */
export const applyMarker = (nodes: BaseNode[], map: Record<string, unknown>) => {
  const queue: BaseNode[] = [...nodes];
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;
    // 文本节点直接应用 marks
    if (isText(node)) {
      for (const [key, value] of Object.entries(map)) {
        node[key] = value;
      }
      continue;
    }
    const children = node.children || [];
    queue.unshift(...children);
  }
  return nodes;
};

/**
 * 将 Mark 应用到块节点上
 * 非原地修改 返回新的节点引用
 * @param nodes
 * @param map
 */
export const applyLineMarker = (
  editor: EditorKit,
  nodes: BaseNode[],
  map: Record<string, unknown>
) => {
  const target: BaseNode[] = [];
  for (const node of nodes) {
    // 如果是文本节点则需要包装成块级节点
    if (isText(node)) {
      const block: BlockElement = { children: [node] };
      for (const [key, value] of Object.entries(map)) {
        block[key] = value;
      }
      target.push(block);
      continue;
    }
    // 如果是块级节点则直接应用样式
    // 考虑多级节点嵌套的情况是否需要复用块节点 ?
    if (isTextBlock(editor.raw, node)) {
      for (const [key, value] of Object.entries(map)) {
        node[key] = value;
      }
      target.push(node);
      continue;
    }
    target.push(node);
  }
  return target;
};
