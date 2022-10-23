import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/define/interface";
import { existKey } from "../../core/ops/get";
import { Transforms } from "slate";
import { useFocused, useSelected } from "slate-react";
import { cs } from "src/utils/classnames";

declare module "slate" {
  interface BlockElement {
    "dividing-line"?: boolean;
  }
}

export const dividingLineKey = "dividing-line";

const DividingLine: React.FC = () => {
  const selected = useSelected();
  const focused = useFocused();
  return <div className={cs("dividing-line", focused && selected && "selected")}></div>;
};
export const DividingLinePlugin = (): Plugin => {
  return {
    key: dividingLineKey,
    isVoid: true,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: (editor, key) => {
      Transforms.insertNodes(editor, { [key]: true, children: [{ text: "" }] });
      Transforms.insertNodes(editor, { children: [{ text: "" }] });
    },
    match: props => existKey(props.element, dividingLineKey),
    render: () => <DividingLine></DividingLine>,
  };
};
