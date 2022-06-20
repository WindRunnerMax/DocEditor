import "./App.scss";
import SlateDocEditor from "src/views";
import { useRef } from "react";
import { cs } from "./utils/classnames";
import { IconFile } from "@arco-design/web-react/icon";
import { ThemeAction } from "./components/theme-action";

export const App: React.FC = () => {
  const isRender = useRef(false);

  if (/render/.test(location.hash)) isRender.current = true;

  return (
    <div className="doc-editor-container">
      <div className="header">
        <span className="left">Editor</span>
        <div className="right">
          <div>
            <IconFile onClick={() => window.open("./#render", "_blank")} />
          </div>
          <ThemeAction />
        </div>
      </div>
      <div className="gap"></div>
      <div className={cs("editor", isRender.current && "render")}>
        <SlateDocEditor isRender={isRender.current}></SlateDocEditor>
      </div>
    </div>
  );
};
