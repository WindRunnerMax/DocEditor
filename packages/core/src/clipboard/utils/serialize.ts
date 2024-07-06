import { EVENT_ENUM } from "doc-editor-utils";

import { LINE_TAG } from "./constant";

export const writeToClipboard = (data: Record<string, string>) => {
  const textarea = document.createElement("textarea");
  const handler = (event: ClipboardEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    for (const [key, value] of Object.entries(data)) {
      event.clipboardData && event.clipboardData.setData(key, value);
    }
  };
  textarea.addEventListener(EVENT_ENUM.COPY, handler, true);
  textarea.style.position = "fixed";
  textarea.style.left = "-999999999px";
  textarea.style.top = "-999999999px";
  textarea.value = " ";
  // COMPAT: `safari`需要挂载在`DOM`上才能触发
  // `ipad`则需要挂载在内部`DOM`容器才能执行 暂不处理
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand(EVENT_ENUM.COPY);
  textarea.removeEventListener(EVENT_ENUM.COPY, handler);
  document.body.removeChild(textarea);
};

export const serializeHTML = (node: Node): string => {
  const el = document.createElement("div");
  el.appendChild(node);
  return el.innerHTML;
};

export const getTextContent = (node: Node): string => {
  if (node instanceof Text) {
    return node.textContent || "";
  }
  const texts: string[] = [];
  node.childNodes.forEach(child => {
    texts.push(getTextContent(child));
  });
  if (node instanceof Element && node.getAttribute(LINE_TAG)) {
    texts.push("\n");
  }
  return texts.join("");
};

export const getFragmentText = (node: Node) => {
  const texts: string[] = [];
  Array.from(node.childNodes).forEach(it => {
    texts.push(getTextContent(it));
  });
  // COMPAT: 将文本最后的`\n`移除
  return texts.join("").slice(0, -1);
};
