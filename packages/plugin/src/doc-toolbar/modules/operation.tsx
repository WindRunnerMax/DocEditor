import { Trigger } from "@arco-design/web-react";
import {
  IconCopy,
  IconDelete,
  IconPlus,
  IconRight,
  IconScissor,
} from "@arco-design/web-react/icon";
import { Transforms } from "doc-editor-delta";
import { preventEvent } from "doc-editor-utils";
import React from "react";

import { TriggerMenu } from "../components/trigger-menu";
import { NEXT_DOC_TOOLBAR_MODULES } from "../config/next";
import type { DocToolbarPlugin, DocToolBarState } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";

export const OperationDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isEmptyLine) return null;
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/components/editable.tsx#L931
    const onCopy = () => {
      state.editor.clipboard.copyNode([state.element]);
      state.close();
    };
    const onDelete = () => {
      state.editor.selection.focus();
      state.editor.selection.set(state.path);
      Promise.resolve().then(() => {
        Transforms.delete(state.editor.raw, { at: state.path, unit: "block" });
        state.close();
      });
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
              className="doc-toolbar-trigger"
              // COMPAT: 采取配置传递的方式解决循环引用
              popup={() => (
                <TriggerMenu state={nextLineState} plugins={NEXT_DOC_TOOLBAR_MODULES}></TriggerMenu>
              )}
              position="right"
              popupAlign={{ left: 10, right: 10 }}
            >
              <div className="toolbar-banner-menu more-options" onMouseDown={preventEvent}>
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
