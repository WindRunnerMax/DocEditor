import "./index.scss";
import { Editor } from "slate";
import {
  IconCode,
  IconEdit,
  IconFileImage,
  IconH1,
  IconH2,
  IconH3,
  IconMoreVertical,
  IconOrderedList,
  IconPalette,
  IconPaste,
  IconPlus,
  IconQuote,
  IconUnorderedList,
} from "@arco-design/web-react/icon";
import { Menu, Trigger } from "@arco-design/web-react";
import { execCommand, SlateCommands } from "../../core/command";
import { ReactEditor, RenderElementProps } from "slate-react";
import { useState } from "react";
import { focusSelection } from "../../core/ops/set";
import { cs } from "src/utils/classnames";
import { CODE_BLOCK_KEY } from "../codeblock";
import { HEADING_KEY } from "../heading";
import { QUOTE_BLOCK_KEY } from "../quote-block";
import { HIGHLIGHT_BLOCK_KEY } from "../highlight-block";
import { ORDERED_LIST_KEY } from "../ordered-list";
import { UNORDERED_LIST_KEY } from "../unordered-list";
import { IMAGE_KEY } from "../image";
import { DIVIDING_LINE_KEY } from "../dividing-line";
import { FLOW_CHART_KEY } from "../flow-chart";

const DocMenuItems = (
  <>
    <Menu.Item key={`${HEADING_KEY}.h1`}>
      <IconH1 />
      一级标题
    </Menu.Item>
    <Menu.Item key={`${HEADING_KEY}.h2`}>
      <IconH2 />
      二级标题
    </Menu.Item>
    <Menu.Item key={`${HEADING_KEY}.h3`}>
      <IconH3 />
      三级标题
    </Menu.Item>
    <Menu.Item key={QUOTE_BLOCK_KEY}>
      <IconQuote />
      块级引用
    </Menu.Item>
    <Menu.Item key={HIGHLIGHT_BLOCK_KEY}>
      <IconPaste />
      高亮块
    </Menu.Item>
    <Menu.Item key={ORDERED_LIST_KEY}>
      <IconOrderedList />
      有序列表
    </Menu.Item>
    <Menu.Item key={UNORDERED_LIST_KEY}>
      <IconUnorderedList />
      无序列表
    </Menu.Item>
    <Menu.Item key={IMAGE_KEY}>
      <IconFileImage />
      图片
    </Menu.Item>
    <Menu.Item key={CODE_BLOCK_KEY}>
      <IconCode />
      代码块
    </Menu.Item>
    <Menu.Item key={FLOW_CHART_KEY}>
      <IconPalette />
      流程图
    </Menu.Item>
    <Menu.Item key={DIVIDING_LINE_KEY}>
      <IconEdit />
      分割线
    </Menu.Item>
  </>
);

export const DocMenu: React.FC<{
  editor: Editor;
  element: RenderElementProps["element"];
  commands: SlateCommands;
  offset: number;
  icon?: JSX.Element;
}> = props => {
  const [visible, setVisible] = useState(false);

  const affixStyles = (param: string) => {
    setVisible(false);
    const [key, data] = param.split(".");
    const path = ReactEditor.findPath(props.editor, props.element);
    focusSelection(props.editor, path);
    execCommand(props.editor, props.commands, key, { extraKey: data, path });
  };
  const MenuPopup = <Menu onClickMenuItem={affixStyles}>{DocMenuItems}</Menu>;
  return (
    <Trigger
      popup={() => (
        <Trigger
          className="doc-menu-popup"
          popup={() => MenuPopup}
          position="left"
          popupVisible={visible}
          onVisibleChange={setVisible}
        >
          <span
            className="doc-icon-container"
            // prevent toolbar from taking focus away from editor
            onMouseDown={e => e.preventDefault()}
          >
            {props.icon || <IconPlus />}
            <IconMoreVertical />
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
