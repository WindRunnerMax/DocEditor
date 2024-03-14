import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { setTextNode, setUnTextNode } from "doc-editor-utils";

import { STRIKE_THROUGH_KEY } from "./types";

export const StrikeThroughPlugin = (): Plugin => {
  return {
    key: STRIKE_THROUGH_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[STRIKE_THROUGH_KEY],
    command: (editor, key, data) => {
      const marks = data.marks;
      if (marks && marks[key]) {
        setUnTextNode(editor, [key]);
      } else {
        setTextNode(editor, { [key]: true });
      }
    },
    render: context => <del>{context.children}</del>,
  };
};
