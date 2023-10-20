import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { existKey } from "../../core/ops/get";
import { ReactEditor } from "slate-react";
import { CommandFn } from "src/core/command";
import { v4 } from "uuid";
import { HistoryEditor } from "slate-history";
import { BaseEditor, Transforms } from "slate";
import { DocFLowChart } from "./components/viewer";
import { FLOW_CHART_KEY } from "./types";

export const FlowChartPlugin = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  readonly: boolean
): Plugin => {
  const command: CommandFn = editor => {
    const uuid = v4();
    Transforms.insertNodes(editor, {
      uuid,
      [FLOW_CHART_KEY]: { type: "xml" as const, content: "" },
      children: [{ text: "" }],
    });
    Transforms.insertNodes(editor, { children: [{ text: "" }] });
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
