import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    [UNDERLINE_KEY]?: boolean;
  }
}

export const UNDERLINE_KEY = "under-line";

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
