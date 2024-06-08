import type { BaseNode } from "doc-editor-delta";
import type { Editor } from "doc-editor-delta";
import { isBlock } from "doc-editor-utils";

import type { EditorSuite } from "../editor/types";
import { Normalize } from "./normalize";
import type { EditorSchema } from "./types";

export class Schema extends Normalize {
  public readonly editor: Editor;
  public readonly raw: EditorSchema;

  constructor(schema: EditorSchema, editor: Editor) {
    super();
    this.raw = schema;
    this.editor = editor;
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
      if (value.inline) {
        this.inline.add(key);
      }
      if (value.instance) {
        this.instance.add(key);
      }
    }
  }

  public with(editor: Editor): EditorSuite {
    const { isVoid, normalizeNode, isInline } = editor;

    editor.isInline = element => {
      for (const key of Object.keys(element)) {
        if (this.inline.has(key)) return true;
      }
      return isInline(element);
    };

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
      this.normalize(editor, entry);
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

  /**
   * `Schema`所属实例节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`utils`的`isBlockNode`区分
   */
  public isInstanceNode(node: BaseNode): boolean {
    // @ts-expect-error editor node
    if (node === this.editor) return true;
    const keys = Object.keys(node);
    return keys.some(key => this.instance.has(key));
  }
}
