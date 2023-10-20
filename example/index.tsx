import ReactDOM from "react-dom";

import "./index.scss";
import "../src/styles/index";
import { SlateDocEditor } from "./components/doc-editor";
import { useState } from "react";
import { cs } from "../src/utils/classnames";
import { IconEdit, IconFile } from "@arco-design/web-react/icon";
import { ThemeAction } from "./components/theme-action";

export const App: React.FC = () => {
  const [readonly, setRender] = useState(false);

  return (
    <div className="doc-editor-container">
      <div className="header">
        <span className="left">Editor</span>
        <div className="right">
          <div onClick={() => setRender(!readonly)}>{readonly ? <IconEdit /> : <IconFile />}</div>
          <ThemeAction />
        </div>
      </div>
      <div className="gap"></div>
      <div className={cs("editor", readonly && "render")}>
        <div className="slate-editor">
          <SlateDocEditor readonly={readonly}></SlateDocEditor>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
