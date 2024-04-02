import "doc-editor-plugin/styles/index";

import { useMemoizedFn } from "ahooks";
import { Editable, makeEditor } from "doc-editor-core";
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
  const editor = useMemo(() => {
    const engine = makeEditor(schema, example);
    engine.plugin.register(
      ParagraphPlugin(),
      HeadingPlugin(engine),
      BoldPlugin(),
      QuoteBlockPlugin(engine),
      HyperLinkPlugin(engine, props.readonly),
      UnderLinePlugin(),
      StrikeThroughPlugin(),
      ItalicPlugin(),
      InlineCodePlugin(),
      OrderedListPlugin(engine),
      UnorderedListPlugin(engine),
      DividingLinePlugin(),
      AlignPlugin(),
      HighlightBlockPlugin(engine, props.readonly),
      FontBasePlugin(),
      LineHeightPlugin(),
      ImagePlugin(engine, props.readonly),
      CodeBlockPlugin(engine, props.readonly),
      IndentPlugin(engine),
      FlowChartPlugin(engine, props.readonly),
      ReactLivePlugin(engine),
      DocToolBarPlugin(engine, props.readonly, schema),
      ShortCutPlugin(engine)
    );
    return engine;
  }, [props.readonly]);

  const updateText = useMemoizedFn(
    debounce((text: BaseNode[]) => {
      console.log("Text changes", text);
    }, 500)
  );

  return (
    <React.Fragment>
      <MenuToolBar readonly={props.readonly} editor={editor}></MenuToolBar>
      <Editable editor={editor} onChange={updateText} placeholder="Enter text ..."></Editable>
    </React.Fragment>
  );
};
