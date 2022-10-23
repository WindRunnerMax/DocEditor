import ReactDOM from "react-dom";

export const maskMenuToolBar = (element: HTMLDivElement) => {
  element.style.opacity = "0";
  element.style.left = "-1000px";
  element.style.top = "-1000px";
};

export const getSelectionRect = () => {
  const domSelection = window.getSelection();
  if (domSelection && domSelection.rangeCount > 0) {
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    return rect;
  }
  return null;
};

export const Portal: React.FC = ({ children }) => {
  return typeof document === "object" ? ReactDOM.createPortal(children, document.body) : null;
};
