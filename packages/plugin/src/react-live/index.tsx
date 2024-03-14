import "./index.scss";

import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import type { Editor, Range } from "doc-editor-delta";
import { Transforms } from "doc-editor-delta";
import { isBlock } from "doc-editor-utils";
import { setWrapNodes } from "doc-editor-utils";

import { ReactLiveView } from "./components/viewer";
import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY, REACT_LIVE_TYPE } from "./types";
import { codeTokenize, collectReactLiveText } from "./utils/parse";

export const ReactLivePlugin = (editor: Editor): Plugin => {
  const reactLiveCommand: CommandFn = editor => {
    setWrapNodes(editor, { [REACT_LIVE_KEY]: true }, { [REACT_LIVE_ITEM_KEY]: true });
    Transforms.insertText(editor, "<Button type='primary'>Primary</Button>");
  };

  return {
    key: REACT_LIVE_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command: reactLiveCommand,
    match: props => !!props.element[REACT_LIVE_KEY],
    renderLine: context => {
      if (context.element[REACT_LIVE_ITEM_KEY]) return context.children;
      return (
        <ReactLiveView element={context.element} editor={editor}>
          {context.children}
        </ReactLiveView>
      );
    },
    matchLeaf: props => !!props.leaf[REACT_LIVE_TYPE],
    renderLeaf: context => {
      context.classList.push("token", context.element[REACT_LIVE_TYPE] || "");
      return context.children;
    },
    decorate: entry => {
      const [node, path] = entry;
      if (isBlock(editor, node) && node[REACT_LIVE_ITEM_KEY]) {
        const str = collectReactLiveText(editor, node, path);
        if (!str) return [];
        const textPath = [...path, 0];
        const codeRange = codeTokenize(str);
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
    },
  };
};
