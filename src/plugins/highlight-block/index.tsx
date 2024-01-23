import "./index.scss";
import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "../../core/plugin/interface";
import type { CommandFn } from "../../core/command";
import type { Editor } from "slate";
import { isObject } from "src/utils/is";
import { KEYBOARD } from "../../utils/constant";
import {
  isFocusLineStart,
  isMatchedEvent,
  isCollapsed,
  isWrappedNode,
  isMatchedAttributeNode,
  isWrappedAdjoinNode,
  isWrappedEdgeNode,
} from "../../core/ops/is";
import { getBlockNode } from "../../core/ops/get";
import { setUnWrapNodes, setWrapNodes, setWrapStructure } from "../../core/ops/set";
import { assertValue } from "src/utils/common";
import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_ITEM_KEY, HIGHLIGHT_BLOCK_KEY } from "./types";

export const HighlightBlockPlugin = (editor: Editor, readonly: boolean): Plugin => {
  const quoteCommand: CommandFn = (editor, key, data) => {
    if (isObject(data) && data.path) {
      if (!isMatchedAttributeNode(editor, HIGHLIGHT_BLOCK_KEY, null, data.path)) {
        if (!isWrappedNode(editor)) {
          setWrapNodes(
            editor,
            {
              [HIGHLIGHT_BLOCK_KEY]: {
                border: COLOR_MAP[0].border,
                background: COLOR_MAP[0].background,
              },
            },
            { [HIGHLIGHT_BLOCK_ITEM_KEY]: true }
          );
        }
      } else {
        setUnWrapNodes(editor, {
          wrapKey: HIGHLIGHT_BLOCK_KEY,
          itemKey: HIGHLIGHT_BLOCK_ITEM_KEY,
        });
      }
    }
  };

  return {
    key: HIGHLIGHT_BLOCK_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: props => !!props.element[HIGHLIGHT_BLOCK_KEY],
    renderLine: context => {
      const config = assertValue(context.props.element[HIGHLIGHT_BLOCK_KEY]);
      return (
        <HighlightBlockWrapper
          editor={editor}
          element={context.element}
          config={config}
          readonly={readonly}
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
        const wrapMatch = getBlockNode(editor, { key: HIGHLIGHT_BLOCK_KEY });
        const itemMatch = getBlockNode(editor, { key: HIGHLIGHT_BLOCK_ITEM_KEY });
        setWrapStructure(editor, wrapMatch, itemMatch, HIGHLIGHT_BLOCK_ITEM_KEY);
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
          setUnWrapNodes(editor, {
            wrapKey: HIGHLIGHT_BLOCK_KEY,
            itemKey: HIGHLIGHT_BLOCK_ITEM_KEY,
          });
          event.preventDefault();
        }
        return KEY_EVENT.STOP;
      }
    },
  };
};
