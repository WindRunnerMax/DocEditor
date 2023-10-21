import { REACT_LIVE_ITEM_KEY, REACT_LIVE_KEY } from "../../src/plugins/react-live/types";
import { EditorSchema } from "../../src/core/schema";
import { IMAGE_KEY } from "../../src/plugins/image/types";
import { DIVIDING_LINE_KEY } from "../../src/plugins/dividing-line/types";
import { FLOW_CHART_KEY } from "../../src/plugins/flow-chart/types";
import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "../../src/plugins/quote-block/types";
import {
  HIGHLIGHT_BLOCK_ITEM_KEY,
  HIGHLIGHT_BLOCK_KEY,
} from "../../src/plugins/highlight-block/types";
import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "../../src/plugins/ordered-list/types";
import {
  UNORDERED_LIST_ITEM_KEY,
  UNORDERED_LIST_KEY,
} from "../../src/plugins/unordered-list/types";
import { CODE_BLOCK_ITEM_KEY, CODE_BLOCK_KEY } from "../../src/plugins/codeblock/types";

export const schema: EditorSchema = {
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
