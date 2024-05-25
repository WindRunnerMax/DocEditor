import { IconOrderedList, IconUnorderedList } from "@arco-design/web-react/icon";
import React from "react";

import { ORDERED_LIST_ITEM_KEY, ORDERED_LIST_KEY } from "../../ordered-list/types";
import { UNORDERED_LIST_ITEM_KEY, UNORDERED_LIST_KEY } from "../../unordered-list/types";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedSignalMenu } from "../utils/wrapper";

export const ListDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[ORDERED_LIST_ITEM_KEY] && state.status.isTextBlock) {
      return { element: <IconOrderedList /> };
    }
    if (state.element[UNORDERED_LIST_ITEM_KEY] && state.status.isTextBlock) {
      return { element: <IconUnorderedList /> };
    }
    return null;
  },
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
