import "./index.scss";

import type { EditorSuite } from "doc-editor-core";
import type { CommandFn } from "doc-editor-core";
import type { Plugin } from "doc-editor-core";
import { EDITOR_ELEMENT_TYPE } from "doc-editor-core";
import { getUniqueId, setBlockNode } from "doc-editor-utils";
import { existKey } from "doc-editor-utils";

import { DocFLowChart } from "./components/viewer";
import { FLOW_CHART_KEY } from "./types";

export const FlowChartPlugin = (editor: EditorSuite, readonly: boolean): Plugin => {
  const command: CommandFn = editor => {
    const uuid = getUniqueId();
    setBlockNode(editor, {
      uuid,
      [FLOW_CHART_KEY]: { type: "xml" as const, content: "" },
      children: [{ text: "" }],
    });
  };
  return {
    key: FLOW_CHART_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command,
    match: props => existKey(props.element, FLOW_CHART_KEY),
    render: context => {
      const config = context.element[FLOW_CHART_KEY];
      if (!config) return context.children;
      return (
        <DocFLowChart
          element={context.element}
          readonly={readonly}
          config={config}
          editor={editor}
        ></DocFLowChart>
      );
    },
  };
};
