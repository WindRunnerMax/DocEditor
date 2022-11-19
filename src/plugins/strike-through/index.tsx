import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    "strike-through"?: boolean;
  }
}

export const strikeThroughPluginKey = "strike-through";

export const StrikeThroughPlugin = (): Plugin => {
  return {
    key: strikeThroughPluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[strikeThroughPluginKey],
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
