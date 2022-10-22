import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Editor } from "slate";
import { quoteBlockItemKey, quoteBlockKey } from "../quote-block";
import { highlightBlockItemKey, highlightBlockKey } from "../highlight-block";
import { orderedListItemKey, orderedListKey } from "../ordered-list";
import { unorderedListItemKey, unorderedListKey } from "../unordered-list";
import { imageKey } from "../image";
import { dividingLineKey } from "../dividing-line";
import { DocMenu } from "./doc-menu";
import { SlateCommands } from "src/utils/slate-commands";
import {
  IconH1,
  IconH2,
  IconH3,
  IconOrderedList,
  IconPaste,
  IconQuote,
  IconUnorderedList,
} from "@arco-design/web-react/icon";
import { headingPluginKey } from "../heading";
import get from "lodash/get";
import { isValidElement } from "react";

const NO_DOC_TOOL_BAR = [
  quoteBlockKey,
  orderedListKey,
  unorderedListKey,
  dividingLineKey,
  highlightBlockKey,
  imageKey,
];
const OFFSET_MAP: Record<string, number> = {
  [quoteBlockItemKey]: 12,
  [highlightBlockItemKey]: 8,
};
const DYNAMIC_ICON: Record<string, JSX.Element | Record<string, JSX.Element>> = {
  [`${headingPluginKey}.type`]: {
    h1: <IconH1 />,
    h2: <IconH2 />,
    h3: <IconH3 />,
  },
  [quoteBlockItemKey]: <IconQuote style={{ fontSize: 13 }} />,
  [highlightBlockItemKey]: <IconPaste />,
  [orderedListItemKey]: <IconOrderedList />,
  [unorderedListItemKey]: <IconUnorderedList />,
};
export const DocToolBarPlugin = (
  editor: Editor,
  isRender: boolean,
  commands: SlateCommands
): Plugin => {
  return {
    key: "doc-toolbar",
    priority: 13,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: () => true,
    renderLine: context => {
      if (isRender) return context.children;
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
