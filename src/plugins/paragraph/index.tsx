import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";

export const PARAGRAPH_KEY = "paragraph";
export const ParagraphPlugin = (): Plugin => {
  return {
    key: PARAGRAPH_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    priority: 11,
    match: () => true,
    renderLine: context => <div className="doc-line">{context.children}</div>,
  };
};
