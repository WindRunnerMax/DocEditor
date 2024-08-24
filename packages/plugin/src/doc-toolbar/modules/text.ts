import "../styles/menu.scss";

import { PARAGRAPH_KEY } from "../../paragraph/types";
import { TextIcon } from "../icons/text";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedSignalMenu } from "../utils/wrapper";

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
