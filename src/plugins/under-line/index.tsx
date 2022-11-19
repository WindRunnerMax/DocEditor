import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    "under-line"?: boolean;
  }
}

export const underLinePluginKey = "under-line";

export const UnderLinePlugin = (): Plugin => {
  return {
    key: underLinePluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[underLinePluginKey],
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
