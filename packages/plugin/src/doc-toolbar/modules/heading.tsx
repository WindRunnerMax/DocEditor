import { HEADING_KEY } from "src/plugins/heading/types";
import type { DocToolbarPlugin } from "../types";
import { getWrappedSignalMenu } from "../utils/wrapper";
import { IconH1, IconH2, IconH3 } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import React from "react";

export const HeadingDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    const config = state.element[HEADING_KEY];
    if (config) {
      if (config.type === "h1") {
        return { element: <IconH1 /> };
      } else if (config.type === "h2") {
        return { element: <IconH2 /> };
      } else if (config.type === "h3") {
        return { element: <IconH3 /> };
      }
    }
    return null;
  },
  renderSignal: state => {
    if (state.status.isBlock) return null;
    const getClickHandler = (type: string) => {
      return () => {
        exec(state, HEADING_KEY + "." + type);
        state.close();
      };
    };
    return (
      <React.Fragment>
        {getWrappedSignalMenu(<IconH1 />, getClickHandler("h1"))}
        {getWrappedSignalMenu(<IconH2 />, getClickHandler("h2"))}
        {getWrappedSignalMenu(<IconH3 />, getClickHandler("h3"))}
      </React.Fragment>
    );
  },
  renderBanner: () => null,
};
