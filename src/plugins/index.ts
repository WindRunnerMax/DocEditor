// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../global.d.ts" />

export * from "../core/ops";
export type { BaseNode, BlockElement, TextElement } from "../types";

export { SlatePlugins } from "../core/plugin";
export { EDITOR_ELEMENT_TYPE } from "../core/plugin/interface";
export type {
  ElementPlugin,
  LeafPlugin,
  RenderPlugins,
  Plugin as EditorPlugin,
} from "../core/plugin/interface";

export { registerCommand, execCommand } from "../core/command";
export type { CommandFn, EditorCommands } from "../core/command";

export { withSchema } from "../core/schema";
export type { EditorSchema } from "../core/schema";

export { AlignPlugin } from "./align";
export { ALIGN_KEY } from "./align/types";

export { BoldPlugin } from "./bold";
export { BOLD_KEY } from "./bold/types";

export { DividingLinePlugin } from "./dividing-line";
export { DIVIDING_LINE_KEY } from "./dividing-line/types";

export { HeadingPlugin } from "./heading";
export { HEADING_KEY } from "./heading/types";

export { HighlightBlockPlugin } from "./highlight-block";
export { HIGHLIGHT_BLOCK_KEY, HIGHLIGHT_BLOCK_ITEM_KEY } from "./highlight-block/types";

export { HyperLinkPlugin } from "./hyper-link";
export type { HyperLinkConfig } from "./hyper-link/types";
export { HYPER_LINK_KEY } from "./hyper-link/types";

export { InlineCodePlugin } from "./inline-code";
export { INLINE_CODE_KEY } from "./inline-code/types";

export { ItalicPlugin } from "./italic";
export { ITALIC_KEY } from "./italic/types";

export { OrderedListPlugin } from "./ordered-list";
export { ORDERED_LIST_KEY, ORDERED_LIST_ITEM_KEY } from "./ordered-list/types";

export { ParagraphPlugin } from "./paragraph";
export { PARAGRAPH_KEY } from "./paragraph/types";

export { QuoteBlockPlugin } from "./quote-block";
export { QUOTE_BLOCK_KEY, QUOTE_BLOCK_ITEM_KEY } from "./quote-block/types";

export { ShortCutPlugin } from "./shortcut";
export { SHORTCUT_KEY } from "./shortcut/types";

export { StrikeThroughPlugin } from "./strike-through";
export { STRIKE_THROUGH_KEY } from "./strike-through/types";

export { MenuToolBar } from "./float-toolbar";
export { FLOAT_TOOLBAR_KEY } from "./float-toolbar/types";

export { DocToolBarPlugin } from "./doc-toolbar";
export { DOC_TOOLBAR_KEY } from "./doc-toolbar/types";

export { UnderLinePlugin } from "./under-line";
export { UNDERLINE_KEY } from "./under-line/types";

export { UnorderedListPlugin } from "./unordered-list";
export type { UnOrderListItemConfig } from "./unordered-list/types";
export { UNORDERED_LIST_KEY, UNORDERED_LIST_ITEM_KEY } from "./unordered-list/types";

export { FontBasePlugin } from "./font-base";
export { FONT_BASE_KEY } from "./font-base/types";
export type { FontBaseConfig } from "./font-base/types";

export { LineHeightPlugin } from "./line-height";
export { LINE_HEIGHT_KEY } from "./line-height/types";

export { ImagePlugin } from "./image";
export { IMAGE_KEY, IMAGE_STATUS } from "./image/types";

export { CodeBlockPlugin } from "./codeblock";
export {
  CODE_BLOCK_KEY,
  CODE_BLOCK_TYPE,
  CODE_BLOCK_CONFIG,
  CODE_BLOCK_ITEM_KEY,
} from "./codeblock/types";

export { FlowChartPlugin } from "./flow-chart";
export { FLOW_CHART_KEY } from "./flow-chart/types";

export { ReactLivePlugin } from "./react-live";
export { REACT_LIVE_KEY, REACT_LIVE_ITEM_KEY } from "./react-live/types";
