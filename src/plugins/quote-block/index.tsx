import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/create-plugins";
import { CommandFn } from "../../utils/commands";
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
  isWrappedNode,
  isWrappedEdgeNode,
  isFocusLineStart,
} from "../../utils/slate-utils";

export const quoteBlockKey = "quote-block";
export const quoteBlockItemKey = "quote-block-item";
const quoteCommand: CommandFn = (editor, key, data) => {
  if (isObject(data) && data.path) {
    if (!isMatchedAttributeNode(editor, quoteBlockKey, true, data.path)) {
      if (!isWrappedNode(editor)) {
        setWrapNodes(editor, { [key]: true }, data.path);
        setBlockNode(editor, { [quoteBlockItemKey]: true });
      }
    } else {
      setUnWrapNodes(editor, quoteBlockKey);
      setBlockNode(editor, getOmitAttributes([quoteBlockItemKey, quoteBlockKey]));
    }
  }
};
export const QuoteBlockPlugin = (editor: Editor): Plugin => {
  return {
    key: quoteBlockKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[quoteBlockKey],
    renderLine: context => (
      <blockquote className="slate-quote-block">{context.children}</blockquote>
    ),
    command: quoteCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const quoteMatch = getBlockNode(editor, editor.selection, quoteBlockKey);
        const quoteItemMatch = getBlockNode(editor, editor.selection, quoteBlockItemKey);
        if (quoteMatch && !quoteItemMatch) setUnWrapNodes(editor, quoteBlockKey);
        if (!quoteMatch && quoteItemMatch) {
          setBlockNode(editor, getOmitAttributes([quoteBlockItemKey]));
        }
        if (!quoteMatch || !quoteItemMatch) return void 0;

        if (isFocusLineStart(editor, quoteItemMatch.path)) {
          if (
            !isWrappedEdgeNode(editor, editor.selection, quoteBlockKey, quoteBlockItemKey, "or")
          ) {
            if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
              editor.deleteBackward("block");
              event.preventDefault();
            }
          } else {
            setUnWrapNodes(editor, quoteBlockKey);
            setBlockNode(editor, getOmitAttributes([quoteBlockItemKey, quoteBlockKey]));
            event.preventDefault();
          }
        }
      }
    },
  };
};
