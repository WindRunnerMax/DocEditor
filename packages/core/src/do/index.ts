import type { Location } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";

import { EditorModule } from "../editor/inject";

export class Do extends EditorModule {
  /**
   * 删除指定位置的节点内容
   * @param at Location
   */
  public delete(at: Location) {
    Transforms.delete(this.raw, { at });
  }
}
