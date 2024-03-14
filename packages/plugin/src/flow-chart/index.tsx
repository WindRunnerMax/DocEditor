import "./index.scss";
import type { Plugin } from "../../core/plugin/interface";
import { EDITOR_ELEMENT_TYPE } from "../../core/plugin/interface";
import { existKey } from "../../core/ops/get";
import type { ReactEditor } from "slate-react";
import type { CommandFn } from "src/core/command";
import { v4 } from "uuid";
import type { HistoryEditor } from "slate-history";
import type { BaseEditor } from "slate";
import { DocFLowChart } from "./components/viewer";
import { FLOW_CHART_KEY } from "./types";
import { setBlockNode } from "src/core/ops/set";

export const FlowChartPlugin = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  readonly: boolean
): Plugin => {
  const command: CommandFn = editor => {
    const uuid = v4();
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
