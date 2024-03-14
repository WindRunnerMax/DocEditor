import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "doc-editor-core";
import type { Editor } from "doc-editor-delta";
import { isObject } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import {
  isCollapsed,
  isFocusLineStart,
  isMatchedAttributeNode,
  isMatchedEvent,
  isWrappedAdjoinNode,
  isWrappedEdgeNode,
  isWrappedNode,
} from "doc-editor-utils";
import { setUnWrapNodes, setWrapNodes, setWrapStructure } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";

import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "./types";

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
