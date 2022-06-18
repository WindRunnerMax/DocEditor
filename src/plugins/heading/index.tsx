import { Editor, Transforms } from "slate";
import { CommandFn } from "../../utils/commands";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/create-plugins";
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
  getOmitAttributes,
  isWrappedNode,
  isMatchedAttributeNode,
  setBlockNode,
} from "../../utils/slate-utils";

export const headingPluginKey = "heading";

const headingCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, headingPluginKey, data.extraKey)) {
      setBlockNode(editor, { [key]: data.extraKey, id: uuid() }, data.path);
    } else {
      setBlockNode(editor, getOmitAttributes(["id", headingPluginKey]), data.path);
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
      const id = context.props.element["id"] as string;
      const heading = context.props.element[headingPluginKey];
      switch (heading) {
        case "h1":
          return <h1 id={id}>{context.children}</h1>;
        case "h2":
          return <h2 id={id}>{context.children}</h2>;
        case "h3":
          return <h3 id={id}>{context.children}</h3>;
        default:
          return context.children;
      }
    },
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const match = getBlockNode(editor, editor.selection);

        if (match) {
          const { block, path } = match;
          if (!block[headingPluginKey]) return void 0;

          if (isSlateElement(block)) {
            if (event.key === KEYBOARD.BACKSPACE && isFocusLineStart(editor, path)) {
              const properties = getOmitAttributes(["id", headingPluginKey]);
              Transforms.setNodes(editor, properties, { at: path });
              event.preventDefault();
            }
            if (event.key === KEYBOARD.ENTER && isFocusLineEnd(editor, path)) {
              const attributes = getBlockAttributes(block, ["id", headingPluginKey]);
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
