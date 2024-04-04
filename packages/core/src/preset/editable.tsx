import type { BaseNode } from "doc-editor-delta";
import { Editable as EditableFC, EditorProvider } from "doc-editor-delta";
import React from "react";

import { INIT_NODE } from "../editor/constant";
import type { EditorSuite } from "../editor/types";
import type { RenderPlugins } from "../plugin/types";

type EditableProps = {
  readonly?: boolean;
  init?: BaseNode[];
  editor: EditorSuite;
  placeholder?: string;
  onChange?: (value: BaseNode[]) => void;
};

type EditableState = {
  renderModule: RenderPlugins;
};

export class Editable extends React.PureComponent<EditableProps, EditableState> {
  constructor(props: EditableProps) {
    super(props);
    this.state = {
      renderModule: this.props.editor.plugin.apply(),
    };
  }

  componentDidUpdate(prevProps: EditableProps): void {
    if (prevProps.readonly !== this.props.readonly) {
      this.setState({
        renderModule: this.props.editor.plugin.apply(),
      });
    }
    if (prevProps.editor !== this.props.editor) {
      prevProps.editor.destroy();
      this.props.editor.logger.warning("Editor实例重建 请检查编辑器状态");
    }
  }

  render() {
    return (
      <EditorProvider
        editor={this.props.editor}
        value={this.props.init || this.props.editor.init || INIT_NODE}
        onChange={this.props.onChange}
      >
        <EditableFC
          decorate={this.state.renderModule.decorate}
          renderElement={this.state.renderModule.renderElement}
          renderLeaf={this.state.renderModule.renderLeaf}
          readOnly={this.props.readonly}
          placeholder={this.props.placeholder}
          onKeyDown={this.state.renderModule.onKeyDown}
        />
      </EditorProvider>
    );
  }
}
