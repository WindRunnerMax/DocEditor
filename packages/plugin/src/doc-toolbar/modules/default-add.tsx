import { IconPlus } from "@arco-design/web-react/icon";

import { ORDERED_LIST_KEY } from "../../ordered-list/types";
import { QUOTE_BLOCK_KEY } from "../../quote-block/types";
import { UNORDERED_LIST_KEY } from "../../unordered-list/types";
import type { DocToolbarPlugin } from "../types";

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
