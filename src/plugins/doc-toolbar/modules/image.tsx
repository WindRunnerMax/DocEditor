import { DocToolbarPlugin } from "../types";
import { getWrappedBannerMenu } from "../utils/wrapper";
import { IconImage } from "@arco-design/web-react/icon";
import { exec } from "../utils/exec";
import { REACT_LIVE_KEY } from "src/plugins/react-live/types";
import { IMAGE_KEY } from "src/plugins/image/types";

export const ImageDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => null,
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine) return null;
    const onClick = () => {
      exec(state, IMAGE_KEY);
      state.close();
    };
    return getWrappedBannerMenu(<IconImage />, "图片", onClick);
  },
};
