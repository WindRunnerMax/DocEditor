import "./index.scss";

import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { Transforms } from "doc-editor-delta";
import { useFocused, useSelected } from "doc-editor-delta";
import { existKey } from "doc-editor-utils";
import { cs } from "doc-editor-utils";

import { DIVIDING_LINE_KEY } from "./types";

const DividingLine: React.FC = () => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div className="dividing-line-container">
      <div className={cs("dividing-line", focused && selected && "selected")}></div>
    </div>
  );
};
export const DividingLinePlugin = (): Plugin => {
  return {
    key: DIVIDING_LINE_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: (editor, key) => {
      Transforms.insertNodes(editor, { [key]: true, children: [{ text: "" }] });
      Transforms.insertNodes(editor, { children: [{ text: "" }] });
    },
    match: props => existKey(props.element, DIVIDING_LINE_KEY),
    render: () => <DividingLine></DividingLine>,
  };
};
