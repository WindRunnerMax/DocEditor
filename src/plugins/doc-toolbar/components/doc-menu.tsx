import "../index.scss";
import { Editor } from "slate";
import { IconPlus } from "@arco-design/web-react/icon";
import { Trigger } from "@arco-design/web-react";
import { EditorCommands } from "../../../core/command";
import { RenderElementProps } from "slate-react";
import { useState } from "react";
import { cs } from "src/utils/classnames";
import { DOC_TOOLBAR_MODULES } from "../modules";
import { DocToolBarState, DocToolbarPlugin } from "../types";

export const DocMenu: React.FC<{
  editor: Editor;
  element: RenderElementProps["element"];
  commands: EditorCommands;
}> = props => {
  const [visible, setVisible] = useState(false);

  const plugins = DOC_TOOLBAR_MODULES;

  const state: DocToolBarState = {
    editor: props.editor,
    element: props.element,
    commands: props.commands,
    status: {
      isInCodeBlock: false,
    },
    close: () => setVisible(false),
  };

  let HoverIconConfig: Exclude<ReturnType<DocToolbarPlugin["renderIcon"]>, null> = {
    element: <IconPlus />,
  };
  for (const plugin of plugins) {
    const config = plugin.renderIcon(state);
    if (config) {
      HoverIconConfig = config;
      break;
    }
  }

  return (
    <Trigger
      popup={() => (
        <Trigger
          className="doc-menu-popup"
          popup={() => <div></div>}
          position="left"
          popupVisible={visible}
          onVisibleChange={setVisible}
        >
          <span
            className="doc-icon-container"
            // prevent toolbar from taking focus away from editor
            onMouseDown={e => e.preventDefault()}
          >
            {HoverIconConfig.element}
          </span>
        </Trigger>
      )}
      position="left"
      mouseLeaveDelay={200}
      mouseEnterDelay={200}
      {...HoverIconConfig.config}
    >
      <div className={cs(visible && "doc-line-hover")}>{props.children}</div>
    </Trigger>
  );
};
