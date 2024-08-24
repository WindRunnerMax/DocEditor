import "./styles/index.scss";

import type { BlockContext, CommandFn, LeafContext } from "doc-editor-core";
import type { EditorKit } from "doc-editor-core";
import type { EditorRaw } from "doc-editor-core";
import { BlockPlugin, LeafPlugin } from "doc-editor-core";
import type {
  BaseRange,
  NodeEntry,
  Range,
  RenderElementProps,
  RenderLeafProps,
} from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { getClosestBlockPath, getParentNode, isBlock, isText } from "doc-editor-utils";

import { parseCodeNodeRange } from "../codeblock/utils/parser";
import { ReactLiveView } from "./components/viewer";
import { REACT_LIVE_KEY, REACT_LIVE_TYPE } from "./types";

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
  private raw: EditorRaw;

  constructor(private editor: EditorKit) {
    super();
    this.raw = editor.raw;
    this.WITH_LEAF_PLUGINS = [new ReactLiveLeafPlugin()];
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[REACT_LIVE_KEY];
  }

  public onCommand: CommandFn = ({ path }) => {
    const editor = this.editor;
    const blockPath = path && getClosestBlockPath(editor.raw, path);
    if (!blockPath) return void 0;
    // 删除当前行的块内容 等待节点的插入
    Transforms.delete(editor.raw, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor.raw,
      {
        [REACT_LIVE_KEY]: true,
        children: [
          {
            // 该层是必须的 类似于`Wrap-Pair`的关系 块内编辑的是`Pair Node`
            children: [{ text: "<Button type='primary'>Primary</Button>" }],
          },
        ],
      },
      { at: blockPath, select: true }
    );
  };

  public renderLine(context: BlockContext): JSX.Element {
    return (
      <ReactLiveView element={context.element} editor={this.editor}>
        {context.children}
      </ReactLiveView>
    );
  }

  public onDecorate(entry: NodeEntry): BaseRange[] {
    const [node, path] = entry;
    const ranges: Range[] = [];
    const parent = getParentNode(this.editor.raw, path);
    if (!isBlock(this.raw, node) || !parent || !parent.node[REACT_LIVE_KEY]) {
      return ranges;
    }
    const textNode = node.children[0];
    if (!isText(textNode)) {
      return ranges;
    }
    const language = "JavaScript";
    ranges.push(...parseCodeNodeRange(node, path, language, REACT_LIVE_TYPE));
    return ranges;
  }
}
