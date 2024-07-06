import type { BaseNode, Location, Node } from "doc-editor-delta";
import type { BlockElement } from "doc-editor-delta";
import type { TextElement } from "doc-editor-delta";
import type { TextBlockElement } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { isBlock, isText, isTextBlock } from "doc-editor-utils";

import type { EditorKit } from "../../editor";
import type { EditorRaw } from "../../editor/types";

export class Is {
  protected raw: EditorRaw;
  constructor(protected editor: EditorKit) {
    this.raw = editor.raw;
  }

  /**
   * 判断节点是否为块结构
   * @param node
   * @returns boolean
   */
  public isBlock(node: BaseNode | undefined): node is BlockElement {
    if (!node) return false;
    // NOTE: 需要关注`Inline`节点不属于`Block`节点
    return isBlock(this.raw, node);
  }

  /**
   * 判断节点是否为文本结构
   * @param node BaseNode | undefined
   * @returns boolean
   */
  public isText(node: BaseNode | undefined): node is TextElement {
    if (!node) return false;
    return isText(node);
  }

  /**
   * 判断节点是否为文本块结构
   * @description 即实际要承载文本内容的块
   * @param node BaseNode | undefined
   * @returns boolean
   */
  public isTextBlock(node: BaseNode | undefined): node is TextBlockElement {
    if (!this.isBlock(node)) return false;
    return isTextBlock(this.raw, node);
  }

  /**
   * `Schema`所属块节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`isBlock`区分
   */
  public isBlockNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.block.has(key));
  }

  /**
   * `Schema`所属包装节点
   * @param node BaseNode
   * @returns boolean
   */
  public isWrapNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.wrap.has(key));
  }

  /**
   * `Schema`所属配对子节点
   * @param node BaseNode
   * @returns boolean
   */
  public isPairNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.pair.has(key));
  }

  /**
   * `Schema`所属块级空节点
   * @param node BaseNode
   * @returns boolean
   */
  public isVoidNode(node: BaseNode): boolean {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.void.has(key));
  }

  /**
   * `Schema`所属实例节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`utils`的`isBlockNode`区分
   */
  public isInstanceNode(node: Node): boolean {
    if (node === this.raw) return true;
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.instance.has(key));
  }

  /**
   * 检查祖先中最近的`Block`节点`key`值匹配
   * @description 用于检查当前`Path`到`Instance`是否有节点匹配`key`值
   * @param key string
   * @param at? Location
   * @returns boolean
   */
  public isMatchAboveBlockNode(key: string, at?: Location): boolean {
    const location = at || this.raw.selection;
    if (!location) return false;
    const path = [...Editor.path(this.raw, location)];
    while (path.length) {
      const tuple = Editor.node(this.raw, path);
      if (!tuple) return false;
      const [node] = tuple;
      if (this.isInstanceNode(node)) return false;
      if (Editor.isBlock(this.raw, node) && node[key]) {
        return true;
      }
      path.pop();
    }
    return false;
  }
}
