import "./styles/index.scss";

import type { BlockContext, CommandFn } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import type { WithStop } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getUniqueId, KEYBOARD } from "doc-editor-utils";
import { isObject } from "doc-editor-utils";
import { getBlockAttributes, getBlockNode } from "doc-editor-utils";
import {
  isBaseElement,
  isCollapsed,
  isFocusLineEnd,
  isFocusLineStart,
  isMatchedAttributeNode,
  isMatchedEvent,
  isWrappedNode,
} from "doc-editor-utils";
import { setBlockNode, setUnBlockNode } from "doc-editor-utils";
import type { KeyboardEvent } from "react";

import { H1, H2, H3, HEADING_KEY } from "./types";

export class HeadingPlugin extends BlockPlugin {
  public key: string = HEADING_KEY;

  constructor(private editor: EditorKit) {
    super();
    this.editor.event.on(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public destroy(): void {
    this.editor.event.off(EDITOR_EVENT.KEY_DOWN, this.onKeyDown);
  }

  public match(props: RenderElementProps): boolean {
    return !!props.element[HEADING_KEY];
  }

  public onCommand: CommandFn = data => {
    const key = this.key;
    const editor = this.editor;
    if (isObject(data) && data.path) {
      if (!isMatchedAttributeNode(editor.raw, `${HEADING_KEY}.type`, data.extraKey)) {
        setBlockNode(
          editor.raw,
          { [key]: { type: data.extraKey, id: getUniqueId(8) } },
          { at: data.path }
        );
      } else {
        setUnBlockNode(editor.raw, [HEADING_KEY], { at: data.path });
      }
    }
  };

  public renderLine(context: BlockContext): JSX.Element {
    const heading = context.props.element[HEADING_KEY];
    if (!heading) return context.children;
    const id = heading.id;
    switch (heading.type) {
      case H1:
        return (
          <h1 className="doc-heading" id={id}>
            {context.children}
          </h1>
        );
      case H2:
        return (
          <h2 className="doc-heading" id={id}>
            {context.children}
          </h2>
        );
      case H3:
        return (
          <h3 className="doc-heading" id={id}>
            {context.children}
          </h3>
        );
      default:
        return context.children;
    }
  }

  public onKeyDown = (event: WithStop<KeyboardEvent<HTMLDivElement>>): void => {
    const editor = this.editor;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
      isCollapsed(editor.raw, editor.raw.selection)
    ) {
      const match = getBlockNode(editor.raw);

      if (!match) return event.stop();
      const { block, path } = match;
      if (!block[HEADING_KEY]) return void 0;

      if (isBaseElement(block)) {
        if (event.key === KEYBOARD.BACKSPACE && isFocusLineStart(editor.raw, path)) {
          setUnBlockNode(editor.raw, [HEADING_KEY], { at: path });
          event.preventDefault();
        }
        if (event.key === KEYBOARD.ENTER && isFocusLineEnd(editor.raw, path)) {
          const attributes = getBlockAttributes(block, [HEADING_KEY]);
          if (isWrappedNode(editor.raw)) {
            // 在`wrap`的情况下插入节点会出现问题 先多插入一个空格再删除
            Transforms.insertNodes(
              editor.raw,
              { ...attributes, children: [{ text: " " }] },
              { at: editor.raw.selection.focus, select: false }
            );
            Transforms.move(editor.raw, { distance: 1 });
            Promise.resolve().then(() => editor.raw.deleteForward("character"));
          } else {
            Transforms.insertNodes(editor.raw, { ...attributes, children: [{ text: "" }] });
          }
          event.preventDefault();
        }
      }
      return event.stop();
    }
  };
}
