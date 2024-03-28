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
