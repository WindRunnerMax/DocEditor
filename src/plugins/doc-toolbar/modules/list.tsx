import { DocToolbarPlugin } from "../types";
import { getWrappedSignalMenu } from "../utils/wrapper";
import { IconOrderedList, IconUnorderedList } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import React from "react";
import { ORDERED_LIST_KEY } from "src/plugins/ordered-list/types";
import { UNORDERED_LIST_KEY } from "src/plugins/unordered-list/types";

export const ListDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderSignal: state => {
    if (state.status.isBlock) return null;
    const getClickHandler = (type: string) => {
      return () => {
        exec(state, type);
        state.close();
      };
    };
    return (
      <React.Fragment>
        {getWrappedSignalMenu(<IconOrderedList />, getClickHandler(ORDERED_LIST_KEY))}
        {getWrappedSignalMenu(<IconUnorderedList />, getClickHandler(UNORDERED_LIST_KEY))}
      </React.Fragment>
    );
  },
  renderBanner: () => null,
};
