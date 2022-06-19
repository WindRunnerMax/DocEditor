import "./App.scss";
import SlateDocEditor from "src/views";
import { useRef } from "react";
import { cs } from "./utils/classnames";

export const App: React.FC = () => {
  const isRender = useRef(false);

  if (/render\/?$/.test(location.pathname)) isRender.current = true;

  return (
    <div className="doc-editor-container">
      <div className="header">
        <span>Editor</span>
      </div>
      <div className="gap"></div>
      <div className={cs("editor", isRender.current && "render")}>
        <SlateDocEditor isRender={isRender.current}></SlateDocEditor>
      </div>
    </div>
  );
};
