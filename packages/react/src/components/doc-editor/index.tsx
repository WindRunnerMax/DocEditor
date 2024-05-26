import "doc-editor-plugin/styles/index";

import { useMemoizedFn } from "ahooks";
import { Editable, EDITOR_EVENT, useMakeEditor } from "doc-editor-core";
import { LOG_LEVEL } from "doc-editor-core";
import { Editor, Transforms } from "doc-editor-delta";
import {
  AlignPlugin,
  BoldPlugin,
  CodeBlockPlugin,
  DividingLinePlugin,
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
  UnderLinePlugin,
  UnorderedListPlugin,
} from "doc-editor-plugin";
import debounce from "lodash-es/debounce";
import type { FC } from "react";
import React, { useEffect, useMemo } from "react";

import { schema } from "../../config/schema";
import { example } from "./data-source";

export const SlateDocEditor: FC<{
  readonly: boolean;
}> = props => {
  const editor = useMakeEditor(schema, example);

  useMemo(() => {
    // @ts-expect-error example debug
    window.editor = editor;
    // @ts-expect-error example debug
    window.Transformers = Transforms;
    // @ts-expect-error example debug
    window.Editor = Editor;
    editor.logger.set(LOG_LEVEL.DEBUG);
    editor.plugin.register(
      new ParagraphPlugin(),
      new HeadingPlugin(editor),
      new BoldPlugin(),
      new QuoteBlockPlugin(editor),
      new HyperLinkPlugin(editor, props.readonly),
      new UnderLinePlugin(),
      new StrikeThroughPlugin(),
      new ItalicPlugin(),
      new InlineCodePlugin(),
      new OrderedListPlugin(editor),
      new UnorderedListPlugin(editor),
      new DividingLinePlugin(),
      new AlignPlugin(),
      new HighlightBlockPlugin(editor, props.readonly),
      new FontBasePlugin(),
      new LineHeightPlugin(),
      new ImagePlugin(editor, props.readonly),
      new CodeBlockPlugin(editor, props.readonly),
      new IndentPlugin(editor),
      new FlowChartPlugin(editor, props.readonly),
      new ReactLivePlugin(editor),
      new DocToolBarPlugin(editor, props.readonly),
      new ShortCutPlugin(editor)
    );
  }, [editor, props.readonly]);

  const updateText = useMemoizedFn(
    debounce(() => {
      console.log("Text changes", editor.children);
    }, 500)
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
    </React.Fragment>
  );
};
