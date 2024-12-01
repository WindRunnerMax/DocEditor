import "./styles/index.scss";

import type {
  BlockContext,
  CommandFn,
  CopyContext,
  EventContext,
  PasteContext,
} from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import { BlockPlugin, EDITOR_EVENT, isHTMLElement } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import type { BlockElement } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getId, getUniqueId, KEYBOARD } from "doc-editor-utils";
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

import { applyLineMarker } from "../clipboard/utils/apply";
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
          <h3 className="doc-heading doc-heading-h3" id={id}>
            {context.children}
          </h3>
        );
      default:
        return context.children;
    }
  }

  public onKeyDown = (event: KeyboardEvent<HTMLDivElement>, context: EventContext): void => {
    const editor = this.editor;
    const selection = editor.raw.selection;
    if (
      isMatchedEvent(event, KEYBOARD.BACKSPACE, KEYBOARD.ENTER) &&
      isCollapsed(editor.raw, selection)
    ) {
      const match = getBlockNode(editor.raw);
      if (!match) return context.stop();

      const { block, path } = match;
      if (!block[HEADING_KEY] || !isBaseElement(block)) return void 0;

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
            { at: selection.focus, select: false }
          );
          Transforms.move(editor.raw, { distance: 1 });
          Promise.resolve().then(() => editor.raw.deleteForward("character"));
        } else {
          Transforms.insertNodes(editor.raw, { ...attributes, children: [{ text: "" }] });
        }
        event.preventDefault();
      }

      if (event.key === KEYBOARD.ENTER && isFocusLineStart(editor.raw, path)) {
        editor.raw.insertNode({ children: [{ text: "" }] });
        Transforms.move(editor.raw, { distance: 1 });
        event.preventDefault();
      }
      return context.stop();
    }
  };

  public serialize(context: CopyContext): void {
    const element = context.node as BlockElement;
    const heading = element[HEADING_KEY];
    if (!heading) return void 0;
    const id = heading.id;
    const type = heading.type;
    const node = document.createElement(type);
    node.id = id;
    node.setAttribute("data-type", HEADING_KEY);
    node.appendChild(context.html);
    context.html = node;
  }

  public deserialize(context: PasteContext): void {
    const { nodes, html } = context;
    if (!isHTMLElement(html)) return void 0;
    const tagName = html.tagName.toLocaleLowerCase();
    if (tagName.startsWith("h") && tagName.length === 2) {
      let level = Number(tagName.replace("h", ""));
      if (level <= 0 || level > 3) level = 3;
      context.nodes = applyLineMarker(this.editor, nodes, {
        [HEADING_KEY]: { type: `h${level}`, id: getId() },
      });
    }
  }
}
