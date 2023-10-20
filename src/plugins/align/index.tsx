import "./index.scss";
import { CommandFn } from "../../core/command";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { isObject } from "src/utils/is";
import { isMatchedAttributeNode } from "../../core/ops/is";
import { setBlockNode } from "../../core/ops/set";
import { ALIGN_KEY } from "./types";

const headingCommand: CommandFn = (editor, key, data) => {
  if (isObject(data)) {
    if (!isMatchedAttributeNode(editor, ALIGN_KEY, data.extraKey)) {
      setBlockNode(editor, { [key]: data.extraKey });
    }
  }
};

export const AlignPlugin = (): Plugin => {
  return {
    key: ALIGN_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: headingCommand,
    match: props => !!props.element[ALIGN_KEY],
    renderLine: context => {
      const align = context.props.element[ALIGN_KEY];
      if (!align || align === "left") return context.children;
      context.classList.push("align-" + align);
      return context.children;
    },
  };
};
