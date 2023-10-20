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
import { calcNextOrderListLevels, calcOrderListLevels } from "./utils/calculate";
import { assertValue } from "src/utils/common";
import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "./types";

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
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: ORDERED_LIST_KEY });
        const itemMatch = getBlockNode(editor, { key: ORDERED_LIST_ITEM_KEY });
        setWrapStructure(editor, wrapMatch, itemMatch, ORDERED_LIST_ITEM_KEY);
        if (
          !itemMatch ||
          !wrapMatch ||
          !isWrappedAdjoinNode(editor, { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
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
