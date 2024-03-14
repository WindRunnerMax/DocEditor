import "./index.scss";
import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE } from "../../core/plugin/interface";
import type { Editor } from "slate";
import { DocMenu } from "./components/doc-menu";
import type { EditorCommands } from "src/core/command";
import { DOC_TOOLBAR_KEY } from "./types";
import type { EditorSchema } from "src/core/schema";

export const DocToolBarPlugin = (
  editor: Editor,
  readonly: boolean,
  commands: EditorCommands,
  schema: EditorSchema
): Plugin => {
  return {
    key: DOC_TOOLBAR_KEY,
    priority: 13,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: () => true,
    renderLine: context => {
      if (readonly) return context.children;
      return (
        <DocMenu editor={editor} commands={commands} element={context.element} schema={schema}>
          {context.children}
        </DocMenu>
      );
    },
  };
};
