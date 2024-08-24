import "doc-editor-plugin/styles/index";

import { Editable, EDITOR_EVENT, useMakeEditor } from "doc-editor-core";
import { LOG_LEVEL } from "doc-editor-core";
import { Editor, Transforms } from "doc-editor-delta";
import {
  AlignPlugin,
  BoldPlugin,
  ClipboardPlugin,
  CodeBlockPlugin,
  DividingLinePlugin,
  DocAnchor,
  DocToolBarPlugin,
  FlowChartPlugin,
  FontBasePlugin,
  HeadingPlugin,
  HighlightBlockPlugin,
  HyperLinkPlugin,
  ImagePlugin,
  IndentPlugin,
  InlineCodePlugin,
  ItalicPlugin,
  LineHeightPlugin,
  MenuToolBar,
  OrderedListPlugin,
  ParagraphPlugin,
  QuoteBlockPlugin,
  ReactLivePlugin,
  ShortCutPlugin,
  StrikeThroughPlugin,
  TablePlugin,
  UnderLinePlugin,
  UnorderedListPlugin,
} from "doc-editor-plugin";
import { debounce, IS_MOBILE } from "doc-editor-utils";
import type { FC } from "react";
import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import { example } from "./preset";
import { schema } from "./schema";

export const SlateDocEditor: FC<{
  readonly: boolean;
}> = props => {
  const editor = useMakeEditor(schema, { init: example });

  useMemo(() => {
    // @ts-expect-error example debug
    window.editor = editor;
    // @ts-expect-error example debug
    window.Transforms = Transforms;
    // @ts-expect-error example debug
    window.Editor = Editor;
    editor.logger.set(LOG_LEVEL.DEBUG);
    editor.plugin.register(
      new ParagraphPlugin(editor),
      new ClipboardPlugin(editor),
      new HeadingPlugin(editor),
      new BoldPlugin(editor),
      new QuoteBlockPlugin(editor),
      new HyperLinkPlugin(editor, props.readonly),
      new UnderLinePlugin(editor),
      new StrikeThroughPlugin(editor),
      new ItalicPlugin(editor),
      new InlineCodePlugin(editor),
      new OrderedListPlugin(editor),
      new UnorderedListPlugin(editor),
      new DividingLinePlugin(editor),
      new AlignPlugin(editor),
      new HighlightBlockPlugin(editor, props.readonly),
      new FontBasePlugin(editor),
      new LineHeightPlugin(editor),
      new ImagePlugin(editor, props.readonly),
      new CodeBlockPlugin(editor, props.readonly),
      new IndentPlugin(editor),
      new FlowChartPlugin(editor, props.readonly),
      new ReactLivePlugin(editor),
      new DocToolBarPlugin(editor, props.readonly),
      new ShortCutPlugin(editor),
      new TablePlugin(editor, props.readonly)
    );
  }, [editor, props.readonly]);

  const updateText = useMemo(
    () =>
      debounce(() => {
        console.log("Text changes", editor.raw.children);
      }, 500),
    [editor.raw]
  );

  useEffect(() => {
    editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, updateText);
    return () => {
      editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, updateText);
    };
  }, [editor.event, updateText]);

  return (
    <React.Fragment>
      <MenuToolBar readonly={props.readonly} editor={editor}></MenuToolBar>
      <Editable editor={editor} readonly={props.readonly} placeholder="Enter text ..."></Editable>
      {!IS_MOBILE &&
        ReactDOM.createPortal(<DocAnchor editor={editor} boundary={60}></DocAnchor>, document.body)}
    </React.Fragment>
  );
};
