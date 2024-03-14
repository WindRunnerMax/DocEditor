import "./index.scss";

import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { INLINE_CODE_KEY } from "./types";

export const InlineCodePlugin = (): Plugin => {
  return {
    key: INLINE_CODE_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[INLINE_CODE_KEY],
    command: (editor, key, data) => {
      const marks = data.marks;
      if (marks && marks[key]) {
        setUnTextNode(editor, [key]);
      } else {
        setTextNode(editor, { [key]: true });
      }
    },
    render: context => <code className="slate-inline-code">{context.children}</code>,
  };
};
