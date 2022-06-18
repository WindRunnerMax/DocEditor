import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/create-plugins";
import { CommandFn } from "../../utils/commands";
import { Editor, Transforms } from "slate";
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
  getBlockAttributes,
  isWrappedNode,
  isWrappedEdgeNode,
} from "../../utils/slate-utils";
import { calcNextOrderListLevels, calcOrderListLevels } from "./utils";

export type OrderListItemConfig = {
  start: number;
  level: number;
};
export const orderedListKey = "ordered-list";
export const orderedListItemKey = "ordered-list-item";
const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, orderedListKey, true, data.path)) {
      if (!isWrappedNode(editor)) {
        setWrapNodes(editor, { [key]: true }, data.path);
        setBlockNode(editor, { [orderedListItemKey]: { start: 1, level: 1 } });
      }
    } else {
      setUnWrapNodes(editor, orderedListKey);
      setBlockNode(editor, getOmitAttributes([orderedListItemKey, orderedListKey]));
      calcNextOrderListLevels(editor);
    }
  }
};
export const orderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: orderedListKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, orderedListKey) || existKey(props.element, orderedListItemKey),
    renderLine: context => {
      if (existKey(context.element, orderedListKey)) {
        return <ol className="slate-ordered-list">{context.children}</ol>;
      } else {
        const config = context.element[orderedListItemKey] as OrderListItemConfig;
        return (
          <li className={`slate-ordered-item ordered-li-${config.level}`} value={config.start}>
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
        const orderListMatch = getBlockNode(editor, editor.selection, orderedListKey);
        const orderListItemMatch = getBlockNode(editor, editor.selection, orderedListItemKey);
        if (orderListMatch && !orderListItemMatch) setUnWrapNodes(editor, orderedListKey);
        if (!orderListMatch && orderListItemMatch) {
          setBlockNode(editor, getOmitAttributes([orderedListItemKey]));
        }
        if (!orderListItemMatch || !orderListMatch) return void 0;
        const { level, start } = getBlockAttributes(orderListItemMatch.block)[
          orderedListItemKey
        ] as OrderListItemConfig;

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(editor, { [orderedListItemKey]: { start, level: level + 1 } });
          }
          calcOrderListLevels(editor);
          event.preventDefault();
          return void 0;
        }

        if (isFocusLineStart(editor, orderListItemMatch.path)) {
          if (level > 1) {
            setBlockNode(editor, { [orderedListItemKey]: { start, level: level - 1 } });
            calcOrderListLevels(editor);
            event.preventDefault();
            return void 0;
          } else {
            if (
              !isWrappedEdgeNode(editor, editor.selection, orderedListKey, orderedListItemKey, "or")
            ) {
              if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
                editor.deleteBackward("block");
                calcOrderListLevels(editor);
                event.preventDefault();
                return void 0;
              }
            } else {
              setUnWrapNodes(editor, orderedListKey);
              setBlockNode(editor, getOmitAttributes([orderedListItemKey, orderedListKey]));
              calcNextOrderListLevels(editor);
              event.preventDefault();
              return void 0;
            }
          }
        }

        if (event.key === KEYBOARD.ENTER) {
          Transforms.splitNodes(editor, { always: true });
          calcOrderListLevels(editor);
          event.preventDefault();
        }
      }
    },
  };
};
