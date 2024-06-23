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
      if (tuple && this.isBlock(tuple.node)) {
        return tuple as BlockNodeTuple;
      }
      path.pop();
    }
    return null;
  }
}
