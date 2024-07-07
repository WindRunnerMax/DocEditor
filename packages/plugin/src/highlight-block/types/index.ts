import type { BlockElement } from "doc-editor-delta";
import type { AssertT } from "doc-editor-utils";

declare module "doc-editor-delta/dist/interface" {
  interface BlockElement {
    [HIGHLIGHT_BLOCK_KEY]?: { border: string; background: string };
  }
}

export const HIGHLIGHT_BLOCK_KEY = "highlight-block";

export const HL_DOM_TAG = "data-hl-block";

export const COLOR_MAP: AssertT<BlockElement["highlight-block"]>[] = [
  { background: "var(--arcoblue-3)", border: "var(--arcoblue-6)" },
  { background: "var(--green-3)", border: "var(--green-6)" },
  { background: "var(--orange-3)", border: "var(--orange-6)" },
  { background: "var(--red-3)", border: "var(--red-6)" },
  { background: "var(--purple-3)", border: "var(--purple-6)" },
  { background: "var(--gray-3)", border: "var(--gray-6)" },
  { background: "var(--magenta-3)", border: "var(--magenta-6)" },
  { background: "var(--pinkpurple-3)", border: "var(--pinkpurple-6)" },
  { background: "var(--orangered-3)", border: "var(--orangered-6)" },
  { background: "var(--cyan-3)", border: "var(--cyan-6)" },
  { background: "var(--lime-3)", border: "var(--lime-6)" },
  { background: "var(--gold-3)", border: "var(--gold-6)" },
];
