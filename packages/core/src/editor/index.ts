import type { Editor } from "slate";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import type { ReactEditor } from "slate-react";
import { withReact } from "slate-react";

import type { EditorSchema } from "../schema";
import { withSchema } from "../schema";
import type { EditorSuite } from "./types";

export function makeEditor(schema: EditorSchema) {
  const editor = withHistory(withReact(createEditor() as Editor & ReactEditor));
  return withSchema(schema, editor) as EditorSuite;
}
