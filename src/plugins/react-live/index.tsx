import "./index.scss";
import { CommandFn } from "../../core/command";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { isBlock } from "../../core/ops/is";
import { setWrapNodes } from "../../core/ops/set";
import { Editor, Range, Transforms } from "slate";

import { codeTokenize, collectReactLiveText } from "./utils/parse";
import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY, REACT_LIVE_TYPE } from "./types";
import { ReactLiveView } from "./components/viewer";

export const ReactLivePlugin = (editor: Editor): Plugin => {
  const reactLiveCommand: CommandFn = editor => {
    Transforms.insertNodes(editor, {
      children: [{ text: "<Button type='primary'>Primary</Button>" }],
    });
    setWrapNodes(editor, { [REACT_LIVE_KEY]: true }, { [REACT_LIVE_ITEM_KEY]: true });
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
