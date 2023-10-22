import { DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import { IconThunderbolt } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import { REACT_LIVE_KEY } from "src/plugins/react-live/types";

export const ReactLiveDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[REACT_LIVE_KEY]) {
      return { element: <IconThunderbolt />, config: { position: "lt" } };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, REACT_LIVE_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconThunderbolt />, "ReactLive", onClick);
  },
};
