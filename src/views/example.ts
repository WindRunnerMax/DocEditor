import { BaseNode } from "src/types/types";

export const example: BaseNode[] = [
  { children: [{ text: "文档编辑器" }], heading: { id: "01f0de8f", type: "h1" } },
  {
    children: [
      {
        text: "Github",
        link: { href: "https://github.com/WindrunnerMax/DocEditor", blank: true },
      },
      { text: " ｜ " },
      {
        text: "Editor DEMO",
        link: { href: "https://windrunnermax.github.io/DocEditor/", blank: true },
      },
      { text: " ｜ " },
      {
        text: "BLOG",
        link: {
          href: "https://github.com/WindrunnerMax/EveryDay/blob/master/Plugin/基于slate构建文档编辑器.md",
          blank: true,
        },
      },
    ],
    align: "center",
  },
  {
    children: [
      { text: "基于" },
      { "text": "slate.js", "inline-code": true },
      {
        text: "构建的文档编辑器，所有功能都是基于插件定义实现，通过右上角按钮切换编辑模式与预览模式，所见即所得，当前页面也实现了亮色与暗色模式的适配。",
      },
    ],
  },
  { children: [{ text: "行内元素" }], heading: { type: "h2", id: "83ddface" } },
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
      {
        text: "超链接",
        link: { href: "https://github.com/WindrunnerMax/DocEditor", blank: true },
      },
      { text: "、文字对齐。" },
    ],
    align: "center",
  },
  { children: [{ text: "块级元素" }], heading: { id: "4644b757", type: "h2" } },
  { children: [{ text: "标题" }], heading: { type: "h3", id: "213e6703" } },
  {
    children: [
      { text: "支持" },
      { "text": "h1~h3", "inline-code": true },
      { text: "的三级标题，快捷键唤起 一级标题" },
      { "text": "# ", "inline-code": true },
      { text: "、二级标题" },
      { "text": "## ", "inline-code": true },
      { text: "、三级标题" },
      { "text": "### ", "inline-code": true },
      { text: "。" },
    ],
  },
  { children: [{ text: "引用块" }], heading: { type: "h3", id: "8426a51b" } },
  {
    "quote-block": true,
    "children": [
      { "children": [{ text: "支持引用块。" }], "quote-block-item": true },
      {
        "unordered-list": true,
        "children": [
          {
            "quote-block-item": true,
            "children": [{ text: "可以嵌套其他格式。" }],
            "unordered-list-item": { level: 1 },
          },
          {
            "quote-block-item": true,
            "unordered-list-item": { level: 1 },
            "children": [
              { text: "支持快捷键" },
              { "text": "> ", "inline-code": true },
              { text: "。" },
            ],
          },
        ],
      },
    ],
  },
  { children: [{ text: "无序列表" }], heading: { type: "h3", id: "a764a9a0" } },
  {
    children: [{ text: "支持" }, { "text": "3", "inline-code": true }, { text: "级无序列表。" }],
  },
  {
    "unordered-list": true,
    "children": [
      { "children": [{ text: "一级无序列表。" }], "unordered-list-item": { level: 1 } },
      { "unordered-list-item": { level: 2 }, "children": [{ text: "二级无序列表。" }] },
      { "unordered-list-item": { level: 3 }, "children": [{ text: "三级无序列表。" }] },
      { "unordered-list-item": { level: 2 }, "children": [{ text: "二级无序列表。" }] },
      { "unordered-list-item": { level: 1 }, "children": [{ text: "一级无序列表。" }] },
      {
        "unordered-list": true,
        "children": [
          {
            "unordered-list-item": { level: 1 },
            "children": [
              { text: "快捷键唤起无序列表" },
              { "text": "* ", "inline-code": true },
              { text: "、" },
              { "text": "- ", "inline-code": true },
              { text: "，下一级无序列表" },
              { "text": "tab", "inline-code": true },
              { text: "。" },
            ],
          },
        ],
      },
    ],
  },
  { children: [{ text: "有序列表" }], heading: { type: "h3", id: "400aa7e1" } },
  {
    children: [{ text: "支持" }, { "text": "3", "inline-code": true }, { text: "级有序列表。" }],
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
        "children": [{ text: "二级有序列表，有序列表各级单独计数。" }],
      },
      {
        "children": [
          { text: "快捷键唤起有序列表" },
          { "text": "* ", "inline-code": true },
          { text: "、" },
          { "text": "- ", "inline-code": true },
          { text: "，下一级有序列表" },
          { "text": "tab", "inline-code": true },
          { text: "。" },
        ],
        "ordered-list-item": { level: 1, start: 2 },
      },
    ],
  },
  { children: [{ text: "分割线" }], heading: { type: "h3", id: "5ab77ffb" } },
  {
    children: [
      { text: "支持分割线，快捷键" },
      { "text": "--- ", "inline-code": true },
      { text: "。" },
    ],
  },
  { "dividing-line": true, "children": [{ text: "" }] },
  { children: [{ text: "快捷功能" }], heading: { type: "h2", id: "82651426" } },
  { children: [{ text: "快捷键" }], heading: { type: "h3", id: "614d6a4c" } },
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
        "unordered-list": true,
        "children": [
          {
            "unordered-list-item": { level: 1 },
            "children": [{ text: "引用块" }, { "text": "> ", "inline-code": true }, { text: "。" }],
          },
        ],
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
    ],
  },
  { children: [{ text: "工具栏" }], heading: { type: "h3", id: "0f8a5d9e" } },
  { children: [{ text: "左侧工具栏可以唤起快捷操作，选中文字后可以弹出顶部工具栏。" }] },
  { children: [{ text: "其他" }], heading: { type: "h2", id: "3e92c207" } },
  { children: [{ text: "后续支持完善中..." }] },
];
