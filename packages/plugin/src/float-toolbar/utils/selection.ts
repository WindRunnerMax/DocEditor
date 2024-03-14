import ReactDOM from "react-dom";
import { omit } from "src/utils/filter";

export const maskMenuToolBar = (element: HTMLDivElement) => {
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

export const execSelectMarks = (key: string, marks: string[], mutexKeys: string[]): string[] => {
  const isKeyInMarks = marks.indexOf(key) > -1;
  const isKeyInMutexKeys = mutexKeys.indexOf(key) > -1;
  return isKeyInMarks
    ? omit(marks, [key])
    : isKeyInMutexKeys
    ? [...omit(marks, mutexKeys), key]
    : [...marks, key];
};
