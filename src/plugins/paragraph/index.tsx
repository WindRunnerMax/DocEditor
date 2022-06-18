import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/create-plugins";

export const ParagraphPlugin = (): Plugin => {
  return {
    key: "paragraph",
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    priority: 11,
    match: () => true,
    renderLine: context => (
      <div className="doc-line" onClick={e => e.stopPropagation()}>
        {context.children}
      </div>
    ),
  };
};
