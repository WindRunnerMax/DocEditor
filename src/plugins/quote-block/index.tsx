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
    "quote-block"?: boolean;
    "quote-block-item"?: boolean;
  }
}

export const quoteBlockKey = "quote-block";
export const quoteBlockItemKey = "quote-block-item";
const quoteCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, quoteBlockKey, true, data.path)) {
      if (!isWrappedNode(editor)) {
        setWrapNodes(editor, { [quoteBlockKey]: true }, { [quoteBlockItemKey]: true });
      }
    } else {
      setUnWrapNodes(editor, {
        wrapKey: quoteBlockKey,
        itemKey: quoteBlockItemKey,
      });
    }
  }
};
export const QuoteBlockPlugin = (editor: Editor): Plugin => {
  return {
    key: quoteBlockKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[quoteBlockKey],
    renderLine: context => <blockquote className="doc-quote-block">{context.children}</blockquote>,
    command: quoteCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: quoteBlockKey });
        const itemMatch = getBlockNode(editor, { key: quoteBlockItemKey });
        setWrapStructure(editor, wrapMatch, itemMatch, quoteBlockItemKey);
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
          setUnWrapNodes(editor, { wrapKey: quoteBlockKey, itemKey: quoteBlockItemKey });
          event.preventDefault();
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
