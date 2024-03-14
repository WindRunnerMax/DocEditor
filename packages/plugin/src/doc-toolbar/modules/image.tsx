import { IconImage } from "@arco-design/web-react/icon";

import { IMAGE_KEY } from "../../image/types";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedBannerMenu } from "../utils/wrapper";

export const ImageDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[IMAGE_KEY]) {
      return { element: <IconImage />, config: { position: "lt" } };
    }
    return null;
  },
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
