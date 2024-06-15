import type { TriggerProps } from "@arco-design/web-react";
import { Trigger } from "@arco-design/web-react";
import { IconRight } from "@arco-design/web-react/icon";

export const getWrappedSignalMenu = (element: JSX.Element, onClick: () => void) => {
  return (
    <div className="toolbar-signal-menu" onClick={onClick}>
      {element}
    </div>
  );
};

export const getWrappedBannerMenu = (element: JSX.Element, name: string, onClick: () => void) => {
  return (
    <div className="toolbar-banner-menu" onClick={onClick}>
      <span className="banner-menu-icon">{element}</span>
      <span className="banner-menu-name">{name}</span>
    </div>
  );
};

export const getWrappedBannerMenuWithTrigger = (
  element: JSX.Element,
  name: string,
  onClick: () => void,
  triggerProps: TriggerProps
) => {
  return (
    <Trigger {...triggerProps} position="right" popupAlign={{ right: 10 }}>
      <div className="toolbar-banner-menu flex-space-between" onClick={onClick}>
        <div className="toolbar-banner-menu-left">
          <span className="banner-menu-icon">{element}</span>
          <span className="banner-menu-name">{name}</span>
        </div>
        <div className="toolbar-banner-menu-right">
          <IconRight></IconRight>
        </div>
      </div>
    </Trigger>
  );
};
