import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";
import { UNDERLINE_KEY } from "./types";

export const UnderLinePlugin = (): Plugin => {
  return {
    key: UNDERLINE_KEY,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[UNDERLINE_KEY],
    command: (editor, key, data) => {
      const marks = data.marks;
      if (marks && marks[key]) {
        setUnTextNode(editor, [key]);
      } else {
        setTextNode(editor, { [key]: true });
      }
    },
    render: context => <u>{context.children}</u>,
  };
};
