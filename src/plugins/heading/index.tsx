import "./index.scss";
import { Editor, Transforms } from "slate";
import { CommandFn } from "../../utils/slate-commands";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { v4 as uuid } from "uuid";
import { KEYBOARD } from "../../utils/constant";
import { isObject } from "src/utils/is";
import {
  getBlockNode,
  isFocusLineEnd,
  isFocusLineStart,
  isMatchedEvent,
  isCollapsed,
  isSlateElement,
  getBlockAttributes,
  isWrappedNode,
  isMatchedAttributeNode,
  setBlockNode,
  setUnBlockNode,
} from "../../utils/slate-utils";

export const headingPluginKey = "heading";

declare module "slate" {
  interface BlockElement {
    heading?: { id: string; type: string };
  }
}

const headingCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, `${headingPluginKey}.type`, data.extraKey)) {
      setBlockNode(
        editor,
        { [key]: { type: data.extraKey, id: uuid().slice(0, 8) } },
        { at: data.path }
      );
    } else {
      setUnBlockNode(editor, [headingPluginKey], { at: data.path });
    }
  }
};

export const HeadingPlugin = (editor: Editor): Plugin => {
  return {
    key: headingPluginKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: headingCommand,
    match: props => !!props.element[headingPluginKey],
    renderLine: context => {
      const heading = context.props.element[headingPluginKey];
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
          if (!block[headingPluginKey]) return void 0;

          if (isSlateElement(block)) {
            if (event.key === KEYBOARD.BACKSPACE && isFocusLineStart(editor, path)) {
              setUnBlockNode(editor, [headingPluginKey], { at: path });
              event.preventDefault();
            }
            if (event.key === KEYBOARD.ENTER && isFocusLineEnd(editor, path)) {
              const attributes = getBlockAttributes(block, [headingPluginKey]);
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
      }
    },
  };
};
