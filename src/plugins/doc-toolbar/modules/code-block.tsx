import { DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import { IconCodeSquare } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import { CODE_BLOCK_KEY } from "src/plugins/codeblock/types";

export const CodeBlockDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => null,
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, CODE_BLOCK_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconCodeSquare />, "代码块", onClick);
  },
};
