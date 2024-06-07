import React, { useMemo } from "react";

import { DOC_TOOLBAR_MODULES } from "../modules/index";
import type { DocToolBarState } from "../types";

export const TriggerMenu: React.FC<{ state: DocToolBarState }> = props => {
  const { state } = props;

  const { signalMenu, bannerMenu } = useMemo(() => {
    const signalMenu: JSX.Element[] = [];
    const bannerMenu: JSX.Element[] = [];
    for (const plugin of DOC_TOOLBAR_MODULES) {
      const menu = plugin.renderSignal(state);
      const banner = plugin.renderBanner(state);
      menu && signalMenu.push(menu);
      banner && bannerMenu.push(banner);
    }
    return { signalMenu, bannerMenu };
  }, [state]);

  return (
    <div className="doc-trigger-menu">
      {signalMenu.length > 0 && (
        <div className="doc-trigger-signal-menu">
          {signalMenu.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </div>
      )}
      {bannerMenu.length > 0 && (
        <div className="doc-trigger-banner-menu">
          {bannerMenu.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
