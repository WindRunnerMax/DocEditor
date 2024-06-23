import type { BaseNode, Location, Node } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";

import type { EditorKit } from "../editor/";
import type { EditorRaw } from "../editor/types";

export class Reflex {
  private raw: EditorRaw;
  constructor(private editor: EditorKit) {
    this.raw = editor.raw;
  }

  /**
   * `Schema`所属块节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`utils`的`isBlockNode`区分
   */
  public isBlockNode = (node: BaseNode): boolean => {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.block.has(key));
  };

  /**
   * `Schema`所属包装节点
   * @param node BaseNode
   * @returns boolean
   */
  public isWrapNode = (node: BaseNode): boolean => {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.wrap.has(key));
  };

  /**
   * `Schema`所属配对子节点
   * @param node BaseNode
   * @returns boolean
   */
  public isPairNode = (node: BaseNode): boolean => {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.pair.has(key));
  };

  /**
   * `Schema`所属块级空节点
   * @param node BaseNode
   * @returns boolean
   */
  public isVoidNode = (node: BaseNode): boolean => {
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.void.has(key));
  };

  /**
   * `Schema`所属实例节点
   * @param node BaseNode
   * @returns boolean
   * @description 注意与`utils`的`isBlockNode`区分
   */
  public isInstanceNode = (node: Node): boolean => {
    if (node === this.raw) return true;
    const keys = Object.keys(node);
    return keys.some(key => this.editor.schema.instance.has(key));
  };

  /**
   * 检查祖先中最近的`Block`节点匹配
   * @param key string
   * @param at? Location
   * @returns boolean
   * @description 用于检查当前`Path`到`Instance`是否有节点匹配`key`值
   */
  public isMatchAboveBlockNode = (key: string, at?: Location): boolean => {
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
  };
}
