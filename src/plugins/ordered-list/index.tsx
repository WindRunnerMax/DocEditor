import "./index.scss";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT, Plugin } from "../../core/plugin/interface";
import { CommandFn } from "../../core/command";
import { Editor, Transforms } from "slate";
import { isObject } from "src/utils/is";
import { KEYBOARD } from "../../utils/constant";
import {
  isMatchedEvent,
  isCollapsed,
  isMatchedAttributeNode,
  isFocusLineStart,
  isWrappedEdgeNode,
  isWrappedAdjoinNode,
} from "../../core/ops/is";
import { getBlockNode, existKey } from "../../core/ops/get";
import { setBlockNode, setUnWrapNodes, setWrapNodes, setWrapStructure } from "../../core/ops/set";
import { calcNextOrderListLevels, calcOrderListLevels } from "./utils";
import { assertValue } from "src/utils/common";

declare module "slate" {
  interface BlockElement {
    "ordered-list"?: boolean;
    "ordered-list-item"?: OrderListItemConfig;
  }
}

export type OrderListItemConfig = {
  start: number;
  level: number;
};

export const orderedListKey = "ordered-list";
export const orderedListItemKey = "ordered-list-item";
const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, orderedListKey, true, data.path)) {
      setWrapNodes(
        editor,
        { [orderedListKey]: true },
        { [orderedListItemKey]: { start: 1, level: 1 } }
      );
    } else {
      setUnWrapNodes(editor, {
        wrapKey: orderedListKey,
        itemKey: orderedListItemKey,
      });
      calcNextOrderListLevels(editor);
    }
  }
};
export const OrderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: orderedListKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, orderedListKey) || existKey(props.element, orderedListItemKey),
    renderLine: context => {
      if (existKey(context.element, orderedListKey)) {
        return <ol className="doc-ordered-list">{context.children}</ol>;
      } else {
        const config = assertValue(context.element[orderedListItemKey]);
        return (
          <li className={`doc-ordered-item ordered-li-${config.level}`} value={config.start}>
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
        const wrapMatch = getBlockNode(editor, { key: orderedListKey });
        const itemMatch = getBlockNode(editor, { key: orderedListItemKey });
        setWrapStructure(editor, wrapMatch, itemMatch, orderedListItemKey);
        if (
          !itemMatch ||
          !wrapMatch ||
          !isWrappedAdjoinNode(editor, { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
          return void 0;
        }
        const { level, start } = assertValue(itemMatch.block[orderedListItemKey]);

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(
              editor,
              { [orderedListItemKey]: { start, level: level + 1 } },
              { node: itemMatch.block }
            );
          }
          calcOrderListLevels(editor);
          event.preventDefault();
          return KEY_EVENT.STOP;
        }

        if (isFocusLineStart(editor, itemMatch.path)) {
          if (level > 1) {
            setBlockNode(
              editor,
              { [orderedListItemKey]: { start, level: level - 1 } },
              { node: itemMatch.block }
            );
            calcOrderListLevels(editor);
            event.preventDefault();
            return KEY_EVENT.STOP;
          } else {
            if (!isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
              if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
                editor.deleteBackward("block");
                calcOrderListLevels(editor);
                event.preventDefault();
                return KEY_EVENT.STOP;
              }
            } else {
              setUnWrapNodes(editor, { wrapKey: orderedListKey, itemKey: orderedListItemKey });
              calcNextOrderListLevels(editor);
              event.preventDefault();
              return KEY_EVENT.STOP;
            }
          }
        }

        if (event.key === KEYBOARD.ENTER) {
          Transforms.splitNodes(editor, { always: true });
          calcOrderListLevels(editor);
          event.preventDefault();
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
