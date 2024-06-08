import type { NodeEntry, Path } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { setUnWrapNodesExactly } from "doc-editor-utils";
import { isBlock, setUnBlockNode } from "doc-editor-utils";

export class Normalize {
  /** Wrap - Pair */
  protected wrap: Map<string, string> = new Map();
  /** Pair - Wrap */
  protected pair: Map<string, string> = new Map();
  /** Void */
  protected void: Set<string> = new Set<string>();
  /** Block */
  protected block: Set<string> = new Set<string>();
  /** Inline */
  protected inline: Set<string> = new Set<string>();
  /** Instance */
  protected instance: Set<string> = new Set<string>();

  protected normalize(editor: Editor, entry: NodeEntry) {
    try {
      Editor.withoutNormalizing(editor, () => {
        this.normalizeWrapNode(editor, entry);
        this.normalizePairNode(editor, entry);
      });
    } catch (error) {
      console.error("Normalize Error: ", error);
    }
  }

  private normalizeWrapNode(editor: Editor, entry: NodeEntry) {
    const [node, path] = entry;
    // 如果不是块级元素则返回 会继续处理默认的`Normalize`
    if (!isBlock(editor, node)) return void 0;
    for (const key of Object.keys(node)) {
      // --- 当前节点是`Wrap Node`的`Normalize` ---
      if (this.wrap.has(key)) {
        const pairKey = this.wrap.get(key) as string;
        const children = node.children || [];
        // 子节点上一定需要存在`Pair Key`
        // 否则需要在子节点的父节点移除`Wrap Key`
        children.forEach((child, index) => {
          if (isBlock(editor, child) && !child[pairKey]) {
            const location: Path = [...path, index];
            if (process.env.NODE_ENV === "development") {
              console.log("NormalizeWrapNode: ", location, `${key}->${pairKey}`);
            }
            // COMPAT: 为什么不在子节点加入`Pair Key`而是移除`Wrap Key`?
            // 因为在`setBlockNode`时无法确定该节点的`value` 只能给予默认值`true`
            // 当然这里也可以交予插件化本身做`Normalize`来解决这个问题
            setUnWrapNodesExactly(editor, {
              wrapKey: key,
              pairKey: pairKey,
              wrapNode: node,
              pairPath: location,
            });
          }
        });
      }
    }
  }

  private normalizePairNode(editor: Editor, entry: NodeEntry) {
    const [node, path] = entry;
    // 如果不是块级元素则返回 会继续处理默认的`Normalize`
    if (!isBlock(editor, node)) return void 0;
    for (const key of Object.keys(node)) {
      // --- 当前节点如果是`Pair Node`的`Normalize` ---
      if (this.pair.has(key)) {
        const wrapKey = this.pair.get(key) as string;
        const ancestor = Editor.parent(editor, path);
        const parent = ancestor && ancestor[0];
        // 父节点上一定需要存在`Wrap Node`
        // 否则在当前节点上删除`Pair Key`
        if (!parent || !isBlock(editor, parent) || !parent[wrapKey]) {
          if (process.env.NODE_ENV === "development") {
            console.log("NormalizePairNode: ", path, `${wrapKey}<-${key}`);
          }
          setUnBlockNode(editor, [key], { node });
        }
      }
    }
  }
}
