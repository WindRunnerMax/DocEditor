import { Button, Empty, Spin, Trigger } from "@arco-design/web-react";
import { IconDownload, IconEdit, IconPalette } from "@arco-design/web-react/icon";
import { useEffect, useRef, useState } from "react";
import { BlockElement, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { setBlockNode } from "src/core/ops/set";
import { cs } from "src/utils/classnames";
import { FLOW_CHART_KEY } from "../index";
import { diagramDownload, diagramEditor, diagramPreview, getSvg } from "../utils/diagram-loader";
import { xmlToString } from "../utils/utils";
import { SelectionWrapper } from "src/components/selection-wrapper";
import { PreviewWrapper } from "./preview";

export const DocFLowChart: React.FC<{
  element: BlockElement;
  readonly: boolean;
  editor: Editor;
  config: Required<BlockElement>[typeof FLOW_CHART_KEY];
}> = props => {
  const container = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorLoading, setEditorLoading] = useState(false);

  useEffect(() => {
    if (props.config.content) {
      const content = props.config.content;
      const render = () => {
        getSvg(content).then(svg => {
          const div = container.current;
          if (div && svg) {
            div.childNodes.forEach(node => div.removeChild(node));
            div.appendChild(svg);
            setLoading(false);
          }
        });
      };
      render();
    } else {
      setLoading(false);
    }
  }, [props.config.content, props.readonly]);

  const startEdit = () => {
    setEditorLoading(true);
    diagramEditor("zh", props.config.content, (xml: Node) => {
      const str = xmlToString(xml);
      if (str) {
        const path = ReactEditor.findPath(props.editor, props.element);
        setBlockNode(
          props.editor,
          { [FLOW_CHART_KEY]: { type: "xml", content: str } },
          { at: path, key: FLOW_CHART_KEY }
        );
      }
    }).then(r => {
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
