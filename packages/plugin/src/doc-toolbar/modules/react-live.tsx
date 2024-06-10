import { IconThunderbolt } from "@arco-design/web-react/icon";

import { REACT_LIVE_KEY } from "../../react-live/types";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedBannerMenu } from "../utils/wrapper";

export const ReactLiveDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[REACT_LIVE_KEY]) {
      return { element: <IconThunderbolt />, config: { position: "lt" } };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine || state.status.isInTableBlock) {
      return null;
    }
    const onClick = () => {
      exec(state, REACT_LIVE_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconThunderbolt />, "ReactLive", onClick);
  },
};
