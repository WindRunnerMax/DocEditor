import type { PasteContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import type { PasteNodesContext } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { BaseNode } from "doc-editor-delta";
import { getUniqueId, isText } from "doc-editor-utils";

import { HEADING_KEY } from "../heading/types";
import { CLIPBOARD_KEY } from "./types/index";
import { isMatchBlockTag } from "./utils/is";

export class ClipboardPlugin extends BlockPlugin {
  public key: string = CLIPBOARD_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(): boolean {
    return false;
  }

  public deserialize(context: PasteContext): void {
    const { nodes, html } = context;
    if (nodes.every(isText) && isMatchBlockTag(html)) {
      context.nodes = [{ children: nodes }];
    }
  }

  public willApplyPasteNodes(context: PasteNodesContext): void {
    const nodes = context.nodes;
    const queue: BaseNode[] = [...nodes];
    while (queue.length) {
      const node = queue.shift();
      if (!node) continue;
      // FIX: 处理粘贴时的 id 重复问题
      if (node && node[HEADING_KEY]) {
        node[HEADING_KEY] = { ...node[HEADING_KEY], id: getUniqueId(6) };
      }
      node.children && queue.push(...node.children);
      // FIX: 兜底处理无文本节点的情况 例如 <div><div></div></div>
      if (node.children && !node.children.length) {
        node.children.push({ text: "" });
      }
    }
  }
}
