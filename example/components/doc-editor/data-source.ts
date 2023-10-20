import { IMAGE_STATUS } from "../../../src/plugins/image/types";
import { BaseNode } from "../../../src/types";

export const example: BaseNode[] = [
  {
    children: [{ text: "文档编辑器" }],
    heading: { id: "01f0de8f", type: "h1" },
    align: "center",
  },
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
      { text: "、文字对齐、" },
      { "text": "字号", "font-base": { fontSize: 13 } },
      { text: "、" },
      { "text": "颜色", "font-base": { color: "rgb(var(--green-6))" } },
      { text: "、" },
      {
        "text": "背景",
        "font-base": { color: "var(--color-white)", background: "rgb(var(--blue-6))" },
      },
      { text: "。" },
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
    children: [
      { text: "支持" },
      { "text": "3", "inline-code": true },
      { text: "级无序列表，快捷键唤起无序列表" },
      { "text": "* ", "inline-code": true },
      { text: "、" },
      { "text": "- ", "inline-code": true },
      { text: "，下一级无序列表" },
      { "text": "tab", "inline-code": true },
      { text: "。" },
    ],
  },
  {
    "unordered-list": true,
    "children": [
      { "children": [{ text: "一级无序列表。" }], "unordered-list-item": { level: 1 } },
      { "unordered-list-item": { level: 2 }, "children": [{ text: "二级无序列表。" }] },
      { "unordered-list-item": { level: 3 }, "children": [{ text: "三级无序列表。" }] },
    ],
  },
  { children: [{ text: "有序列表" }], heading: { type: "h3", id: "400aa7e1" } },
  {
    children: [
      { text: "支持" },
      { "text": "3", "inline-code": true },
      { text: "级有序列表，有序列表各级单独计数，快捷键唤起有序列表" },
      { "text": "1. ", "inline-code": true },
      { text: "，下一级有序列表" },
      { "text": "tab", "inline-code": true },
      { text: "。" },
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
  { children: [{ text: "高亮块" }], heading: { type: "h3", id: "af869b51" } },
  {
    "highlight-block": { border: "var(--blue-6)", background: "var(--blue-3)" },
    "children": [
      {
        "children": [{ text: "🌰 " }, { text: "举个栗子", bold: true }],
        "highlight-block-item": true,
      },
      {
        "highlight-block-item": true,
        "children": [{ text: "支持高亮块 可以用于提示文档中的重要内容。" }],
      },
    ],
  },
  {
    "highlight-block": { background: "var(--green-3)", border: "var(--green-6)" },
    "children": [
      { "children": [{ text: "🏝 可以为高亮块更换主题。" }], "highlight-block-item": true },
    ],
  },
  { children: [{ text: "行高" }], heading: { type: "h3", id: "5ab77ffb" } },
  { "children": [{ text: "支持独立设置行高。" }], "line-height": 2 },
  { children: [{ text: "图片" }], heading: { type: "h3", id: "aab55qq1" } },
  { children: [{ text: "支持图片上传。" }] },
  {
    children: [{ text: "" }],
    image: { src: "./favicon.ico", status: IMAGE_STATUS.SUCCESS, width: 256, height: 256 },
    uuid: "5ab77ffb-aab55qq1",
  },
  { heading: { type: "h2", id: "82651426" }, children: [{ text: "代码块" }] },
  {
    "code-block": true,
    "code-block-config": { language: "JavaScript" },
    "children": [
      { "children": [{ text: "// 支持代码块高亮" }], "code-block-item": true },
      { "code-block-item": true, "children": [{ text: "const a = 1;" }] },
      { "code-block-item": true, "children": [{ text: "const b = 2;" }] },
    ],
  },
  { heading: { type: "h2", id: "82651426" }, children: [{ text: "流程图" }] },
  { children: [{ text: "支持流程图在线编辑。" }] },
  {
    "uuid": "4cb99540-783d-4310-87ab-1c751cd0d5ea",
    "flow-chart": {
      type: "xml" as const,
      content:
        '<mxGraphModel dx="506" dy="742" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="4" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;sketch=0;" parent="1" source="2" target="3" edge="1"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="2" value="Start" style="rounded=1;whiteSpace=wrap;html=1;sketch=0;glass=0;shadow=0;comic=1;" parent="1" vertex="1"><mxGeometry x="140" y="230" width="120" height="60" as="geometry"/></mxCell><mxCell id="3" value="End" style="rounded=1;whiteSpace=wrap;html=1;shadow=0;glass=0;comic=1;" parent="1" vertex="1"><mxGeometry x="420" y="230" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel>',
    },
    "children": [{ text: "" }],
  },
  { heading: { type: "h2", id: "82651426" }, children: [{ text: "React实时预览" }] },
  { children: [{ text: "支持React组件实时编辑及预览。" }] },
  {
    "react-live": true,
    "children": [
      {
        "children": [
          {
            text: "<Space size='large'>",
          },
        ],
        "react-live-item": true,
      },
      {
        "children": [
          {
            text: "  <Button type='primary'>Primary</Button>",
          },
        ],
        "react-live-item": true,
      },
      {
        "react-live-item": true,
        "children": [
          {
            text: "  <Button type='secondary'>Secondary</Button>",
          },
        ],
      },
      {
        "react-live-item": true,
        "children": [
          {
            text: "  <Button type='dashed'>Dashed</Button>",
          },
        ],
      },
      {
        "react-live-item": true,
        "children": [
          {
            text: "  <Button type='outline'>Outline</Button>",
          },
        ],
      },
      {
        "react-live-item": true,
        "children": [
          {
            text: "  <Button type='text'>Text</Button>",
          },
        ],
      },
      {
        "react-live-item": true,
        "children": [
          {
            text: "</Space>",
          },
        ],
      },
    ],
  },
  { children: [{ text: "快捷功能" }], heading: { type: "h2", id: "8b4f0218" } },
  { heading: { type: "h3", id: "614d6a4c" }, children: [{ text: "快捷键" }] },
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
      {
        "unordered-list-item": { level: 1 },
        "children": [
          { text: "撤销" },
          { "text": "Ctrl + Z", "inline-code": true },
          { text: "，前进" },
          { "text": "Ctrl + Shift + Z", "inline-code": true },
          { text: "。" },
        ],
      },
      {
        "unordered-list-item": { level: 1 },
        "children": [{ text: "缩进" }, { "text": "Tab", "inline-code": true }, { text: "。" }],
      },
    ],
  },
  { children: [{ text: "工具栏" }], heading: { type: "h3", id: "0f8a5d9e" } },
  { children: [{ text: "左侧工具栏可以唤起快捷操作，选中文字后可以弹出顶部工具栏。" }] },
  { children: [{ text: "其他" }], heading: { type: "h2", id: "3e92c207" } },
  { children: [{ text: "后续支持完善中..." }] },
];
