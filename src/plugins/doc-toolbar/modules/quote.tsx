import { DocToolbarPlugin } from "../types";
import { getWrappedSignalMenu } from "../utils/wrapper";
import { IconQuote } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import { QUOTE_BLOCK_ITEM_KEY, QUOTE_BLOCK_KEY } from "src/plugins/quote-block/types";

export const QuoteDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[QUOTE_BLOCK_ITEM_KEY]) {
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
