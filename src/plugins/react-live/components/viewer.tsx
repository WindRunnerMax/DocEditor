import { BlockElement, Editor } from "slate";
import "../index.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import { collectText } from "../utils/parse";
import { Void } from "src/core/component";
import { Button, Space, Spin } from "@arco-design/web-react";
import { useDebounceEffect } from "ahooks";
import { withSandbox } from "react-live-runtime/dist/utils/sandbox";
import { compileWithSucrase } from "react-live-runtime/dist/compiler/sucrase";
import { renderWithDependency } from "react-live-runtime/dist/renderer/dependency";
import ReactDOM from "react-dom";

export const ReactLiveView: FC<{
  element: BlockElement;
  editor: Editor;
}> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const code = collectText(props.editor, props.element);

  useDebounceEffect(
    () => {
      const el = ref.current;
      if (!el) return;
      try {
        const sandbox = withSandbox({ React, Button, console, Space });
        const compiledCode = compileWithSucrase("<div>" + code + "</div>");
        const Component = renderWithDependency(compiledCode, sandbox) as JSX.Element;
        const App = () => {
          useEffect(() => {
            setLoading(false);
          }, []);
          return Component;
        };
        ReactDOM.render(<App></App>, el);
      } catch (error) {
        console.log("Render Component Error", error);
      }
    },
    [code],
    { wait: 300 }
  );

  return (
    <div className="react-live-container">
      <Void selectable>
        <Spin loading={loading} className="react-live-preview">
          <div ref={ref}></div>
        </Spin>
      </Void>
      <div className="react-live-code">{props.children}</div>
    </div>
  );
};
