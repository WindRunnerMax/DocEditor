import "doc-editor-plugin/styles/index";

import { useMemoizedFn } from "ahooks";
import { Editable, makeEditor } from "doc-editor-core";
import { LOG_LEVEL } from "doc-editor-core";
import type { BaseNode } from "doc-editor-delta";
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
import React, { useMemo } from "react";

import { schema } from "../../config/schema";
import { example } from "./data-source";

export const SlateDocEditor: FC<{
  readonly: boolean;
}> = props => {
  const editor = useMemo(() => makeEditor(schema, example), []);

  useMemo(() => {
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
    debounce((text: BaseNode[]) => {
      console.log("Text changes", text);
    }, 500)
  );

  return (
    <React.Fragment>
      <MenuToolBar readonly={props.readonly} editor={editor}></MenuToolBar>
      <Editable
        editor={editor}
        readonly={props.readonly}
        onChange={updateText}
        placeholder="Enter text ..."
      ></Editable>
    </React.Fragment>
  );
};
