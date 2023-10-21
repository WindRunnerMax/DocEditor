import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { Editor } from "slate";
import { DocMenu } from "./components/doc-menu";
import { EditorCommands } from "src/core/command";
import { DOC_TOOLBAR_KEY } from "./types";

export const DocToolBarPlugin = (
  editor: Editor,
  readonly: boolean,
  commands: EditorCommands
): Plugin => {
  return {
    key: DOC_TOOLBAR_KEY,
    priority: 13,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: () => true,
    renderLine: context => {
      if (readonly) return context.children;
      return (
        <DocMenu editor={editor} commands={commands} element={context.element}>
          {context.children}
        </DocMenu>
      );
    },
  };
};
