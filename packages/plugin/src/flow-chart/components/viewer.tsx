import { Button, Empty, Spin, Trigger } from "@arco-design/web-react";
import { IconDownload, IconEdit, IconPalette } from "@arco-design/web-react/icon";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { ReactEditor } from "doc-editor-delta";
import { setBlockNode } from "doc-editor-utils";
import { cs } from "doc-editor-utils";
import { useEffect, useRef, useState } from "react";

import { SelectionWrapper } from "../../shared/modules/selection";
import { FLOW_CHART_KEY } from "../types";
import { diagramDownload, diagramPreview, getSvg, makeEditor } from "../utils/loader";
import { xmlToString } from "../utils/utils";
import { PreviewWrapper } from "./preview";

export const DocFLowChart: React.FC<{
  element: BlockElement;
  readonly: boolean;
  editor: EditorKit;
  config: Required<BlockElement>[typeof FLOW_CHART_KEY];
}> = props => {
  const container = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorLoading, setEditorLoading] = useState(false);

  useEffect(() => {
    if (props.config.content) {
      const content = props.config.content;
      (async () => {
        const svg = await getSvg(content);
        const div = container.current;
        if (div && svg) {
          div.childNodes.forEach(node => div.removeChild(node));
          div.appendChild(svg);
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [props.config.content, props.readonly]);

  const startEdit = () => {
    setEditorLoading(true);
    const onChange = (xml: Node) => {
      const str = xmlToString(xml);
      if (!str) return void 0;
      const path = ReactEditor.findPath(props.editor.raw, props.element);
      setBlockNode(
        props.editor.raw,
        { [FLOW_CHART_KEY]: { type: "xml", content: str } },
        { at: path, key: FLOW_CHART_KEY }
      );
    };
    makeEditor("zh", props.config.content, onChange).then(r => {
      r.start();
      setEditorLoading(false);
    });
  };

  const preview = () => {
    return diagramPreview(props.config.content);
  };

  const download = () => {
    return diagramDownload(props.config.content);
  };

  const EditElement = (
    <div onClick={e => e.stopPropagation()} onMouseDown={e => e.preventDefault()}>
      <Button
        type="text"
        icon={<IconEdit />}
        size="small"
        loading={editorLoading}
        onClick={startEdit}
      >
        编辑
      </Button>
      <Button type="text" icon={<IconDownload />} size="small" onClick={download}>
        下载
      </Button>
    </div>
  );

  const Content = (
    <div className="flow-chart-container">
      {props.config.content ? <div ref={container}></div> : <Empty description="空白图形"></Empty>}
    </div>
  );

  return (
    <SelectionWrapper readonly={props.readonly}>
      <PreviewWrapper readonly={props.readonly} src={preview} disable={!props.config.content}>
        <div className={cs("doc-flow-chart")}>
          <Spin loading={loading}>
            <div className="flow-chart-title">
              <IconPalette />
              <span>流程图</span>
            </div>
            {props.readonly ? (
              Content
            ) : (
              <Trigger
                popup={() => EditElement}
                position="top"
                popupAlign={{ top: 5 }}
                className="flow-chart-toolbar"
              >
                {Content}
              </Trigger>
            )}
          </Spin>
        </div>
      </PreviewWrapper>
    </SelectionWrapper>
  );
};
