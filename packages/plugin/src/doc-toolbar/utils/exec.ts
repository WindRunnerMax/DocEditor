import { Editor, Transforms } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";

import type { DocToolBarState } from "../types";

export const exec = (state: DocToolBarState, key: string) => {
  const { editor, element } = state;
  const [type, data] = key.split(".");
  const path = ReactEditor.findPath(editor, element);
  ReactEditor.focus(editor);
  Editor.withoutNormalizing(editor, () => {
    if (state.status.isNextLine) {
      if (!path.length) return void 0;
      const nextPath = path.slice(0, -1);
      const lastPath = path[path.length - 1] + 1;
      nextPath.push(lastPath);
      Transforms.insertNodes(editor, { children: [{ text: "" }] }, { at: nextPath, select: true });
      Promise.resolve().then(() => {
        const selection = state.editor.selection;
        if (!selection) return void 0;
        editor.command.exec(type, {
          extraKey: data,
          path: selection.focus.path,
          element,
          origin: key,
        });
      });
    } else {
      editor.command.exec(type, { extraKey: data, path, element, origin: key });
    }
  });
};
