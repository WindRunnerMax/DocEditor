import { DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import { exec } from "../utils/exec";
import { HighLightBlock } from "../icons/highlight-block";
import { HIGHLIGHT_BLOCK_KEY } from "src/plugins/highlight-block/types";

export const HighLightBlockDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[HIGHLIGHT_BLOCK_KEY]) {
      return { element: HighLightBlock, config: { position: "lt" } };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, HIGHLIGHT_BLOCK_KEY);
      state.close();
    };
    return getWrappedBannerMenu(HighLightBlock, "高亮块", onClick);
  },
};
