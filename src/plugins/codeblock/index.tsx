import "./index.scss";
import { CommandFn } from "../../core/command";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { isBlock, isText } from "../../core/ops/is";
import { setBlockNode, setWrapNodes } from "../../core/ops/set";
import { BlockElement, Editor, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { codeTokenize, DEFAULT_LANGUAGE, getLanguage, SUPPORTED_LANGUAGES } from "./utils";
import { Select } from "@arco-design/web-react";
import { getBlockNode } from "src/core/ops/get";

declare module "slate" {
  interface BlockElement {
    [CODE_BLOCK_KEY]?: { language: string };
    [CODE_BLOCK_ITEM_KEY]?: boolean;
  }
  interface TextElement {
    [CODE_BLOCK_TYPE]?: string;
  }
}

export const CODE_BLOCK_KEY = "code-block";
export const CODE_BLOCK_TYPE = "code-block-type";
export const CODE_BLOCK_ITEM_KEY = "code-block-item";

export const CodeBlockPlugin = (editor: Editor, isRender: boolean): Plugin => {
  const codeBlockCommand: CommandFn = editor => {
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
    setWrapNodes(
      editor,
      { [CODE_BLOCK_KEY]: { language: DEFAULT_LANGUAGE } },
      { [CODE_BLOCK_ITEM_KEY]: true }
    );
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
  };

  const onLanguageChange = (element: BlockElement, language: string) => {
    const path = ReactEditor.findPath(editor, element);
    setBlockNode(editor, { [CODE_BLOCK_KEY]: { language } }, { at: path, key: CODE_BLOCK_KEY });
  };

  return {
    key: CODE_BLOCK_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: codeBlockCommand,
    match: props => !!props.element[CODE_BLOCK_KEY],
    renderLine: context => {
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
              disabled={isRender}
              onChange={value => onLanguageChange(context.element, value)}
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
    },
    matchLeaf: props => !!props.leaf[CODE_BLOCK_TYPE],
    renderLeaf: context => {
      context.classList.push("token", context.element[CODE_BLOCK_TYPE] || "");
      return context.children;
    },
    decorate: entry => {
      const [node, path] = entry;
      const ranges: Range[] = [];
      if (isBlock(editor, node) && node[CODE_BLOCK_ITEM_KEY]) {
        const textNode = node.children[0];
        if (isText(textNode)) {
          const codeblockNode = getBlockNode(editor, { at: path, key: CODE_BLOCK_KEY });
          if (codeblockNode) {
            const textPath = [...path, 0];
            const str = Editor.string(editor, path);
            const language = getLanguage(codeblockNode.block);
            const codeRange = codeTokenize(str, language);
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
        }
      }
      return ranges;
    },
  };
};
