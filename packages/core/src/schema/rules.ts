import type { NodeEntry, Path } from "doc-editor-delta";
import type { BlockElement } from "doc-editor-delta";
import { Editor, Transforms } from "doc-editor-delta";
import { isText, setUnWrapNodesExactly } from "doc-editor-utils";
import { isBlock, setUnBlockNode } from "doc-editor-utils";

export class NormalizeRules {
  /** Wrap - Pair */
  public readonly wrap: Map<string, string> = new Map();
  /** Pair - Wrap */
  public readonly pair: Map<string, string> = new Map();
  /** Void */
  public readonly void: Set<string> = new Set<string>();
  /** Block */
  public readonly block: Set<string> = new Set<string>();
  /** Inline */
  public readonly inline: Set<string> = new Set<string>();
  /** Instance */
  public readonly instance: Set<string> = new Set<string>();

  protected normalize(editor: Editor, entry: NodeEntry) {
    try {
      Editor.withoutNormalizing(editor, () => {
        this.normalizeEmptyEditor(editor, entry[0]);
        this.normalizeBlockNode(editor, entry);
      });
    } catch (error) {
      console.error("Normalize Error: ", error);
    }
  }

  private normalizeBlockNode(editor: Editor, entry: NodeEntry) {
    const [node, path] = entry;
    // 如果不是块级元素则返回 会继续处理默认的`Normalize`
    if (!isBlock(editor, node)) return void 0;
    this.normalizeWrapNode(editor, node, path);
    this.normalizePairNode(editor, node, path);
    this.normalizeInstanceNode(editor, node, path);
  }

  private normalizeWrapNode(editor: Editor, node: BlockElement, path: Path) {
    // 1. 子节点上一定需要存在`Pair Key` 否则需要在子节点的父节点移除`Wrap Key`
    for (const key of Object.keys(node)) {
      // --- 当前节点是`Wrap Node`的`Normalize` ---
      if (this.wrap.has(key)) {
        const pairKey = this.wrap.get(key) as string;
        const children = node.children || [];
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

  private normalizePairNode(editor: Editor, node: BlockElement, path: Path) {
    // 1. 父节点上一定需要存在`Wrap Node` 否则在当前节点上删除`Pair Key`
    for (const key of Object.keys(node)) {
      // --- 当前节点如果是`Pair Node`的`Normalize` ---
      if (this.pair.has(key)) {
        const wrapKey = this.pair.get(key) as string;
        const ancestor = Editor.parent(editor, path);
        const parent = ancestor && ancestor[0];
        if (!parent || !isBlock(editor, parent) || !parent[wrapKey]) {
          if (process.env.NODE_ENV === "development") {
            console.log("NormalizePairNode: ", path, `${wrapKey}<-${key}`);
          }
          setUnBlockNode(editor, [key], { node });
        }
      }
    }
  }

  private normalizeInstanceNode(editor: Editor, node: BlockElement, path: Path) {
    // 1. `Instance Node`必定需要存在`Block Node`而不是直属`Text Node`
    for (const key of Object.keys(node)) {
      // --- 当前节点如果是`Instance Node`的`Normalize` ---
      if (this.instance.has(key)) {
        const children = node.children || [];
        children.forEach((child, index) => {
          if (isText(child)) {
            const location: Path = [...path, index];
            if (process.env.NODE_ENV === "development") {
              console.log("NormalizeInstanceNode: ", location, key);
            }
            // 为`Child`补齐`Block Node`节点
            Transforms.wrapNodes(editor, { children: [] }, { at: location });
          }
        });
      }
    }
  }

  /**
   * 处理编辑器全部清空的特殊 Case
   * @param editor
   * @param node
   */
  protected normalizeEmptyEditor(editor: Editor, node: unknown) {
    // 1. 存在编辑器全部清空的情况 且无法触发内建的 Normalize 逻辑
    if (node === editor && editor.children.length === 0) {
      Transforms.insertNodes(editor, { children: [{ text: "" }] }, { at: [0], select: true });
    }
  }
}
