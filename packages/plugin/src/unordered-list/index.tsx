import "./styles/index.scss";

import type { BlockContext, CommandFn, EventContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { assertValue, isMatchWrapNode } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { existKey, getBlockNode } from "doc-editor-utils";
import { isCollapsed, isFocusLineStart, isMatchedEvent, isWrappedEdgeNode } from "doc-editor-utils";
import { setBlockNode, setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { UNORDERED_LIST_ITEM_KEY, UNORDERED_LIST_KEY } from "./types";

export class UnorderedListPlugin extends BlockPlugin {
  public key: string = UNORDERED_LIST_KEY;

  constructor(private editor: EditorKit) {
    super();
    this.editor.event.on(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public destroy(): void {
    this.editor.event.off(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public match(props: RenderElementProps): boolean {
    return (
      existKey(props.element, UNORDERED_LIST_KEY) ||
      existKey(props.element, UNORDERED_LIST_ITEM_KEY)
    );
  }

  public onCommand: CommandFn = data => {
    const editor = this.editor;
    if (isObject(data) && data.path) {
      if (!editor.reflex.isMatchAboveBlockNode(UNORDERED_LIST_KEY, data.path)) {
        setWrapNodes(
          editor.raw,
          { [UNORDERED_LIST_KEY]: true },
          { [UNORDERED_LIST_ITEM_KEY]: { level: 1 } },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor.raw, {
          at: data.path,
          wrapKey: UNORDERED_LIST_KEY,
          pairKey: UNORDERED_LIST_ITEM_KEY,
        });
      }
    }
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (existKey(context.element, UNORDERED_LIST_KEY)) {
      return <ul className="doc-unordered-list">{context.children}</ul>;
    } else {
      const config = assertValue(context.element[UNORDERED_LIST_ITEM_KEY]);
      return (
        <li className={`doc-unordered-item unordered-li-${config.level}`}>{context.children}</li>
      );
    }
  }

  public onKeyDown = (event: KeyboardEvent<HTMLDivElement>, context: EventContext) => {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
      isCollapsed(editor.raw, editor.raw.selection) &&
      isMatchWrapNode(editor.raw, UNORDERED_LIST_KEY, UNORDERED_LIST_ITEM_KEY)
    ) {
      const wrapMatch = getBlockNode(editor.raw, { key: UNORDERED_LIST_KEY });
      const itemMatch = getBlockNode(editor.raw, { key: UNORDERED_LIST_ITEM_KEY });
      if (!itemMatch || !wrapMatch) {
        return void 0;
      }

      const { level } = assertValue(itemMatch.block[UNORDERED_LIST_ITEM_KEY]);

      if (event.key === KEYBOARD.TAB) {
        if (level < 3) {
          setBlockNode(
            editor.raw,
            { [UNORDERED_LIST_ITEM_KEY]: { level: level + 1 } },
            { node: itemMatch.block }
          );
        }
        event.preventDefault();
      } else if (isFocusLineStart(editor.raw, itemMatch.path)) {
        if (level > 1) {
          setBlockNode(
            editor.raw,
            { [UNORDERED_LIST_ITEM_KEY]: { level: level - 1 } },
            { node: itemMatch.block }
          );
          event.preventDefault();
        } else {
          if (isWrappedEdgeNode(editor.raw, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
            setUnWrapNodes(editor.raw, {
              wrapKey: UNORDERED_LIST_KEY,
              pairKey: UNORDERED_LIST_ITEM_KEY,
            });
            event.preventDefault();
          }
        }
      }
      return context.stop();
    }
  };
}
