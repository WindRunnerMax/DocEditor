import { IconPlus } from "@arco-design/web-react/icon";
import { DocToolbarPlugin } from "../types";
import { QUOTE_BLOCK_KEY } from "src/plugins/quote-block/types";
import { ORDERED_LIST_KEY } from "src/plugins/ordered-list/types";
import { UNORDERED_LIST_KEY } from "src/plugins/unordered-list/types";

export const DefaultAddDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (
      state.element[QUOTE_BLOCK_KEY] ||
      state.element[ORDERED_LIST_KEY] ||
      state.element[UNORDERED_LIST_KEY] ||
      state.status.isInCodeBlock ||
      state.status.isInHighLightBlock ||
      state.status.isInReactLive
    ) {
      return null;
    }
    return { element: <IconPlus /> };
  },
  renderSignal: () => null,
  renderBanner: () => null,
};
