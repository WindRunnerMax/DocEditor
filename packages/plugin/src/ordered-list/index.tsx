import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "doc-editor-core";
import type { Editor } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { assertValue, isMatchWrapNode } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { existKey, getBlockNode } from "doc-editor-utils";
import {
  isCollapsed,
  isFocusLineStart,
  isMatchedAttributeNode,
  isMatchedEvent,
  isWrappedEdgeNode,
} from "doc-editor-utils";
import { setBlockNode, setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";

import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "./types";
import { calcNextOrderListLevels, calcOrderListLevels } from "./utils/serial";

const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, ORDERED_LIST_KEY, true, data.path)) {
      setWrapNodes(
        editor,
        { [ORDERED_LIST_KEY]: true },
        { [ORDERED_LIST_ITEM_KEY]: { start: 1, level: 1 } }
      );
    } else {
      setUnWrapNodes(editor, {
        wrapKey: ORDERED_LIST_KEY,
        itemKey: ORDERED_LIST_ITEM_KEY,
      });
      calcNextOrderListLevels(editor);
    }
  }
};
export const OrderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: ORDERED_LIST_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, ORDERED_LIST_KEY) || existKey(props.element, ORDERED_LIST_ITEM_KEY),
    renderLine: context => {
      if (existKey(context.element, ORDERED_LIST_KEY)) {
        return <ol className="doc-ordered-list">{context.children}</ol>;
      } else {
        const config = assertValue(context.element[ORDERED_LIST_ITEM_KEY]);
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
        isCollapsed(editor, editor.selection) &&
        isMatchWrapNode(editor, ORDERED_LIST_KEY, ORDERED_LIST_ITEM_KEY)
      ) {
        const wrapMatch = getBlockNode(editor, { key: ORDERED_LIST_KEY });
        const itemMatch = getBlockNode(editor, { key: ORDERED_LIST_ITEM_KEY });
        if (!itemMatch || !wrapMatch) {
          return void 0;
        }
        const { level, start } = assertValue(itemMatch.block[ORDERED_LIST_ITEM_KEY]);

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(
              editor,
              { [ORDERED_LIST_ITEM_KEY]: { start, level: level + 1 } },
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
              { [ORDERED_LIST_ITEM_KEY]: { start, level: level - 1 } },
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
              setUnWrapNodes(editor, { wrapKey: ORDERED_LIST_KEY, itemKey: ORDERED_LIST_ITEM_KEY });
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
