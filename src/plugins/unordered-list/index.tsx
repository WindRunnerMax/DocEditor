import "./index.scss";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT, Plugin } from "../../core/plugin/interface";
import { CommandFn } from "../../core/command";
import { Editor } from "slate";
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
import { setBlockNode, setUnWrapNodes, setWrapNodes, setWrapStructure } from "../../core/ops/set";
import { getBlockNode, existKey } from "../../core/ops/get";
import { assertValue } from "src/utils/common";

declare module "slate" {
  interface BlockElement {
    [UNORDERED_LIST_KEY]?: boolean;
    [UNORDERED_LIST_ITEM_KEY]?: UnOrderListItemConfig;
  }
}
export type UnOrderListItemConfig = {
  level: number;
};

export const UNORDERED_LIST_KEY = "unordered-list";
export const UNORDERED_LIST_ITEM_KEY = "unordered-list-item";

const orderListCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, UNORDERED_LIST_KEY, true, data.path)) {
      setWrapNodes(
        editor,
        { [UNORDERED_LIST_KEY]: true },
        { [UNORDERED_LIST_ITEM_KEY]: { level: 1 } }
      );
    } else {
      setUnWrapNodes(editor, {
        wrapKey: UNORDERED_LIST_KEY,
        itemKey: UNORDERED_LIST_ITEM_KEY,
      });
    }
  }
};
export const UnorderedListPlugin = (editor: Editor): Plugin => {
  return {
    key: UNORDERED_LIST_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props =>
      existKey(props.element, UNORDERED_LIST_KEY) ||
      existKey(props.element, UNORDERED_LIST_ITEM_KEY),
    renderLine: context => {
      if (existKey(context.element, UNORDERED_LIST_KEY)) {
        return <ul className="doc-unordered-list">{context.children}</ul>;
      } else {
        const config = assertValue(context.element[UNORDERED_LIST_ITEM_KEY]);
        return (
          <li className={`doc-unordered-item unordered-li-${config.level}`}>{context.children}</li>
        );
      }
    },
    command: orderListCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: UNORDERED_LIST_KEY });
        const itemMatch = getBlockNode(editor, { key: UNORDERED_LIST_ITEM_KEY });
        setWrapStructure(editor, wrapMatch, itemMatch, UNORDERED_LIST_ITEM_KEY);

        if (
          !itemMatch ||
          !wrapMatch ||
          !isWrappedAdjoinNode(editor, { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
          return void 0;
        }

        const { level } = assertValue(itemMatch.block[UNORDERED_LIST_ITEM_KEY]);

        if (event.key === KEYBOARD.TAB) {
          if (level < 3) {
            setBlockNode(
              editor,
              { [UNORDERED_LIST_ITEM_KEY]: { level: level + 1 } },
              { node: itemMatch.block }
            );
          }
          event.preventDefault();
        } else if (isFocusLineStart(editor, itemMatch.path)) {
          if (level > 1) {
            setBlockNode(
              editor,
              { [UNORDERED_LIST_ITEM_KEY]: { level: level - 1 } },
              { node: itemMatch.block }
            );
            event.preventDefault();
          } else {
            if (isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
              setUnWrapNodes(editor, {
                wrapKey: UNORDERED_LIST_KEY,
                itemKey: UNORDERED_LIST_ITEM_KEY,
              });
              event.preventDefault();
            }
          }
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
