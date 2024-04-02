import "./index.scss";

import type { EditorSchema } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import type { EditorSuite } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";

import { DocMenu } from "./components/doc-menu";
import { DOC_TOOLBAR_KEY } from "./types";

export const DocToolBarPlugin = (
  editor: EditorSuite,
  readonly: boolean,
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
        <DocMenu editor={editor} element={context.element} schema={schema}>
          {context.children}
        </DocMenu>
      );
    },
  };
};
