import "./styles/index.scss";

import type { BlockContext, CommandFn, EventContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
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

  constructor(private editor: EditorKit) {
    super();
    this.editor.event.on(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public destroy(): void {
    this.editor.event.off(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public match(props: RenderElementProps): boolean {
    return (
      existKey(props.element, ORDERED_LIST_KEY) || existKey(props.element, ORDERED_LIST_ITEM_KEY)
    );
  }

  public onCommand: CommandFn = data => {
    const editor = this.editor;
    if (isObject(data) && data.path) {
      if (!editor.reflex.isMatchAboveBlockNode(ORDERED_LIST_KEY, data.path)) {
        setWrapNodes(
          editor.raw,
          { [ORDERED_LIST_KEY]: true },
          { [ORDERED_LIST_ITEM_KEY]: { start: 1, level: 1 } },
          { at: data.path }
        );
      } else {
        setUnWrapNodes(editor.raw, {
          at: data.path,
          wrapKey: ORDERED_LIST_KEY,
          pairKey: ORDERED_LIST_ITEM_KEY,
        });
        calcNextOrderListLevels(editor.raw);
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

  public onKeyDown = (event: KeyboardEvent<HTMLDivElement>, context: EventContext) => {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER, KEYBOARD.TAB) &&
      isCollapsed(editor.raw, editor.raw.selection) &&
      isMatchWrapNode(editor.raw, ORDERED_LIST_KEY, ORDERED_LIST_ITEM_KEY)
    ) {
      const wrapMatch = getBlockNode(editor.raw, { key: ORDERED_LIST_KEY });
      const itemMatch = getBlockNode(editor.raw, { key: ORDERED_LIST_ITEM_KEY });
      if (!itemMatch || !wrapMatch) {
        return void 0;
      }
      const { level, start } = assertValue(itemMatch.block[ORDERED_LIST_ITEM_KEY]);

      if (event.key === KEYBOARD.TAB) {
        if (level < 3) {
          setBlockNode(
            editor.raw,
            { [ORDERED_LIST_ITEM_KEY]: { start, level: level + 1 } },
            { node: itemMatch.block }
          );
        }
        calcOrderListLevels(editor.raw);
        event.preventDefault();
        return context.stop();
      }

      // 相当于匹配`Enter`和`Backspace`的情况下
      // 实际上需要严格匹配
      if (isFocusLineStart(editor.raw, itemMatch.path)) {
        if (level > 1) {
          setBlockNode(
            editor.raw,
            { [ORDERED_LIST_ITEM_KEY]: { start, level: level - 1 } },
            { node: itemMatch.block }
          );
          calcOrderListLevels(editor.raw);
          event.preventDefault();
          return context.stop();
        } else {
          if (!isWrappedEdgeNode(editor.raw, "or", { wrapNode: wrapMatch, itemNode: itemMatch })) {
            if (isMatchedEvent(event, KEYBOARD.BACKSPACE)) {
              editor.raw.deleteBackward("block");
              calcOrderListLevels(editor.raw);
              event.preventDefault();
              return context.stop();
            }
          } else {
            setUnWrapNodes(editor.raw, {
              wrapKey: ORDERED_LIST_KEY,
              pairKey: ORDERED_LIST_ITEM_KEY,
            });
            calcNextOrderListLevels(editor.raw);
            event.preventDefault();
            return context.stop();
          }
        }
      }

      if (event.key === KEYBOARD.ENTER) {
        Transforms.splitNodes(editor.raw, { always: true });
        calcOrderListLevels(editor.raw);
        event.preventDefault();
      }
      return context.stop();
    }
  };
}
