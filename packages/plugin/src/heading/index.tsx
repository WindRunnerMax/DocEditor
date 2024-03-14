import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "doc-editor-core";
import type { Editor } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getUniqueId, KEYBOARD } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { getBlockAttributes, getBlockNode } from "doc-editor-utils";
import {
  isBaseElement,
  isCollapsed,
  isFocusLineEnd,
  isFocusLineStart,
  isMatchedAttributeNode,
  isMatchedEvent,
  isWrappedNode,
} from "doc-editor-utils";
import { setBlockNode, setUnBlockNode } from "doc-editor-utils";

import { HEADING_KEY } from "./types";

const headingCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, `${HEADING_KEY}.type`, data.extraKey)) {
      setBlockNode(
        editor,
        { [key]: { type: data.extraKey, id: getUniqueId().slice(0, 8) } },
        { at: data.path }
      );
    } else {
      setUnBlockNode(editor, [HEADING_KEY], { at: data.path });
    }
  }
};

export const HeadingPlugin = (editor: Editor): Plugin => {
  return {
    key: HEADING_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: headingCommand,
    match: props => !!props.element[HEADING_KEY],
    renderLine: context => {
      const heading = context.props.element[HEADING_KEY];
      if (!heading) return context.children;
      const id = heading.id;
      switch (heading.type) {
        case "h1":
          return (
            <h1 className="doc-heading" id={id}>
              {context.children}
            </h1>
          );
        case "h2":
          return (
            <h2 className="doc-heading" id={id}>
              {context.children}
            </h2>
          );
        case "h3":
          return (
            <h3 className="doc-heading" id={id}>
              {context.children}
            </h3>
          );
        default:
          return context.children;
      }
    },
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const match = getBlockNode(editor);

        if (match) {
          const { block, path } = match;
          if (!block[HEADING_KEY]) return void 0;

          if (isBaseElement(block)) {
            if (event.key === KEYBOARD.BACKSPACE && isFocusLineStart(editor, path)) {
              setUnBlockNode(editor, [HEADING_KEY], { at: path });
              event.preventDefault();
            }
            if (event.key === KEYBOARD.ENTER && isFocusLineEnd(editor, path)) {
              const attributes = getBlockAttributes(block, [HEADING_KEY]);
              if (isWrappedNode(editor)) {
                // 在`wrap`的情况下插入节点会出现问题 先多插入一个空格再删除
                Transforms.insertNodes(
                  editor,
                  { ...attributes, children: [{ text: " " }] },
                  { at: editor.selection.focus, select: false }
                );
                Transforms.move(editor, { distance: 1 });
                Promise.resolve().then(() => editor.deleteForward("character"));
              } else {
                Transforms.insertNodes(editor, { ...attributes, children: [{ text: "" }] });
              }
              event.preventDefault();
            }
          }
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
