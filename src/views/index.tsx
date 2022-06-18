import { FC, useMemo, useRef } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useMemoizedFn } from "ahooks";
import { withHistory } from "slate-history";
import { debounce } from "lodash";
import { createPlugins } from "src/utils/create-plugins";
import { ParagraphPlugin } from "src/plugins/paragraph";
import { DocToolBarPlugin } from "src/plugins/toolbar/doc-toolbar";
import { HeadingPlugin } from "src/plugins/heading";
import { BoldPlugin } from "src/plugins/bold";
import { MenuToolBar } from "src/plugins/toolbar/menu-toolbar";
import { QuoteBlockPlugin } from "src/plugins/quote-block";
import { HyperLinkPlugin } from "src/plugins/hyper-link";
import { UnderLinePlugin } from "src/plugins/under-line";
import { StrikeThroughPlugin } from "src/plugins/strike-through";
import { ItalicPlugin } from "src/plugins/italic";
import { InlineCodePlugin } from "src/plugins/inline-code";
import { ShortCutPlugin } from "src/plugins/shortcut";
import { orderedListPlugin } from "src/plugins/ordered-list";
import { unorderedListPlugin } from "src/plugins/unordered-list";
import { DividingLinePlugin } from "src/plugins/dividing-line";

const SlateDocEditor: FC<{
  isRender: boolean;
}> = props => {
  const slateRef = useRef<HTMLDivElement>(null);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const initText = [{ children: [{ text: "" }] }];

  const updateText = useMemoizedFn(
    debounce((text: Descendant[]) => {
      console.log("Text changes", text);
    }, 500)
  );

  const { renderElement, renderLeaf, onKeyDown, withVoidElements } = useMemo(
    () =>
      createPlugins(
        ParagraphPlugin(),
        DocToolBarPlugin(editor),
        HeadingPlugin(editor),
        BoldPlugin(),
        QuoteBlockPlugin(editor),
        HyperLinkPlugin(editor, props.isRender),
        UnderLinePlugin(),
        StrikeThroughPlugin(),
        ItalicPlugin(),
        InlineCodePlugin(),
        ShortCutPlugin(editor),
        orderedListPlugin(editor),
        unorderedListPlugin(editor),
        DividingLinePlugin()
      ),
    [editor, props.isRender]
  );

  const withVoidEditor = useMemo(() => withVoidElements(editor), [editor, withVoidElements]);

  return (
    <div ref={slateRef} onClick={e => e.stopPropagation()}>
      <Slate editor={withVoidEditor} value={initText} onChange={updateText}>
        <MenuToolBar slateRef={slateRef} editor={editor}></MenuToolBar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly={props.isRender}
          placeholder="Enter text ..."
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  );
};

export default SlateDocEditor;

// https://docs.slatejs.org/
// https://github.com/ianstormtaylor/slate
// https://www.slatejs.org/examples/richtext
