import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { ITALIC_KEY } from "./types";

export const ItalicPlugin = (): Plugin => {
  return {
    key: ITALIC_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[ITALIC_KEY],
    command: (editor, key, data) => {
      const marks = data.marks;
      if (marks && marks[key]) {
        setUnTextNode(editor, [key]);
      } else {
        setTextNode(editor, { [key]: true });
      }
    },
    render: context => <em>{context.children}</em>,
  };
};
