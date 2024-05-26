import "./index.scss";

import type { BlockContext, CommandFn } from "doc-editor-core";
import { BlockPlugin, KEY_EVENT } from "doc-editor-core";
import type { Editor, RenderElementProps } from "doc-editor-delta";
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

  constructor(private editor: Editor) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return (
      existKey(props.element, UNORDERED_LIST_KEY) ||
      existKey(props.element, UNORDERED_LIST_ITEM_KEY)
    );
  }

  public onCommand: CommandFn = (editor, key, data) => {
    if (isObject(data) && data.path) {
      if (!isMatchWrapNode(editor, UNORDERED_LIST_KEY, UNORDERED_LIST_ITEM_KEY, data.path)) {
        setWrapNodes(
          editor,
          { [UNORDERED_LIST_KEY]: true },
          { [UNORDERED_LIST_ITEM_KEY]: { level: 1 } },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor, {
          at: data.path,
          wrapKey: UNORDERED_LIST_KEY,
          itemKey: UNORDERED_LIST_ITEM_KEY,
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

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
      isCollapsed(editor, editor.selection) &&
      isMatchWrapNode(editor, UNORDERED_LIST_KEY, UNORDERED_LIST_ITEM_KEY)
    ) {
      const wrapMatch = getBlockNode(editor, { key: UNORDERED_LIST_KEY });
      const itemMatch = getBlockNode(editor, { key: UNORDERED_LIST_ITEM_KEY });
      if (!itemMatch || !wrapMatch) {
        return void 0;
      }

      const { level } = assertValue(itemMatch.block[UNORDERED_LIST_ITEM_KEY]);

      if (event.key === KEYBOARD.TAB) {
        if (level < 3) {
          setBlockNode(
            editor,
            { [UNORDERED_LIST_ITEM_KEY]: { level: level + 1 } },
            { node: itemMatch.block }
          );
        }
        event.preventDefault();
      } else if (isFocusLineStart(editor, itemMatch.path)) {
        if (level > 1) {
          setBlockNode(
            editor,
            { [UNORDERED_LIST_ITEM_KEY]: { level: level - 1 } },
            { node: itemMatch.block }
          );
          event.preventDefault();
        } else {
          if (isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
            setUnWrapNodes(editor, {
              wrapKey: UNORDERED_LIST_KEY,
              itemKey: UNORDERED_LIST_ITEM_KEY,
            });
            event.preventDefault();
          }
        }
      }
      return KEY_EVENT.STOP;
    }
  }
}
