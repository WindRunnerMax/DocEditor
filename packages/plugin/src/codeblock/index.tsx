import "./index.scss";

import { Select } from "@arco-design/web-react";
import type { BlockContext, CommandFn, EditorSuite, LeafContext } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type {
  BaseRange,
  BlockElement,
  NodeEntry,
  Range,
  RenderElementProps,
  RenderLeafProps,
} from "doc-editor-delta";
import { Editor } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { getBlockNode } from "doc-editor-utils";
import { isBlock, isText } from "doc-editor-utils";
import { setBlockNode, setWrapNodes } from "doc-editor-utils";

import { CODE_BLOCK_CONFIG, CODE_BLOCK_ITEM_KEY, CODE_BLOCK_KEY, CODE_BLOCK_TYPE } from "./types";
import { codeTokenize, DEFAULT_LANGUAGE, getLanguage, SUPPORTED_LANGUAGES } from "./utils/parser";

export class CodeBlockPlugin extends BlockPlugin {
  public readonly key: string = CODE_BLOCK_KEY;

  constructor(private editor: EditorSuite, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return !!props.element[CODE_BLOCK_KEY];
  }

  public onCommand: CommandFn = editor => {
    setWrapNodes(
      editor,
      { [CODE_BLOCK_CONFIG]: { language: DEFAULT_LANGUAGE }, [CODE_BLOCK_KEY]: true },
      { [CODE_BLOCK_ITEM_KEY]: true }
    );
  };

  private onLanguageChange = (element: BlockElement, language: string) => {
    const path = ReactEditor.findPath(this.editor, element);
    setBlockNode(
      this.editor,
      { [CODE_BLOCK_CONFIG]: { language } },
      { at: path, key: CODE_BLOCK_KEY }
    );
  };

  public renderLine(context: BlockContext): JSX.Element {
    if (context.element[CODE_BLOCK_ITEM_KEY]) return context.children;
    const language = getLanguage(context.element);
    return (
      <div className="code-block">
        <div contentEditable={false}>
          <Select
            size="mini"
            style={{ width: 160 }}
            showSearch
            defaultValue={language}
            disabled={this.readonly}
            onChange={value => this.onLanguageChange(context.element, value)}
          >
            {SUPPORTED_LANGUAGES.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>
        {context.children}
      </div>
    );
  }

  public matchLeaf(props: RenderLeafProps): boolean {
    return !!props.leaf[CODE_BLOCK_TYPE];
  }

  public renderLeaf(context: LeafContext): JSX.Element {
    context.classList.push("token", context.leaf[CODE_BLOCK_TYPE] || "");
    return context.children;
  }

  public onDecorate(entry: NodeEntry): BaseRange[] {
    const [node, path] = entry;
    const ranges: Range[] = [];
    if (!isBlock(this.editor, node) || !node[CODE_BLOCK_ITEM_KEY]) {
      return ranges;
    }
    const textNode = node.children[0];
    if (!isText(textNode)) {
      return ranges;
    }
    const codeblockNode = getBlockNode(this.editor, { at: path, key: CODE_BLOCK_KEY });
    if (codeblockNode) {
      const textPath = [...path, 0];
      const str = Editor.string(this.editor, path);
      const language = getLanguage(codeblockNode.block);
      const codeRange = codeTokenize(str, language);
      // TODO: 采取双迭代的方式 取较小值作为`range`
      codeRange.forEach(item => {
        ranges.push({
          anchor: { path: textPath, offset: item.start },
          focus: { path: textPath, offset: item.end },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          [CODE_BLOCK_TYPE]: item.type,
        });
      });
    }
    return ranges;
  }
}
