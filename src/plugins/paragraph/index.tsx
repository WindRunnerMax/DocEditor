import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Descendant, Editor } from "slate";
import { isArray } from "src/utils/is";
import { getOmitAttributes } from "src/utils/slate-get";
import { setUnTextNode } from "src/utils/slate-set";

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
