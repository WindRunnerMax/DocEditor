import "./styles/index.scss";

import type {
  BlockContext,
  CommandFn,
  CopyContext,
  EditorKit,
  PasteContext,
  Reflex,
} from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import { isHTMLElement } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { assertValue, getClosestBlockPath, RegExec } from "doc-editor-utils";

import { HighlightBlockWrapper } from "./components/wrapper";
import { COLOR_MAP, HIGHLIGHT_BLOCK_KEY, HL_DOM_TAG } from "./types";

export class HighlightBlockPlugin extends BlockPlugin {
  private reflex: Reflex;
  public key: string = HIGHLIGHT_BLOCK_KEY;

  constructor(private editor: EditorKit, private readonly: boolean) {
    super();
    this.reflex = editor.reflex;
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[HIGHLIGHT_BLOCK_KEY];
  }

  public onCommand: CommandFn = ({ path }) => {
    const editor = this.editor;
    const blockPath = path && getClosestBlockPath(editor.raw, path);
    if (!blockPath) return void 0;
    Transforms.delete(editor.raw, { at: blockPath, unit: "block" });
    Transforms.insertNodes(
      editor.raw,
      {
        [HIGHLIGHT_BLOCK_KEY]: {
          border: COLOR_MAP[0].border,
          background: COLOR_MAP[0].background,
        },
        children: [{ children: [{ text: "" }] }],
      },
      { at: blockPath, select: true }
    );
  };

  public serialize(context: CopyContext): void {
    const { node: node, html } = context;
    if (this.reflex.isBlock(node) && node[HIGHLIGHT_BLOCK_KEY]) {
      const colors = node[HIGHLIGHT_BLOCK_KEY]!;
      // 提取具体色值
      const border = colors.border || "";
      const background = colors.background || "";
      const regexp = /rgb\((.+)\)/;
      const borderVar = RegExec.exec(regexp, border);
      const backgroundVar = RegExec.exec(regexp, background);
      const style = window.getComputedStyle(document.body);
      const borderValue = style.getPropertyValue(borderVar);
      const backgroundValue = style.getPropertyValue(backgroundVar);
      // 构建 HTML 容器节点
      const container = document.createElement("div");
      container.setAttribute(HL_DOM_TAG, "true");
      container.classList.add("callout-container");
      container.style.border = `1px solid rgb(${borderValue})`;
      container.style.background = `rgb(${backgroundValue})`;
      container.setAttribute("data-emoji-id", "balloon");
      const block = document.createElement("div");
      block.classList.add("callout-block");
      // NOTE: 采用`Wrap Base Node`加原地替换的方式
      container.appendChild(block);
      block.appendChild(html);
      context.html = container;
    }
  }

  public deserialize(context: PasteContext): void {
    const { nodes, html: node } = context;
    if (isHTMLElement(node) && node.classList.contains("callout-block")) {
      const border = node.style.borderColor;
      const background = node.style.backgroundColor;
      const regexp = /rgb\((.+)\)/;
      const borderColor = border && RegExec.exec(regexp, border);
      const backgroundColor = background && RegExec.exec(regexp, background);
      if (!borderColor || !backgroundColor) return void 0;
      context.nodes = [
        {
          [HIGHLIGHT_BLOCK_KEY]: {
            border: borderColor,
            background: backgroundColor,
          },
          children: nodes,
        },
      ];
    }
  }

  public renderLine(context: BlockContext): JSX.Element {
    const config = assertValue(context.props.element[HIGHLIGHT_BLOCK_KEY]);
    return (
      <HighlightBlockWrapper
        editor={this.editor}
        element={context.element}
        config={config}
        readonly={this.readonly}
      >
        {context.children}
      </HighlightBlockWrapper>
    );
  }
}
