import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";
import { BOLD_KEY } from "./types";

export const BoldPlugin = (): Plugin => {
  return {
    key: BOLD_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[BOLD_KEY],
    command: (editor, key, data) => {
      const marks = data.marks;
      if (marks && marks[key]) {
        setUnTextNode(editor, [key]);
      } else {
        setTextNode(editor, { [key]: true });
      }
    },
    render: context => <strong>{context.children}</strong>,
  };
};
