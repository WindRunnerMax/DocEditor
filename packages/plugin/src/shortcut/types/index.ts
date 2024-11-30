import { KEY_CODE } from "doc-editor-utils";

import { BOLD_KEY } from "../../bold/types";
import { DIVIDING_LINE_KEY } from "../../dividing-line/types";
import { HEADING_KEY } from "../../heading/types";
import { ITALIC_KEY } from "../../italic/types";
import { ORDERED_LIST_KEY } from "../../ordered-list/types";
import { QUOTE_BLOCK_KEY } from "../../quote-block/types";
import { UNDERLINE_KEY } from "../../under-line/types";
import { UNORDERED_LIST_KEY } from "../../unordered-list/types";
import { CTRL } from "../utils/is";

export const SHORTCUT_KEY = "shortcut";

export const SHORTCUTS: Record<string, string> = {
  "1.": ORDERED_LIST_KEY,
  "-": UNORDERED_LIST_KEY,
  "*": UNORDERED_LIST_KEY,
  ">": QUOTE_BLOCK_KEY,
  "#": `${HEADING_KEY}.h1`,
  "##": `${HEADING_KEY}.h2`,
  "###": `${HEADING_KEY}.h3`,
  "---": DIVIDING_LINE_KEY,
};

export const COMMAND_SHORTCUTS: Record<string, string> = {
  [KEY_CODE.B + "-" + CTRL]: BOLD_KEY,
  [KEY_CODE.I + "-" + CTRL]: ITALIC_KEY,
  [KEY_CODE.U + "-" + CTRL]: UNDERLINE_KEY,
};
