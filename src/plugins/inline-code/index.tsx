import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    "inline-code"?: boolean;
  }
}

export const inlineCodePluginKey = "inline-code";

export const InlineCodePlugin = (): Plugin => {
  return {
    key: inlineCodePluginKey,
    type: EDITOR_ELEMENT_TYPE.INLINE,
    match: props => !!props.leaf[inlineCodePluginKey],
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
