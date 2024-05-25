import { IconQuote } from "@arco-design/web-react/icon";

import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "../../quote-block/types";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedSignalMenu } from "../utils/wrapper";

export const QuoteDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[QUOTE_BLOCK_ITEM_KEY] && state.status.isTextBlock) {
      return { element: <IconQuote /> };
    }
    return null;
  },
  renderSignal: state => {
    if (state.status.isBlock) return null;
    const onClick = () => {
      exec(state, QUOTE_BLOCK_KEY);
      state.close();
    };
    return getWrappedSignalMenu(<IconQuote />, onClick);
  },
  renderBanner: () => null,
};
