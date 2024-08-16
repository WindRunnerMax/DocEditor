import type { BaseNode } from "doc-editor-delta";
import { Editable as EditableFC, EditorProvider } from "doc-editor-delta";
import React from "react";

import type { EditorKit } from "../editor/";
import { INIT_NODE } from "../editor/constant";
import { EDITOR_EVENT } from "../event/bus/action";
import type { ApplyPlugins } from "../plugin/types/apply";
import { EDITOR_STATE } from "../state/types";
import { WithContext } from "./with-context";

type EditableProps = {
  readonly?: boolean;
  init?: BaseNode[];
  editor: EditorKit;
  placeholder?: string;
  onChange?: (value: BaseNode[]) => void;
};

type EditableState = {
  renderModule: ApplyPlugins;
};

export class Editable extends React.PureComponent<EditableProps, EditableState> {
  constructor(props: EditableProps) {
    super(props);
    props.editor.state.set(EDITOR_STATE.READ_ONLY, !!props.readonly);
    this.state = {
      renderModule: this.props.editor.plugin.apply(),
    };
  }

  componentDidUpdate(prevProps: EditableProps): void {
    if (prevProps.readonly !== this.props.readonly) {
      this.props.editor.state.set(EDITOR_STATE.READ_ONLY, !!this.props.readonly);
      this.setState({
        renderModule: this.props.editor.plugin.apply(),
      });
    }
    if (prevProps.editor !== this.props.editor) {
      prevProps.editor.destroy();
      this.props.editor.logger.warning("Editor实例重建 请检查编辑器状态");
    }
  }

  private onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return void 0;
    this.props.editor.event.trigger(EDITOR_EVENT.KEY_DOWN, event);
  };

  private onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.KEY_PRESS, event);
  };

  private onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.MOUSE_DOWN, event);
  };

  private onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.MOUSE_UP, event);
  };

  private onCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.COPY, event);
  };

  private onCut = (event: React.ClipboardEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.CUT, event);
  };

  private onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.PASTE, event);
  };

  private onFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.FOCUS, event);
  };

  private onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    this.props.editor.event.trigger(EDITOR_EVENT.BLUR, event);
  };

  render() {
    return (
      <EditorProvider
        editor={this.props.editor.raw}
        value={this.props.init || this.props.editor.options.init || INIT_NODE}
        onChange={this.props.onChange}
      >
        <WithContext editor={this.props.editor}>
          <EditableFC
            decorate={this.state.renderModule.decorate}
            renderElement={this.state.renderModule.renderBlock}
            renderLeaf={this.state.renderModule.renderLeaf}
            readOnly={this.props.readonly}
            placeholder={this.props.placeholder}
            onKeyDown={this.onKeyDown}
            onKeyPress={this.onKeyPress}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onCopy={this.onCopy}
            onCut={this.onCut}
            onPaste={this.onPaste}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
        </WithContext>
      </EditorProvider>
    );
  }
}
