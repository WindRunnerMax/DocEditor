import Prism from "prismjs";
import "prismjs/themes/prism.min.css";
import "prismjs/components/prism-javascript";

export const DEFAULT_LANGUAGE = "Plain Text";
export const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, "Javascript", "Java"];

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
  const tokens = Prism.tokenize(code, Prism.languages[language]);
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
