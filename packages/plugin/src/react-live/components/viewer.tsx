import "../index.scss";

import { Button, Space, Spin } from "@arco-design/web-react";
import { useDebounceEffect } from "ahooks";
import type { EditorKit } from "doc-editor-core";
import { Void } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import type { FC } from "react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { compileWithSucrase, renderWithDependency, withSandbox } from "react-live-runtime";

import { collectText } from "../utils/parse";

export const ReactLiveView: FC<{
  element: BlockElement;
  editor: EditorKit;
}> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const code = collectText(props.editor.raw, props.element);

  useDebounceEffect(
    () => {
      const el = ref.current;
      if (!el) return;
      try {
        const sandbox = withSandbox({ React, Button, console, Space });
        // JS Plain Object -> ({...})
        // React.FC -> React.Fragment / div
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
