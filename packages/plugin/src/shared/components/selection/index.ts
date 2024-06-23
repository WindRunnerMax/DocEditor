import type { EditorKit } from "doc-editor-core";
import type { Path } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";

export const focusSelection = (editor: EditorKit, path?: Path, edge?: "start" | "end") => {
  ReactEditor.focus(editor.raw);
  if (path) {
    Transforms.select(editor.raw, path);
    Transforms.collapse(editor.raw, { edge: edge || "end" });
  } else {
    Transforms.collapse(editor.raw, { edge: "focus" });
  }
};
