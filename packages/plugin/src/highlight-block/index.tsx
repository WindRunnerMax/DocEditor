import "./index.scss";

import type { CommandFn, EditorSuite } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE, KEY_EVENT } from "doc-editor-core";
import { assertValue, isMatchWrapNode } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import { isCollapsed, isFocusLineStart, isMatchedEvent, isWrappedEdgeNode } from "doc-editor-utils";
import { setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";

import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_ITEM_KEY, HIGHLIGHT_BLOCK_KEY } from "./types";

export const HighlightBlockPlugin = (editor: EditorSuite, readonly: boolean): Plugin => {
  const quoteCommand: CommandFn = (editor, key, data) => {
    if (isObject(data) && data.path) {
      if (!isMatchWrapNode(editor, HIGHLIGHT_BLOCK_KEY, HIGHLIGHT_BLOCK_ITEM_KEY, data.path)) {
        setWrapNodes(
          editor,
          {
            [HIGHLIGHT_BLOCK_KEY]: {
              border: COLOR_MAP[0].border,
              background: COLOR_MAP[0].background,
            },
          },
          { [HIGHLIGHT_BLOCK_ITEM_KEY]: true },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor, {
          at: data.path,
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
        isCollapsed(editor, editor.selection) &&
        isMatchWrapNode(editor, HIGHLIGHT_BLOCK_KEY, HIGHLIGHT_BLOCK_ITEM_KEY)
      ) {
        const wrapMatch = getBlockNode(editor, { key: HIGHLIGHT_BLOCK_KEY });
        const itemMatch = getBlockNode(editor, { key: HIGHLIGHT_BLOCK_ITEM_KEY });
        if (!itemMatch || !wrapMatch) {
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
