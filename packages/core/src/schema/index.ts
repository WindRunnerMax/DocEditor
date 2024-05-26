import type { BaseNode, NodeEntry, Path } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { isBlock, setBlockNode, setUnBlockNode } from "doc-editor-utils";

import type { EditorSuite } from "../editor/types";
import type { EditorSchema } from "./types";

export class Schema {
  private wrap: Map<string, string> = new Map();
  private pair: Map<string, string> = new Map();
  private void: Set<string> = new Set<string>();
  private block: Set<string> = new Set<string>();
  public readonly raw: EditorSchema;

  constructor(schema: EditorSchema) {
    this.raw = schema;
    for (const [key, value] of Object.entries(schema)) {
      if (value.void) {
        this.void.add(key);
        this.block.add(key);
      }
      if (value.block) {
        this.block.add(key);
      }
      if (value.wrap) {
        this.block.add(value.wrap);
        this.wrap.set(value.wrap, key);
        this.pair.set(key, value.wrap);
      }
    }
  }

  private normalizeNode(editor: Editor, entry: NodeEntry) {
    const [node, path] = entry;
    // 如果不是块级元素则返回 会继续处理默认的`Normalize`
    if (!isBlock(editor, node)) return void 0;
    // 对块级节点的属性值进行处理
    for (const key of Object.keys(node)) {
      // --- 当前节点是`Wrap Node`的`Normalize` ---
      if (this.wrap.has(key)) {
        const pairKey = this.wrap.get(key) as string;
        // 子节点上一定需要存在`Pair Key`
        // 否则需要在子节点加入`Pair Key`
        const children = node.children || [];
        children.forEach((child, index) => {
          if (isBlock(editor, child) && !child[pairKey]) {
            const location: Path = [...path, index];
            if (process.env.NODE_ENV === "development") {
              console.log("NormalizeWrapNode: ", location, `${key}->${pairKey}`);
            }
            setBlockNode(editor, { [pairKey]: true }, { node: child });
          }
        });
      }
      // --- --- ---

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
      // --- --- ---
    }
  }

  public with(editor: Editor): EditorSuite {
    const { isVoid, normalizeNode } = editor;

    editor.isVoid = element => {
      for (const key of Object.keys(element)) {
        if (this.void.has(key)) return true;
      }
      return isVoid(element);
    };

    editor.normalizeNode = entry => {
      const [node] = entry;
      if (!isBlock(editor, node)) {
        normalizeNode(entry);
        return void 0;
      }
      try {
        Editor.withoutNormalizing(editor, () => {
          this.normalizeNode(editor, entry);
        });
      } catch (error) {
        console.error("Normalize Error: ", error);
      }
      normalizeNode(entry);
    };

    return editor as EditorSuite;
  }

  /**
   * `Schema`所属块节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`utils`的`isBlockNode`区分
   */
  public isBlockNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.block.has(key));
  }

  /**
   * `Schema`所属包装节点
   * @param node BaseNode
   * @returns boolean
   */
  public isWrapNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.wrap.has(key));
  }

  /**
   * `Schema`所属配对子节点
   * @param node BaseNode
   * @returns boolean
   */
  public isPairNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.pair.has(key));
  }

  /**
   * `Schema`所属块级空节点
   * @param node BaseNode
   * @returns boolean
   */
  public isVoidNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.void.has(key));
  }
}
