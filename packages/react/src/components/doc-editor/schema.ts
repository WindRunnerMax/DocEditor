import type { EditorSchema } from "doc-editor-core";
import {
  CODE_BLOCK_KEY,
  TABLE_BLOCK_KEY,
  TABLE_CELL_BLOCK_KEY,
  TABLE_ROW_BLOCK_KEY,
} from "doc-editor-plugin";
import { DIVIDING_LINE_KEY } from "doc-editor-plugin";
import { FLOW_CHART_KEY } from "doc-editor-plugin";
import { HIGHLIGHT_BLOCK_KEY } from "doc-editor-plugin";
import { IMAGE_KEY } from "doc-editor-plugin";
import { UNORDERED_LIST_ITEM_KEY, UNORDERED_LIST_KEY } from "doc-editor-plugin";
import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "doc-editor-plugin";
import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "doc-editor-plugin";
import { REACT_LIVE_KEY } from "doc-editor-plugin";

export const schema: EditorSchema = {
  [IMAGE_KEY]: {
    void: true,
    block: true,
  },
  [DIVIDING_LINE_KEY]: {
    void: true,
    block: true,
  },
  [FLOW_CHART_KEY]: {
    void: true,
    block: true,
  },
  [QUOTE_BLOCK_ITEM_KEY]: {
    wrap: QUOTE_BLOCK_KEY,
  },
  [ORDERED_LIST_ITEM_KEY]: {
    wrap: ORDERED_LIST_KEY,
  },
  [UNORDERED_LIST_ITEM_KEY]: {
    wrap: UNORDERED_LIST_KEY,
  },
  [HIGHLIGHT_BLOCK_KEY]: {
    block: true,
    instance: true,
  },
  [CODE_BLOCK_KEY]: {
    block: true,
    instance: true,
  },
  [REACT_LIVE_KEY]: {
    block: true,
    instance: true,
  },
  [TABLE_ROW_BLOCK_KEY]: {
    wrap: TABLE_BLOCK_KEY,
  },
  [TABLE_CELL_BLOCK_KEY]: {
    wrap: TABLE_ROW_BLOCK_KEY,
    instance: true,
  },
};
