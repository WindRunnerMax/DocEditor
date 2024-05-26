import "./index.scss";

import type { BlockContext, CommandFn, LeafContext } from "doc-editor-core";
import { BlockPlugin, LeafPlugin } from "doc-editor-core";
import type {
  BaseRange,
  Editor,
  NodeEntry,
  Range,
  RenderElementProps,
  RenderLeafProps,
} from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { isBlock } from "doc-editor-utils";
import { setWrapNodes } from "doc-editor-utils";

import { ReactLiveView } from "./components/viewer";
import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY, REACT_LIVE_TYPE } from "./types";
import { codeTokenize, collectReactLiveText } from "./utils/parse";

class ReactLiveLeafPlugin extends LeafPlugin {
  public readonly key: string = REACT_LIVE_TYPE;

  public destroy(): void {}

  public match(props: RenderLeafProps): boolean {
    return !!props.leaf[REACT_LIVE_TYPE];
  }

  public render(context: LeafContext): JSX.Element {
    context.classList.push("token", context.leaf[REACT_LIVE_TYPE] || "");
    return context.children;
  }
}

export class ReactLivePlugin extends BlockPlugin {
  public key: string = REACT_LIVE_KEY;

  constructor(private editor: Editor) {
    super();
    this.WITH_LEAF_PLUGINS = [new ReactLiveLeafPlugin()];
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[REACT_LIVE_KEY];
  }

  public onCommand: CommandFn = editor => {
    setWrapNodes(editor, { [REACT_LIVE_KEY]: true }, { [REACT_LIVE_ITEM_KEY]: true });
    Transforms.insertText(editor, "<Button type='primary'>Primary</Button>");
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (context.element[REACT_LIVE_ITEM_KEY]) return context.children;
    return (
      <ReactLiveView element={context.element} editor={this.editor}>
        {context.children}
      </ReactLiveView>
    );
  }

  public onDecorate(entry: NodeEntry): BaseRange[] {
    const [node, path] = entry;
    if (isBlock(this.editor, node) && node[REACT_LIVE_ITEM_KEY]) {
      const str = collectReactLiveText(this.editor, node, path);
      if (!str) return [];
      const textPath = [...path, 0];
      const codeRange = codeTokenize(str);
      // TODO: 采取双迭代的方式 取较小值作为`range`
      const ranges: Range[] = codeRange.map(item => ({
        anchor: { path: textPath, offset: item.start },
        focus: { path: textPath, offset: item.end },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        [REACT_LIVE_TYPE]: item.type,
      }));
      return ranges;
    }
    return [];
  }
}
