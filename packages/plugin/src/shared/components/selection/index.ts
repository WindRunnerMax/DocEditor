import type { EditorSuite } from "doc-editor-core";
import type { Path } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";

export const focusSelection = (editor: EditorSuite, path?: Path, edge?: "start" | "end") => {
  ReactEditor.focus(editor);
  if (path) {
    Transforms.select(editor, path);
    Transforms.collapse(editor, { edge: edge || "end" });
  } else {
    Transforms.collapse(editor, { edge: "focus" });
  }
};
