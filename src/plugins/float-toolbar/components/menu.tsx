import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconCode,
  IconFontColors,
  IconItalic,
  IconLineHeight,
  IconLink,
  IconMenu,
  IconStrikethrough,
  IconUnderline,
} from "@arco-design/web-react/icon";
import { Menu } from "@arco-design/web-react";
import { BOLD_KEY } from "src/plugins/bold/types";
import { ITALIC_KEY } from "src/plugins/italic/types";
import { STRIKE_THROUGH_KEY } from "src/plugins/strike-through/types";
import { UNDERLINE_KEY } from "src/plugins/under-line/types";
import { HYPER_LINK_KEY } from "src/plugins/hyper-link/types";
import { INLINE_CODE_KEY } from "src/plugins/inline-code/types";
import { LINE_HEIGHT_KEY } from "src/plugins/line-height/types";
import { FONT_BASE_KEY } from "src/plugins/font-base/types";
import { ALIGN_KEY } from "src/plugins/align/types";

export const MenuItems = (
  <>
    <Menu.Item key={BOLD_KEY}>
      <IconBold />
    </Menu.Item>
    <Menu.Item key={ITALIC_KEY}>
      <IconItalic />
    </Menu.Item>
    <Menu.Item key={UNDERLINE_KEY}>
      <IconUnderline />
    </Menu.Item>
    <Menu.Item key={STRIKE_THROUGH_KEY}>
      <IconStrikethrough />
    </Menu.Item>
    <Menu.Item key={INLINE_CODE_KEY}>
      <IconCode />
    </Menu.Item>
    <Menu.Item key={HYPER_LINK_KEY}>
      <IconLink />
    </Menu.Item>
    <Menu.Item key={FONT_BASE_KEY}>
      <IconFontColors />
    </Menu.Item>
    <Menu.Item key={LINE_HEIGHT_KEY}>
      <IconLineHeight />
    </Menu.Item>
    <Menu.SubMenu
      key={ALIGN_KEY}
      title={<IconAlignLeft />}
      popup
      triggerProps={{ trigger: "click", position: "bottom" }}
    >
      <Menu.Item key={`${ALIGN_KEY}.left`}>
        <div className="align-menu-center">
          <IconAlignLeft />
        </div>
      </Menu.Item>
      <Menu.Item key={`${ALIGN_KEY}.center`}>
        <div className="align-menu-center">
          <IconAlignCenter />
        </div>
      </Menu.Item>
      <Menu.Item key={`${ALIGN_KEY}.right`}>
        <div className="align-menu-center">
          <IconAlignRight />
        </div>
      </Menu.Item>
      <Menu.Item key={`${ALIGN_KEY}.justify`}>
        <div className="align-menu-center">
          <IconMenu />
        </div>
      </Menu.Item>
    </Menu.SubMenu>
  </>
);
