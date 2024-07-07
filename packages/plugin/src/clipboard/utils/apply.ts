import type { BaseNode } from "doc-editor-delta";
import { isText } from "doc-editor-utils";

export const applyMarker = (nodes: BaseNode[], key: string, value = true) => {
  const queue: BaseNode[] = [...nodes];
  while (queue.length) {
    const node = queue.shift();
    if (!node) continue;
    if (isText(node)) {
      node[key] = value;
    } else {
      const children = node.children || [];
      queue.unshift(...children);
    }
  }
};
