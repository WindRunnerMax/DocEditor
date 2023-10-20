import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { Editor } from "slate";
import { DocMenu } from "./components/doc-menu";
import { SlateCommands } from "src/core/command";
import {
  IconH1,
  IconH2,
  IconH3,
  IconOrderedList,
  IconPaste,
  IconQuote,
  IconUnorderedList,
} from "@arco-design/web-react/icon";
import get from "lodash/get";
import { isValidElement } from "react";
import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY } from "../react-live/types";
import { DOC_TOOLBAR_KEY } from "./types";
import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "../quote-block/types";
import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "../ordered-list/types";
import { UNORDERED_LIST_ITEM_KEY, UNORDERED_LIST_KEY } from "../unordered-list/types";
import { HIGHLIGHT_BLOCK_ITEM_KEY, HIGHLIGHT_BLOCK_KEY } from "../highlight-block/types";
import { DIVIDING_LINE_KEY } from "../dividing-line/types";
import { IMAGE_KEY } from "../image/types";
import { CODE_BLOCK_ITEM_KEY, CODE_BLOCK_KEY } from "../codeblock/types";
import { FLOW_CHART_KEY } from "../flow-chart/types";
import { HEADING_KEY } from "../heading/types";

const NO_DOC_TOOL_BAR = [
  QUOTE_BLOCK_KEY,
  ORDERED_LIST_KEY,
  UNORDERED_LIST_KEY,
  DIVIDING_LINE_KEY,
  HIGHLIGHT_BLOCK_KEY,
  IMAGE_KEY,
  CODE_BLOCK_KEY,
  CODE_BLOCK_ITEM_KEY,
  FLOW_CHART_KEY,
  REACT_LIVE_KEY,
  REACT_LIVE_ITEM_KEY,
];
const OFFSET_MAP: Record<string, number> = {
  [QUOTE_BLOCK_ITEM_KEY]: 12,
  [HIGHLIGHT_BLOCK_ITEM_KEY]: 8,
};
const DYNAMIC_ICON: Record<string, JSX.Element | Record<string, JSX.Element>> = {
  [`${HEADING_KEY}.type`]: {
    h1: <IconH1 />,
    h2: <IconH2 />,
    h3: <IconH3 />,
  },
  [QUOTE_BLOCK_ITEM_KEY]: <IconQuote style={{ fontSize: 13 }} />,
  [HIGHLIGHT_BLOCK_ITEM_KEY]: <IconPaste />,
  [ORDERED_LIST_ITEM_KEY]: <IconOrderedList />,
  [UNORDERED_LIST_ITEM_KEY]: <IconUnorderedList />,
};
export const DocToolBarPlugin = (
  editor: Editor,
  readonly: boolean,
  commands: SlateCommands
): Plugin => {
  return {
    key: DOC_TOOLBAR_KEY,
    priority: 13,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: () => true,
    renderLine: context => {
      if (readonly) return context.children;
      for (const item of NO_DOC_TOOL_BAR) {
        if (context.element[item]) return context.children;
      }
      let icon;
      let offset = 0;
      const attrs = Object.keys(context.element);
      for (const key of attrs) {
        if (OFFSET_MAP[key]) {
          offset = OFFSET_MAP[key] || 0;
          break;
        }
      }
      for (const key of Object.keys(DYNAMIC_ICON)) {
        const value = get(context.element, key) as string | undefined;
        if (value) {
          const iconConfig = DYNAMIC_ICON[key];
          if (isValidElement(iconConfig)) {
            icon = iconConfig as JSX.Element;
          } else {
            icon = (iconConfig as Record<string, JSX.Element>)[value];
          }
          break;
        }
      }

      return (
        <DocMenu
          editor={editor}
          commands={commands}
          element={context.element}
          offset={offset}
          icon={icon}
        >
          {context.children}
        </DocMenu>
      );
    },
  };
};
