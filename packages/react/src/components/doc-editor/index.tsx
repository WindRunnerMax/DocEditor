import { useMemoizedFn } from "ahooks";
import { EditorPlugin, makeEditor } from "doc-editor-core";
import type { BaseNode } from "doc-editor-delta";
import { Editable, EditorProvider } from "doc-editor-delta";
import { AlignPlugin } from "doc-editor-plugin";
import { BoldPlugin } from "doc-editor-plugin";
import { CodeBlockPlugin } from "doc-editor-plugin";
import { DividingLinePlugin } from "doc-editor-plugin";
import { DocToolBarPlugin } from "doc-editor-plugin";
import { MenuToolBar } from "doc-editor-plugin";
import { FlowChartPlugin } from "doc-editor-plugin";
import { FontBasePlugin } from "doc-editor-plugin";
import { HeadingPlugin } from "doc-editor-plugin";
import { HighlightBlockPlugin } from "doc-editor-plugin";
import { HyperLinkPlugin } from "doc-editor-plugin";
import { ImagePlugin } from "doc-editor-plugin";
import { IndentPlugin } from "doc-editor-plugin";
import { InlineCodePlugin } from "doc-editor-plugin";
import { ItalicPlugin } from "doc-editor-plugin";
import { LineHeightPlugin } from "doc-editor-plugin";
import { OrderedListPlugin } from "doc-editor-plugin";
import { ParagraphPlugin } from "doc-editor-plugin";
import { QuoteBlockPlugin } from "doc-editor-plugin";
import { ReactLivePlugin } from "doc-editor-plugin";
import { ShortCutPlugin } from "doc-editor-plugin";
import { StrikeThroughPlugin } from "doc-editor-plugin";
import { UnderLinePlugin } from "doc-editor-plugin";
import { UnorderedListPlugin } from "doc-editor-plugin";
import debounce from "lodash-es/debounce";
import type { FC } from "react";
import { useMemo } from "react";

import { schema } from "../../config/schema";
import { example } from "./data-source";

export const SlateDocEditor: FC<{
  readonly: boolean;
}> = props => {
  const editor = useMemo(() => makeEditor(schema), []);
  const initText = example;

  const updateText = useMemoizedFn(
    debounce((text: BaseNode[]) => {
      console.log("Text changes", text);
    }, 500)
  );

  const { renderElement, renderLeaf, onKeyDown, commands, onCopy, decorate } = useMemo(() => {
    const register = new EditorPlugin(
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
      ReactLivePlugin(editor)
    );

    const commands = register.getCommands();
    register.add(
      DocToolBarPlugin(editor, props.readonly, commands, schema),
      ShortCutPlugin(editor, commands)
    );

    return register.apply();
  }, [editor, props.readonly]);

  return (
    <EditorProvider editor={editor} value={initText} onChange={updateText}>
      <MenuToolBar readonly={props.readonly} commands={commands} editor={editor}></MenuToolBar>
      <Editable
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={props.readonly}
        placeholder="Enter text ..."
        onKeyDown={onKeyDown}
        onCopy={e => onCopy(e, editor)}
      />
    </EditorProvider>
  );
};
