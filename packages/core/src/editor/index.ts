import type { Editor } from "doc-editor-delta";
import type { ReactEditor } from "doc-editor-delta";
import { createEditor } from "doc-editor-delta";
import { withHistory } from "doc-editor-delta";
import { withReact } from "doc-editor-delta";

import type { EditorSchema } from "../schema";
import { withSchema } from "../schema";
import type { EditorSuite } from "./types";

export function makeEditor(schema: EditorSchema) {
  const editor = withHistory(withReact(createEditor() as Editor & ReactEditor));
  // `editor.apply`可以处理`Op&Selection Change` 重新分发事件
  return withSchema(schema, editor) as EditorSuite;
}

/**
 * 1. 完整封装组件 通过`Editor`重新分发事件
 * 2. 重新设计数据结构 避免大量层级嵌套 扁平化数据结构
 * 3. 增加状态管理 `Blocks`级数据结构管理
 */
