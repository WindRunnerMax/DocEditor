import "./index.scss";

import type { BlockContext, CommandFn, EditorSuite } from "doc-editor-core";
import { BlockPlugin, KEY_EVENT } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { assertValue, isMatchWrapNode } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import { isCollapsed, isFocusLineStart, isMatchedEvent, isWrappedEdgeNode } from "doc-editor-utils";
import { setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_ITEM_KEY, HIGHLIGHT_BLOCK_KEY } from "./types";

export class HighlightBlockPlugin extends BlockPlugin {
  public key: string = HIGHLIGHT_BLOCK_KEY;

  constructor(private editor: EditorSuite, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[HIGHLIGHT_BLOCK_KEY];
  }

  public onCommand: CommandFn = (editor, key, data) => {
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

  public renderLine(context: BlockContext): JSX.Element {
    const config = assertValue(context.props.element[HIGHLIGHT_BLOCK_KEY]);
    return (
      <HighlightBlockWrapper
        editor={this.editor}
        element={context.element}
        config={config}
        readonly={this.readonly}
      >
        {context.children}
      </HighlightBlockWrapper>
    );
  }

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    const editor = this.editor;
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
  }
}
