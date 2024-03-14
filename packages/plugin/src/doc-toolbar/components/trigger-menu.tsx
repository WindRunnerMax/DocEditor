import React from "react";
import { DOC_TOOLBAR_MODULES } from "../modules";
import type { DocToolBarState } from "../types";

export const TriggerMenu: React.FC<{ state: DocToolBarState }> = props => {
  const { state } = props;

  const signalMenu = [];
  const bannerMenu = [];
  const plugins = DOC_TOOLBAR_MODULES;
  for (const plugin of plugins) {
    const menu = plugin.renderSignal(state);
    const banner = plugin.renderBanner(state);
    menu && signalMenu.push(menu);
    banner && bannerMenu.push(banner);
  }

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
