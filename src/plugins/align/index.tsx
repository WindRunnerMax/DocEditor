import "./index.scss";
import { CommandFn } from "../../utils/slate-commands";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { isObject } from "src/utils/is";
import { isMatchedAttributeNode, setBlockNode } from "../../utils/slate-utils";

export const alignKey = "align";

declare module "slate" {
  interface BlockElement {
    align?: "left" | "center" | "right" | "justify";
  }
}

const headingCommand: CommandFn = (editor, key, data) => {
  if (isObject(data)) {
    if (!isMatchedAttributeNode(editor, alignKey, data.extraKey)) {
      setBlockNode(editor, { [key]: data.extraKey });
    }
  }
};

export const AlignPlugin = (): Plugin => {
  return {
    key: alignKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: headingCommand,
    match: props => !!props.element[alignKey],
    renderLine: context => {
      const align = context.props.element[alignKey];
      if (!align || align === "left") return context.children;
      context.classList.push("align-" + align);
      return context.children;
    },
  };
};
