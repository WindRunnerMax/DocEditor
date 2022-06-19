import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { CommandFn } from "../../utils/slate-commands";
import { Editor } from "slate";
import { isObject } from "src/utils/is";
import { KEYBOARD } from "../../utils/constant";
import {
  getBlockNode,
  isMatchedEvent,
  isCollapsed,
  setBlockNode,
  setUnWrapNodes,
  setWrapNodes,
  getOmitAttributes,
  isMatchedAttributeNode,
  existKey,
  isFocusLineStart,
  isWrappedNode,
  isWrappedEdgeNode,
} from "../../utils/slate-utils";
import { assertValue } from "src/utils/common";

declare module "slate" {
  interface BlockElement {
    "unordered-list"?: boolean;
    "unordered-list-item"?: UnOrderListItemConfig;
  }
}

export type UnOrderListItemConfig = {
  level: number;
};
export const unorderedListKey = "unordered-list";
export const unorderedListItemKey = "unordered-list-item";
const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, unorderedListKey, true, data.path)) {
      if (!isWrappedNode(editor)) {
        setWrapNodes(editor, { [key]: true }, data.path);
        setBlockNode(editor, { [unorderedListItemKey]: { level: 1 } });
      }
    } else {
      setUnWrapNodes(editor, unorderedListKey);
      setBlockNode(editor, getOmitAttributes([unorderedListItemKey, unorderedListKey]));
    }
  }
};
export const unorderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: unorderedListKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, unorderedListKey) || existKey(props.element, unorderedListItemKey),
    renderLine: context => {
      if (existKey(context.element, unorderedListKey)) {
        return <ul className="slate-unordered-list">{context.children}</ul>;
      } else {
        const config = assertValue(context.element[unorderedListItemKey]);
        return (
          <li className={`slate-unordered-item unordered-li-${config.level}`}>
            {context.children}
          </li>
        );
      }
    },
    command: orderListCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
        isCollapsed(editor, editor.selection)
      ) {
        const orderListMatch = getBlockNode(editor, editor.selection, unorderedListKey);
        const orderListItemMatch = getBlockNode(editor, editor.selection, unorderedListItemKey);
        if (orderListMatch && !orderListItemMatch) setUnWrapNodes(editor, unorderedListKey);
        if (!orderListMatch && orderListItemMatch) {
          setBlockNode(editor, getOmitAttributes([unorderedListItemKey]));
        }
        if (!orderListItemMatch || !orderListMatch) return void 0;
        const { level } = assertValue(orderListItemMatch.block[unorderedListItemKey]);

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(editor, { [unorderedListItemKey]: { level: level + 1 } });
          }
          event.preventDefault();
        } else if (isFocusLineStart(editor, orderListItemMatch.path)) {
          if (level > 1) {
            setBlockNode(editor, { [unorderedListItemKey]: { level: level - 1 } });
            event.preventDefault();
          } else {
            if (
              !isWrappedEdgeNode(
                editor,
                editor.selection,
                unorderedListKey,
                unorderedListItemKey,
                "or"
              )
            ) {
              if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
                editor.deleteBackward("block");
                event.preventDefault();
              }
            } else {
              setUnWrapNodes(editor, unorderedListKey);
              setBlockNode(editor, getOmitAttributes([unorderedListItemKey, unorderedListKey]));
              event.preventDefault();
            }
          }
        }
      }
    },
  };
};
