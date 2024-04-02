import type { BaseNode } from "doc-editor-delta";
import { Editable as EditableFC, EditorProvider } from "doc-editor-delta";
import React from "react";

import type { EditorSuite } from "../editor/types";
import type { RenderPlugins } from "../plugin/types";

type EditableProps = {
  readonly?: boolean;
  editor: EditorSuite;
  placeholder?: string;
  onChange?: (value: BaseNode[]) => void;
};
export class Editable extends React.PureComponent<EditableProps> {
  private renderModule: RenderPlugins;
  constructor(props: EditableProps) {
    super(props);
    this.renderModule = this.props.editor.plugin.apply();
  }

  componentWillUnmount(): void {
    this.props.editor.destroy();
  }

  componentDidUpdate(prevProps: EditableProps): void {
    if (prevProps.editor !== this.props.editor) {
      prevProps.editor.destroy();
      this.props.editor.logger.warning("Editor实例重建 请检查编辑器状态");
    }
  }

  render() {
    return (
      <EditorProvider
        editor={this.props.editor}
        value={this.props.editor.init || []}
        onChange={this.props.onChange}
      >
        <EditableFC
          decorate={this.renderModule.decorate}
          renderElement={this.renderModule.renderElement}
          renderLeaf={this.renderModule.renderLeaf}
          readOnly={this.props.readonly}
          placeholder={this.props.placeholder}
          onKeyDown={this.renderModule.onKeyDown}
        />
      </EditorProvider>
    );
  }
}
