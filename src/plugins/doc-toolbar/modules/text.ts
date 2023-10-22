import { PARAGRAPH_KEY } from "src/plugins/paragraph/types";
import { TextIcon } from "../icons/text";
import { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedSignalMenu } from "../utils/wrapper";
import { getBlockAttributes } from "src/core/ops/get";
import { setUnBlockNode } from "src/core/ops/set";

export const TextDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: () => null,
  renderSignal: state => {
    if (state.status.isBlock) return null;
    const onClick = () => {
      exec(state, PARAGRAPH_KEY);
      state.close();
    };
    return getWrappedSignalMenu(TextIcon, onClick);
  },
  renderBanner: () => null,
};
