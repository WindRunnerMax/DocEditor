import "./styles/index.scss";

import type { BlockContext, EditorKit } from "doc-editor-core";
import type { CommandFn } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { getUniqueId, setBlockNode } from "doc-editor-utils";
import { existKey } from "doc-editor-utils";

import { DocFLowChart } from "./components/viewer";
import { FLOW_CHART_KEY } from "./types";

export class FlowChartPlugin extends BlockPlugin {
  public key: string = FLOW_CHART_KEY;

  constructor(private editor: EditorKit, private readonly: boolean) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return existKey(props.element, FLOW_CHART_KEY);
  }

  public onCommand: CommandFn = () => {
    const uuid = getUniqueId();
    setBlockNode(this.editor.raw, {
      uuid,
      [FLOW_CHART_KEY]: { type: "xml" as const, content: "" },
      children: [{ text: "" }],
    });
  };

  public render(context: BlockContext): JSX.Element {
    const config = context.element[FLOW_CHART_KEY];
    if (!config) return context.children;
    return (
      <DocFLowChart
        element={context.element}
        readonly={this.readonly}
        config={config}
        editor={this.editor}
      ></DocFLowChart>
    );
  }
}
