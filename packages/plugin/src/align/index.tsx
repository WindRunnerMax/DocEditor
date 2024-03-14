import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { isObject } from "doc-editor-utils";
import { isMatchedAttributeNode } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";

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
