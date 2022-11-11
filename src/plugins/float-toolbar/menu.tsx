import { boldPluginKey } from "../bold";
import { italicPluginKey } from "../italic";
import { underLinePluginKey } from "../under-line";
import { strikeThroughPluginKey } from "../strike-through";
import { inlineCodePluginKey } from "../inline-code";
import { hyperLinkPluginKey } from "../hyper-link";
import { fontBasePluginKey } from "../font-base";
import { lineHeightPluginKey } from "../line-height";
import { alignKey } from "../align";
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

export const MenuItems = (
  <>
    <Menu.Item key={boldPluginKey}>
      <IconBold />
    </Menu.Item>
    <Menu.Item key={italicPluginKey}>
      <IconItalic />
    </Menu.Item>
    <Menu.Item key={underLinePluginKey}>
      <IconUnderline />
    </Menu.Item>
    <Menu.Item key={strikeThroughPluginKey}>
      <IconStrikethrough />
    </Menu.Item>
    <Menu.Item key={inlineCodePluginKey}>
      <IconCode />
    </Menu.Item>
    <Menu.Item key={hyperLinkPluginKey}>
      <IconLink />
    </Menu.Item>
    <Menu.Item key={fontBasePluginKey}>
      <IconFontColors />
    </Menu.Item>
    <Menu.Item key={lineHeightPluginKey}>
      <IconLineHeight />
    </Menu.Item>
    <Menu.SubMenu
      key={alignKey}
      title={<IconAlignLeft />}
      popup
      triggerProps={{ trigger: "click", position: "bottom" }}
    >
      <Menu.Item key={`${alignKey}.left`}>
        <div className="align-menu-center">
          <IconAlignLeft />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.center`}>
        <div className="align-menu-center">
          <IconAlignCenter />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.right`}>
        <div className="align-menu-center">
          <IconAlignRight />
        </div>
      </Menu.Item>
      <Menu.Item key={`${alignKey}.justify`}>
        <div className="align-menu-center">
          <IconMenu />
        </div>
      </Menu.Item>
    </Menu.SubMenu>
  </>
);
