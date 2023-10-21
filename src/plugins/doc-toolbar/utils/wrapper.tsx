export const getWrappedSignalMenu = (element: JSX.Element, onClick: () => void) => {
  return (
    <>
      <div className="toolbar-signal-menu" onClick={onClick}>
        {element}
      </div>
    </>
  );
};
