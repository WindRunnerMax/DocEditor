// eslint-disable-next-line simple-import-sort/imports
import Prism from "prismjs";
import "prismjs/themes/prism.min.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";

import type { BlockElement, Path, Range } from "doc-editor-delta";

import { CODE_BLOCK_CONFIG } from "../types";
import { isText } from "doc-editor-utils";

export const DEFAULT_LANGUAGE = "Plain Text";
export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, "JavaScript", "Java"];

type CodeRange = {
  type: string;
  start: number;
  end: number;
};

const getLength = (token: Prism.Token | string) => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  }
  return 0;
};

export const codeTokenize = (code: string, language: string) => {
  if (language === DEFAULT_LANGUAGE) return [];
  const tokens = Prism.tokenize(code, Prism.languages[language.toLowerCase()]);
  const ranges: CodeRange[] = [];
  let start = 0;
  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;
    if (typeof token !== "string") {
      ranges.push({ type: token.type, start, end });
    }
    start = end;
  }
  return ranges;
};

export const getLanguage = (node: BlockElement): string => {
  return node[CODE_BLOCK_CONFIG]?.language || DEFAULT_LANGUAGE;
};

export const parseCodeNodeRange = (
  node: BlockElement,
  path: Path,
  language: string,
  key: string
): Range[] => {
  const texts: string[] = [];
  const ranges: Range[] = [];
  for (const child of node.children) {
    if (!isText(child)) return ranges;
    texts.push(child.text);
  }
  const str = texts.join("");
  const codeRange = codeTokenize(str, language);
  let index = 0;
  let iterated = 0;
  for (const range of codeRange) {
    const start = range.start;
    // NOTE: skip already iterated strings
    while (index < texts.length && start >= iterated + texts[index].length) {
      iterated = iterated + texts[index].length;
      index++;
    }
    // NOTE: find the index of array and relative position
    let offset = start - iterated;
    let remaining = range.end - range.start;
    while (index < texts.length && remaining > 0) {
      const currentText = texts[index];
      const currentPath = [...path, index];
      const taken = Math.min(remaining, currentText.length - offset);
      ranges.push({
        anchor: { path: currentPath, offset },
        focus: { path: currentPath, offset: offset + taken },
        [key]: range.type,
      });
      remaining = remaining - taken;
      if (remaining > 0) {
        iterated = iterated + currentText.length;
        // NOTE: next block will be indexed from 0
        offset = 0;
        index++;
      }
    }
  }
  return ranges;
};
