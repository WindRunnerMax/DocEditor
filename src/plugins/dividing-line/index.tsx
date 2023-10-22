import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { existKey } from "../../core/ops/get";
import { Transforms } from "slate";
import { useFocused, useSelected } from "slate-react";
import { cs } from "src/utils/classnames";
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
