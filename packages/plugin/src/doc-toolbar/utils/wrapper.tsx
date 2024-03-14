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
