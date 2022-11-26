import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { setTextNode, setUnTextNode } from "../../core/ops/set";

declare module "slate" {
  interface TextElement {
    [INLINE_CODE_KEY]?: boolean;
  }
}

export const INLINE_CODE_KEY = "inline-code";

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
