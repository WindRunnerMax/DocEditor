import { Spin } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";

import { SelectionWrapper } from "../../shared/modules/selection";
import { IMAGE_STATUS } from "../types";
import { ImageWrapper } from "./wrapper";

export const DocImage: React.FC<{
  element: BlockElement;
  readonly: boolean;
  editor: EditorKit;
}> = props => {
  if (!props.element.image) return null;
  const config = props.element.image;

  return (
    <Spin loading={config.status === IMAGE_STATUS.LOADING}>
      <SelectionWrapper readonly={props.readonly} className="doc-image">
        <ImageWrapper
          editor={props.editor}
          element={props.element}
          readonly={props.readonly}
          src={config.src}
        >
          <img src={config.src} width={config.width} height={config.height} />
        </ImageWrapper>
      </SelectionWrapper>
    </Spin>
  );
};
