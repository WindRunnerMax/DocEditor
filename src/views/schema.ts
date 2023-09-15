import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY } from "src/plugins/react-live/utils/types";
import { SlateSchema } from "src/core/schema";
import { CODE_BLOCK_ITEM_KEY, CODE_BLOCK_KEY } from "src/plugins/codeblock";
import { DIVIDING_LINE_KEY } from "src/plugins/dividing-line";
import { FLOW_CHART_KEY } from "src/plugins/flow-chart";
import { HIGHLIGHT_BLOCK_ITEM_KEY, HIGHLIGHT_BLOCK_KEY } from "src/plugins/highlight-block";
import { IMAGE_KEY } from "src/plugins/image";
import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "src/plugins/ordered-list";
import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "src/plugins/quote-block";
import { UNORDERED_LIST_ITEM_KEY, UNORDERED_LIST_KEY } from "src/plugins/unordered-list";

export const schema: SlateSchema = {
  [IMAGE_KEY]: {
    void: true,
  },
  [DIVIDING_LINE_KEY]: {
    void: true,
  },
  [FLOW_CHART_KEY]: {
    void: true,
  },
  [QUOTE_BLOCK_ITEM_KEY]: {
    wrap: QUOTE_BLOCK_KEY,
  },
  [HIGHLIGHT_BLOCK_ITEM_KEY]: {
    wrap: HIGHLIGHT_BLOCK_KEY,
  },
  [ORDERED_LIST_ITEM_KEY]: {
    wrap: ORDERED_LIST_KEY,
  },
  [UNORDERED_LIST_ITEM_KEY]: {
    wrap: UNORDERED_LIST_KEY,
  },
  [CODE_BLOCK_ITEM_KEY]: {
    wrap: CODE_BLOCK_KEY,
  },
  [REACT_LIVE_ITEM_KEY]: {
    wrap: REACT_LIVE_KEY,
  },
};
