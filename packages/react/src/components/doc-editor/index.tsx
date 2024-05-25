import "doc-editor-plugin/styles/index";

import { useMemoizedFn } from "ahooks";
import { Editable, EDITOR_EVENT, useMakeEditor } from "doc-editor-core";
import { LOG_LEVEL } from "doc-editor-core";
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
    editor.logger.set(LOG_LEVEL.DEBUG);
    editor.plugin.register(
      ParagraphPlugin(),
      HeadingPlugin(editor),
      BoldPlugin(),
      QuoteBlockPlugin(editor),
      HyperLinkPlugin(editor, props.readonly),
      UnderLinePlugin(),
      StrikeThroughPlugin(),
      ItalicPlugin(),
      InlineCodePlugin(),
      OrderedListPlugin(editor),
      UnorderedListPlugin(editor),
      DividingLinePlugin(),
      AlignPlugin(),
      HighlightBlockPlugin(editor, props.readonly),
      FontBasePlugin(),
      LineHeightPlugin(),
      ImagePlugin(editor, props.readonly),
      CodeBlockPlugin(editor, props.readonly),
      IndentPlugin(editor),
      FlowChartPlugin(editor, props.readonly),
      ReactLivePlugin(editor),
      DocToolBarPlugin(editor, props.readonly, schema),
      ShortCutPlugin(editor)
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
