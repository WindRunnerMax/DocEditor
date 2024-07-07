import "./index.scss";

import type { BlockContext, CommandFn } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, KEY_EVENT } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { isMatchWrapNode, isObject } from "doc-editor-utils";
import { getBlockNode } from "doc-editor-utils";
import { isCollapsed, isFocusLineStart, isMatchedEvent, isWrappedEdgeNode } from "doc-editor-utils";
import { setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "./types";

export class QuoteBlockPlugin extends BlockPlugin {
  public key: string = QUOTE_BLOCK_KEY;

  constructor(private editor: EditorKit) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[QUOTE_BLOCK_KEY];
  }

  public onCommand: CommandFn = data => {
    const editor = this.editor;
    if (isObject(data) && data.path) {
      if (!editor.reflex.isMatchAboveBlockNode(QUOTE_BLOCK_KEY, data.path)) {
        setWrapNodes(
          editor.raw,
          { [QUOTE_BLOCK_KEY]: true },
          { [QUOTE_BLOCK_ITEM_KEY]: true },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor.raw, {
          at: data.path,
          wrapKey: QUOTE_BLOCK_KEY,
          pairKey: QUOTE_BLOCK_ITEM_KEY,
        });
      }
    }
  };

  public renderLine(context: BlockContext): JSX.Element {
    return <blockquote className="doc-quote-block">{context.children}</blockquote>;
  }

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
      isCollapsed(editor.raw, editor.raw.selection) &&
      isMatchWrapNode(editor.raw, QUOTE_BLOCK_KEY, QUOTE_BLOCK_ITEM_KEY)
    ) {
      const wrapMatch = getBlockNode(editor.raw, { key: QUOTE_BLOCK_KEY });
      const itemMatch = getBlockNode(editor.raw, { key: QUOTE_BLOCK_ITEM_KEY });
      if (!itemMatch || !wrapMatch) {
        return void 0;
      }
      if (
        isFocusLineStart(editor.raw, itemMatch.path) &&
        isWrappedEdgeNode(editor.raw, "or", { wrapNode: wrapMatch, itemNode: itemMatch })
      ) {
        setUnWrapNodes(editor.raw, { wrapKey: QUOTE_BLOCK_KEY, pairKey: QUOTE_BLOCK_ITEM_KEY });
        event.preventDefault();
      }
      return KEY_EVENT.STOP;
    }
  }
}
