import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";

export const paragraphKey = "paragraph";
export const ParagraphPlugin = (): Plugin => {
  return {
    key: paragraphKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    priority: 11,
    match: () => true,
    renderLine: context => <div className="doc-line">{context.children}</div>,
  };
};
