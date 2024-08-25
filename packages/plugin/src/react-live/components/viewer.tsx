import { Button, Space, Spin } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import { Void } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { debounce } from "doc-editor-utils";
import { isText } from "doc-editor-utils";
import type { FC } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { compileWithSucrase, renderWithDependency, withSandbox } from "react-live-runtime";

export const ReactLiveView: FC<{
  element: BlockElement;
  editor: EditorKit;
}> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const code: string = useMemo(() => {
    const element = props.element;
    return element.children
      .map(line => {
        const children = line.children || [];
        return children.map(it => (isText(it) ? it.text : ""));
      })
      .join("\n");
  }, [props.element]);

  const onParseCode = useMemo(
    () =>
      debounce((code: string) => {
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
      }, 300),
    []
  );

  useEffect(() => onParseCode(code), [code, onParseCode]);

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
