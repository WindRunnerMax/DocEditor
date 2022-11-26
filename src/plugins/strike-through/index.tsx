import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    [STRIKE_THROUGH_KEY]?: boolean;
  }
}

export const STRIKE_THROUGH_KEY = "strike-through";

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
