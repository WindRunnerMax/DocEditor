import "./index.scss";

import type { BlockContext, CommandFn } from "doc-editor-core";
import { BlockPlugin, KEY_EVENT } from "doc-editor-core";
import type { Editor, RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { assertValue, isMatchWrapNode } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { existKey, getBlockNode } from "doc-editor-utils";
import { isCollapsed, isFocusLineStart, isMatchedEvent, isWrappedEdgeNode } from "doc-editor-utils";
import { setBlockNode, setUnWrapNodes, setWrapNodes } from "doc-editor-utils";
import { KEYBOARD } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "./types";
import { calcNextOrderListLevels, calcOrderListLevels } from "./utils/serial";

export class OrderedListPlugin extends BlockPlugin {
  public key: string = ORDERED_LIST_KEY;

  constructor(private editor: Editor) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return (
      existKey(props.element, ORDERED_LIST_KEY) || existKey(props.element, ORDERED_LIST_ITEM_KEY)
    );
  }

  public onCommand?: CommandFn = (editor, key, data) => {
    if (isObject(data) && data.path) {
      if (!isMatchWrapNode(editor, ORDERED_LIST_KEY, ORDERED_LIST_ITEM_KEY, data.path)) {
        setWrapNodes(
          editor,
          { [ORDERED_LIST_KEY]: true },
          { [ORDERED_LIST_ITEM_KEY]: { start: 1, level: 1 } },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor, {
          at: data.path,
          wrapKey: ORDERED_LIST_KEY,
          itemKey: ORDERED_LIST_ITEM_KEY,
        });
        calcNextOrderListLevels(editor);
      }
    }
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (existKey(context.element, ORDERED_LIST_KEY)) {
      return <ol className="doc-ordered-list">{context.children}</ol>;
    } else {
      const config = assertValue(context.element[ORDERED_LIST_ITEM_KEY]);
      return (
        <li className={`doc-ordered-item ordered-li-${config.level}`} value={config.start}>
          {context.children}
        </li>
      );
    }
  }

  public onKeyDown(event: KeyboardEvent<HTMLDivElement>): boolean | void {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
      isCollapsed(editor, editor.selection) &&
      isMatchWrapNode(editor, ORDERED_LIST_KEY, ORDERED_LIST_ITEM_KEY)
    ) {
      const wrapMatch = getBlockNode(editor, { key: ORDERED_LIST_KEY });
      const itemMatch = getBlockNode(editor, { key: ORDERED_LIST_ITEM_KEY });
      if (!itemMatch || !wrapMatch) {
        return void 0;
      }
      const { level, start } = assertValue(itemMatch.block[ORDERED_LIST_ITEM_KEY]);

      if (event.key === KEYBOARD.TAB) {
        if (level < 3) {
          setBlockNode(
            editor,
            { [ORDERED_LIST_ITEM_KEY]: { start, level: level + 1 } },
            { node: itemMatch.block }
          );
        }
        calcOrderListLevels(editor);
        event.preventDefault();
        return KEY_EVENT.STOP;
      }

      // 相当于匹配`Enter`和`Backspace`的情况下
      // 实际上需要严格匹配
      if (isFocusLineStart(editor, itemMatch.path)) {
        if (level > 1) {
          setBlockNode(
            editor,
            { [ORDERED_LIST_ITEM_KEY]: { start, level: level - 1 } },
            { node: itemMatch.block }
          );
          calcOrderListLevels(editor);
          event.preventDefault();
          return KEY_EVENT.STOP;
        } else {
          if (!isWrappedEdgeNode(editor, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
            if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
              editor.deleteBackward("block");
              calcOrderListLevels(editor);
              event.preventDefault();
              return KEY_EVENT.STOP;
            }
          } else {
            setUnWrapNodes(editor, { wrapKey: ORDERED_LIST_KEY, itemKey: ORDERED_LIST_ITEM_KEY });
            calcNextOrderListLevels(editor);
            event.preventDefault();
            return KEY_EVENT.STOP;
          }
        }
      }

      if (event.key === KEYBOARD.ENTER) {
        Transforms.splitNodes(editor, { always: true });
        calcOrderListLevels(editor);
        event.preventDefault();
      }
      return KEY_EVENT.STOP;
    }
  }
}
