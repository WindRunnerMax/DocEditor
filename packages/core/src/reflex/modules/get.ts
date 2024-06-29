import type { BlockNodeTuple, Location, NodeTuple } from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { getNodeTupleByDepth } from "doc-editor-utils";

import { Is } from "./is";

export class Get extends Is {
  /**
   * 获取指定深度的`Node`元组
   * @param at Location
   * @param depth >= 0
   * @returns NodeTuple | null
   */
  public getNodeTuple(at: Location, depth: 0): NodeTuple | null;
  public getNodeTuple(at: Location, depth: number): BlockNodeTuple | null;
  public getNodeTuple(at: Location, depth: number = 0) {
    try {
      if (depth === 0) {
        const target = Editor.node(this.raw, at);
        if (target && target[0]) {
          return { node: target[0], path: target[1] };
        }
        return null;
      }
      return getNodeTupleByDepth(this.raw, at, depth);
    } catch (error) {
      this.editor.logger.error("GetNodeTuple Error", error);
      return null;
    }
  }

  /**
   * 获取最近的块级节点元组
   * @param at Location
   * @returns BlockNodeTuple | null
   */
  public getClosestBlockTuple(at: Location): BlockNodeTuple | null {
    const path = [...Editor.path(this.raw, at)];
    while (path.length) {
      const tuple = this.getNodeTuple(path, 0);
      if (!tuple) return null;
      // NOTE: 理论上目标需要操作的节点不会是`Instance`节点
      if (this.isInstanceNode(tuple.node)) return null;
      if (tuple && this.isBlock(tuple.node)) {
        return tuple as BlockNodeTuple;
      }
      path.pop();
    }
    return null;
  }

  /**
   * 获取最近的符合条件的块级节点元组
   * @description 用于检查当前`Path`到`Instance`的匹配节点
   * @param key string
   * @param at? Location
   * @returns BlockNodeTuple | null
   */
  public getClosestMatchBlockTuple(key: string, at?: Location): BlockNodeTuple | null {
    const location = at || this.raw.selection;
    if (!location) return null;
    const path = [...Editor.path(this.raw, location)];
    while (path.length) {
      const tuple = Editor.node(this.raw, path);
      if (!tuple) return null;
      const [node, tuplePath] = tuple;
      if (this.isInstanceNode(node)) return null;
      if (Editor.isBlock(this.raw, node) && node[key]) {
        return { node, path: tuplePath };
      }
      path.pop();
    }
    return null;
  }
}
