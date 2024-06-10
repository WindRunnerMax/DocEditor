import { IconApps } from "@arco-design/web-react/icon";
import { TABLE_BLOCK_KEY } from "doc-editor-plugin";

import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedBannerMenu } from "../utils/wrapper";

export const TableDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[TABLE_BLOCK_KEY]) {
      return {
        element: <IconApps />,
        config: { position: "lt", style: { marginTop: -15, marginLeft: 5 } },
      };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, TABLE_BLOCK_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconApps />, "表格[WIP]", onClick);
  },
};
