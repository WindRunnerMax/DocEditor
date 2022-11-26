import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { existKey } from "../../core/ops/get";
import { Transforms } from "slate";
import { useFocused, useSelected } from "slate-react";
import { cs } from "src/utils/classnames";

declare module "slate" {
  interface BlockElement {
    [DIVIDING_LINE_KEY]?: boolean;
  }
}

export const DIVIDING_LINE_KEY = "dividing-line";

const DividingLine: React.FC = () => {
  const selected = useSelected();
  const focused = useFocused();
  return <div className={cs("dividing-line", focused && selected && "selected")}></div>;
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
