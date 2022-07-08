import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { Editor } from "slate";
import {
  IconEdit,
  IconH1,
  IconH2,
  IconH3,
  IconOrderedList,
  IconPaste,
  IconPlusCircle,
  IconQuote,
  IconUnorderedList,
} from "@arco-design/web-react/icon";
import { Menu, Trigger } from "@arco-design/web-react";
import { execCommand, SlateCommands } from "../../utils/slate-commands";
import { ReactEditor, RenderElementProps } from "slate-react";
import { useState } from "react";
import { focusSelection } from "../../utils/slate-utils";
import { cs } from "src/utils/classnames";

const DocMenu: React.FC<{
  editor: Editor;
  element: RenderElementProps["element"];
  commands: SlateCommands;
  offset: number;
}> = props => {
  const [visible, setVisible] = useState(false);

  const affixStyles = (param: string) => {
    setVisible(false);
    const [key, data] = param.split(".");
    const path = ReactEditor.findPath(props.editor, props.element);
    focusSelection(props.editor, path);
    execCommand(props.editor, props.commands, key, { extraKey: data, path });
  };
  const MenuPopup = (
    <Menu onClickMenuItem={affixStyles} className="doc-menu-popup">
      <Menu.Item key="heading.h1">
        <IconH1 />
        一级标题
      </Menu.Item>
      <Menu.Item key="heading.h2">
        <IconH2 />
        二级标题
      </Menu.Item>
      <Menu.Item key="heading.h3">
        <IconH3 />
        三级标题
      </Menu.Item>
      <Menu.Item key="quote-block">
        <IconQuote />
        块级引用
      </Menu.Item>
      <Menu.Item key="highlight-block">
        <IconPaste />
        高亮块
      </Menu.Item>
      <Menu.Item key="ordered-list">
        <IconOrderedList />
        有序列表
      </Menu.Item>
      <Menu.Item key="unordered-list">
        <IconUnorderedList />
        无序列表
      </Menu.Item>
      <Menu.Item key="dividing-line">
        <IconEdit />
        分割线
      </Menu.Item>
    </Menu>
  );
  return (
    <Trigger
      popup={() => (
        <Trigger
          popup={() => MenuPopup}
          position="left"
          popupVisible={visible}
          onVisibleChange={setVisible}
        >
          <span
            className="doc-icon-plus"
            // prevent toolbar from taking focus away from editor
            onMouseDown={e => e.preventDefault()}
          >
            <IconPlusCircle />
          </span>
        </Trigger>
      )}
      position="left"
      popupAlign={{ left: props.offset }}
      mouseLeaveDelay={200}
      mouseEnterDelay={200}
    >
      <div className={cs(visible && "doc-line-hover")}>{props.children}</div>
    </Trigger>
  );
};

const NO_DOC_TOOL_BAR = [
  "quote-block",
  "ordered-list",
  "unordered-list",
  "dividing-line",
  "highlight-block",
];
const OFFSET_MAP: Record<string, number> = {
  "quote-block-item": 12,
  "highlight-block-item": 8,
};
export const DocToolBarPlugin = (
  editor: Editor,
  isRender: boolean,
  commands: SlateCommands
): Plugin => {
  return {
    key: "doc-toolbar",
    priority: 13,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    match: () => true,
    renderLine: context => {
      if (isRender) return context.children;
      for (const item of NO_DOC_TOOL_BAR) {
        if (context.element[item]) return context.children;
      }
      let offset = 0;
      for (const item of Object.keys(OFFSET_MAP)) {
        if (context.element[item]) {
          offset = OFFSET_MAP[item] || 0;
          break;
        }
      }
      return (
        <DocMenu editor={editor} commands={commands} element={context.element} offset={offset}>
          {context.children}
        </DocMenu>
      );
    },
  };
};
