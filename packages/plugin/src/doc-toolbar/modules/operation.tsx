import "./index.scss";
import { Trigger } from "@arco-design/web-react";
import type { DocToolBarState, DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import {
  IconCopy,
  IconDelete,
  IconPlus,
  IconRight,
  IconScissor,
} from "@arco-design/web-react/icon";
import React from "react";
import type { BaseNode } from "slate";
import { Transforms } from "slate";
import { isBlock, isText, isTextBlock } from "src/core/ops";
import { EditorNode } from "src/types";
import { TriggerMenu } from "../components/trigger-menu";

export const OperationDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isEmptyLine) return null;
    // TODO: clipboard module
    const onCopy = () => {
      const editor = state.editor;
      const fragments = [state.element];
      const parseText = (fragment: BaseNode[]): string => {
        return fragment
          .map(item => {
            if (isText(item)) return EditorNode.string(item);
            else if (isTextBlock(editor, item)) return parseText(item.children) + "\n";
            else if (isBlock(editor, item)) return parseText(item.children);
            else return "";
          })
          .join("");
      };
      const text = parseText(fragments).replace(/\n$/, "");
      navigator.clipboard.writeText(text);
      state.close();
    };
    const onDelete = () => {
      Transforms.delete(state.editor, { at: state.path, unit: "block" });
      state.close();
    };
    const onCut = () => {
      onCopy();
      onDelete();
      state.close();
    };
    const nextLineState: DocToolBarState = {
      ...state,
      status: {
        ...state.status,
        isBlock: false,
        isEmptyLine: true,
        isNextLine: true,
      },
    };
    return (
      <React.Fragment>
        {getWrappedBannerMenu(<IconCopy />, "复制", onCopy)}
        {getWrappedBannerMenu(<IconScissor />, "剪贴", onCut)}
        {getWrappedBannerMenu(<IconDelete />, "删除", onDelete)}
        {!state.status.isNextLine && (
          <React.Fragment>
            <div className="doc-trigger-menu-cut"></div>
            <Trigger
              popup={() => <TriggerMenu state={nextLineState}></TriggerMenu>}
              position="right"
              popupAlign={{ left: 10, right: 10 }}
            >
              <div className="toolbar-banner-menu more-options">
                <div className="toolbar-banner-menu-left">
                  <span className="banner-menu-icon">{<IconPlus />}</span>
                  <span className="banner-menu-name">在下方添加</span>
                </div>
                <div className="toolbar-banner-menu-right">
                  <IconRight />
                </div>
              </div>
            </Trigger>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  },
};
