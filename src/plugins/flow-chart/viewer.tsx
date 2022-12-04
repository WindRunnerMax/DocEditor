import { Empty, Spin, Trigger } from "@arco-design/web-react";
import { IconEdit, IconPalette } from "@arco-design/web-react/icon";
import { useEffect, useRef, useState } from "react";
import { BlockElement, Editor } from "slate";
import { ReactEditor, useFocused, useSelected } from "slate-react";
import { setBlockNode } from "src/core/ops/set";
import { cs } from "src/utils/classnames";
import { FLOW_CHART_KEY } from "./index";
import { diagramLoader } from "./diagram-loader";
import { normalizationXML } from "./utils";

export const DocFLowChart: React.FC<{
  element: BlockElement;
  isRender: boolean;
  editor: Editor;
  config: Required<BlockElement>[typeof FLOW_CHART_KEY];
}> = props => {
  const selected = useSelected();
  const focused = useFocused();

  const container = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.config.content) {
      const content = props.config.content;
      const render = () => {
        diagramLoader().then(res => {
          const svg = res.convertXMLToSVG(content);
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
  }, [props.config.content, props.isRender]);

  const startEdit = () => {
    diagramLoader().then(res => {
      const bus = new res.EditorBus({
        data: props.config.content,
        onSave: (xml: string) => {
          const str = normalizationXML(res.stringToXml, res.xmlToString, xml);
          if (str) {
            const path = ReactEditor.findPath(props.editor, props.element);
            setBlockNode(
              props.editor,
              { [FLOW_CHART_KEY]: { type: "xml", content: str } },
              { at: path, key: FLOW_CHART_KEY }
            );
          }
        },
      });
      bus.startEdit();
    });
  };

  const RenderElement = (
    <div className="flow-chart-container">
      {props.config.content ? <div ref={container}></div> : <Empty description="空白图形"></Empty>}
    </div>
  );

  const EditElement = (
    <div className="flow-chart-edit" onClick={startEdit}>
      <IconEdit />
      编辑
    </div>
  );

  return (
    <div className={cs("doc-flow-chart", focused && selected && "selected")}>
      <div className="flow-chart-title">
        <IconPalette />
        <span>流程图</span>
      </div>
      <Spin loading={loading}>
        {props.isRender ? (
          RenderElement
        ) : (
          <Trigger popup={() => EditElement} position="top" popupAlign={{ top: 5 }}>
            {RenderElement}
          </Trigger>
        )}
      </Spin>
    </div>
  );
};
