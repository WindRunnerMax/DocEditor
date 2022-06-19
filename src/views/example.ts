import { BaseNode } from "src/types/types";

export const example: BaseNode[] = [
  {
    children: [{ text: "一级标题" }],
    heading: { id: "01f0de8f", type: "h1" },
  },
  {
    children: [{ text: "二级标题" }],
    heading: { id: "4644b757", type: "h2" },
  },
  {
    children: [{ text: "三级标题" }],
    heading: { id: "394504e0", type: "h3" },
  },
  {
    children: [
      { text: "支持" },
      { text: "加粗", bold: true },
      { text: "、" },
      { text: "斜体", italic: true },
      { text: "、" },
      { "text": "下划线", "under-line": true },
      { text: "、" },
      { "text": "删除线", "strike-through": true },
      { text: "、" },
      { "text": "行内代码块", "inline-code": true },
      { text: "、" },
      { text: "超链接", link: { href: "https://github.com/WindrunnerMax/DocEditor", blank: true } },
      { text: "。" },
    ],
  },
  {
    "quote-block": true,
    "children": [{ "children": [{ text: "支持引用块。" }], "quote-block-item": true }],
  },
  { children: [{ text: "支持快捷键: " }] },
  {
    "unordered-list": true,
    "children": [
      {
        "children": [
          { text: "一级标题" },
          { "text": "# ", "inline-code": true },
          { text: "、二级标题" },
          { "text": "## ", "inline-code": true },
          { text: "、三级标题" },
          { "text": "### ", "inline-code": true },
          { text: "。" },
        ],
        "unordered-list-item": { level: 1 },
      },
      {
        "unordered-list-item": { level: 1 },
        "children": [
          { text: "多级无序列表" },
          { "text": "* ", "inline-code": true },
          { text: "、" },
          { "text": "- ", "inline-code": true },
          { text: "，下级无序列表" },
          { "text": "tab", "inline-code": true },
          { text: "。" },
        ],
      },
      {
        "unordered-list-item": { level: 1 },
        "children": [
          { text: "多级有序列表" },
          { "text": "1. ", "inline-code": true },
          { text: "，下级有序列表" },
          { "text": "tab", "inline-code": true },
          { text: "。" },
        ],
      },
      {
        "unordered-list-item": { level: 1 },
        "children": [{ text: "分割线" }, { "text": "--- ", "inline-code": true }, { text: "。" }],
      },
      {
        "unordered-list-item": { level: 1 },
        "children": [{ text: "引用块" }, { "text": "> ", "inline-code": true }, { text: "。" }],
      },
    ],
  },
  { children: [{ text: "左侧工具栏可以唤起快捷操作，选中文字后可以弹出顶部工具栏。" }] },
  {
    "unordered-list": true,
    "children": [
      { "children": [{ text: "一级无序列表。" }], "unordered-list-item": { level: 1 } },
      { "unordered-list-item": { level: 2 }, "children": [{ text: "二级无序列表。" }] },
      { "unordered-list-item": { level: 3 }, "children": [{ text: "三级无序列表。" }] },
    ],
  },
  {
    "ordered-list": true,
    "children": [
      {
        "children": [{ text: "一级有序列表。" }],
        "ordered-list-item": { start: 1, level: 1 },
      },
      {
        "ordered-list-item": { level: 2, start: 1 },
        "children": [{ text: "二级有序列表。" }],
      },
      {
        "ordered-list-item": { level: 3, start: 1 },
        "children": [{ text: "三级有序列表。" }],
      },
      {
        "ordered-list-item": { start: 2, level: 2 },
        "children": [{ text: "有序列表各级单独计数。" }],
      },
    ],
  },
  { children: [{ text: "支持分割线。" }] },
  { "dividing-line": true, "children": [{ text: "" }] },
  {
    children: [
      { text: "打开" },
      { "text": "http://localhost:3000/#render", "inline-code": true },
      { text: "查看预览效果。" },
    ],
  },
  { children: [{ text: "后续支持完善中..." }] },
];
