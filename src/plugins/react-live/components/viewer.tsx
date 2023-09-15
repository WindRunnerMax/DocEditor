import { BlockElement, Editor } from "slate";
import "../index.scss";
import React, { FC, useRef, useState } from "react";
import { collectText } from "../utils/parse";
import { Void } from "src/core/component";
import { Button, Spin } from "@arco-design/web-react";
import { useDebounceEffect } from "ahooks";
import { withSandbox, compileWithSucrase, renderWithDependency } from "react-live-runtime";
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
      const sandbox = withSandbox({ React, Button, console });
      const compiledCode = compileWithSucrase("<div>" + code + "</div>");
      const Component = renderWithDependency(compiledCode, sandbox) as JSX.Element;
      ReactDOM.render(Component, el);
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
