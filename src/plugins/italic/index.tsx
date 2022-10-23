import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/define/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    "italic"?: boolean;
  }
}

export const italicPluginKey = "italic";

export const ItalicPlugin = (): Plugin => {
  return {
    key: italicPluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[italicPluginKey],
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
