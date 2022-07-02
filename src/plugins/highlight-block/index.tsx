import "./index.scss";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT, Plugin } from "../../utils/slate-plugins";
import { CommandFn } from "../../utils/slate-commands";
import { Editor } from "slate";
import { isObject } from "src/utils/is";
import { KEYBOARD } from "../../utils/constant";
import {
  getBlockNode,
  isMatchedEvent,
  isCollapsed,
  setUnWrapNodes,
  setWrapNodes,
  isMatchedAttributeNode,
  isWrappedEdgeNode,
  isFocusLineStart,
  setWrapStructure,
  isWrappedAdjoinNode,
  isWrappedNode,
} from "../../utils/slate-utils";
import { assertValue } from "src/utils/common";
import { HighlightBlockWrapper, COLOR_MAP } from "./wrapper";

declare module "slate" {
  interface BlockElement {
    "highlight-block"?: { border: string; background: string };
    "highlight-block-item"?: boolean;
  }
}

export const highlightBlockKey = "highlight-block";
export const highlightBlockItemKey = "highlight-block-item";

export const HighlightBlockPlugin = (editor: Editor, isRender: boolean): Plugin => {
  const quoteCommand: CommandFn = (editor, key, data) => {
    if (isObject(data) && data.path) {
      if (!isMatchedAttributeNode(editor, highlightBlockKey, true, data.path)) {
        if (!isWrappedNode(editor)) {
          setWrapNodes(
            editor,
            {
              [highlightBlockKey]: {
                border: COLOR_MAP[0].border,
                background: COLOR_MAP[0].background,
              },
            },
            { [highlightBlockItemKey]: true }
          );
        }
      } else {
        setUnWrapNodes(editor, {
          wrapKey: highlightBlockKey,
          itemKey: highlightBlockItemKey,
        });
      }
    }
  };

  return {
    key: highlightBlockKey,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[highlightBlockKey],
    renderLine: context => {
      const config = assertValue(context.props.element[highlightBlockKey]);
      return (
        <HighlightBlockWrapper
          editor={editor}
          element={context.element}
          config={config}
          isRender={isRender}
        >
          {context.children}
        </HighlightBlockWrapper>
      );
    },
    command: quoteCommand,
    onKeyDown: event => {
      if (
        isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
        isCollapsed(editor, editor.selection)
      ) {
        const wrapMatch = getBlockNode(editor, { key: highlightBlockKey });
        const itemMatch = getBlockNode(editor, { key: highlightBlockItemKey });
        setWrapStructure(editor, wrapMatch, itemMatch, highlightBlockItemKey);
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
          setUnWrapNodes(editor, { wrapKey: highlightBlockKey, itemKey: highlightBlockItemKey });
          event.preventDefault();
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
