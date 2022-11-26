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
  isWrappedEdgeNode,
  isFocusLineStart,
  isWrappedAdjoinNode,
  isWrappedNode,
} from "../../core/ops/is";
import { setWrapStructure, setWrapNodes, setUnWrapNodes } from "../../core/ops/set";
import { getBlockNode } from "../../core/ops/get";

declare module "slate" {
  interface BlockElement {
    [QUOTE_BLOCK_KEY]?: boolean;
    [QUOTE_BLOCK_ITEM_KEY]?: boolean;
  }
}

export const QUOTE_BLOCK_KEY = "quote-block";
export const QUOTE_BLOCK_ITEM_KEY = "quote-block-item";

const quoteCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, QUOTE_BLOCK_KEY, true, data.path)) {
      if (!isWrappedNode(editor)) {
        setWrapNodes(editor, { [QUOTE_BLOCK_KEY]: true }, { [QUOTE_BLOCK_ITEM_KEY]: true });
      }
    } else {
      setUnWrapNodes(editor, {
        wrapKey: QUOTE_BLOCK_KEY,
        itemKey: QUOTE_BLOCK_ITEM_KEY,
      });
    }
  }
};
export const QuoteBlockPlugin = (editor: Editor): Plugin => {
  return {
    key: QUOTE_BLOCK_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[QUOTE_BLOCK_KEY],
    renderLine: context => <blockquote className="doc-quote-block">{context.children}</blockquote>,
    command: quoteCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: QUOTE_BLOCK_KEY });
        const itemMatch = getBlockNode(editor, { key: QUOTE_BLOCK_ITEM_KEY });
        setWrapStructure(editor, wrapMatch, itemMatch, QUOTE_BLOCK_ITEM_KEY);
        if (
          !itemMatch ||
          !wrapMatch ||
          !isWrappedAdjoinNode(editor, { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
          return void 0;
        }

        if (
          isFocusLineStart(editor, itemMatch.path) &&
          isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })
        ) {
          setUnWrapNodes(editor, { wrapKey: QUOTE_BLOCK_KEY, itemKey: QUOTE_BLOCK_ITEM_KEY });
          event.preventDefault();
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
