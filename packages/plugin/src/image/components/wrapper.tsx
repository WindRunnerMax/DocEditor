import "../styles/wrapper.scss";

import { Image } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import type { BlockElement } from "doc-editor-delta";
import { findNodePath, setBlockNode } from "doc-editor-utils";
import { cs } from "doc-editor-utils";
import type { FC } from "react";
import { useRef, useState } from "react";

import { IMAGE_KEY } from "../types";

const Preview = Image.Preview;
export const ImageWrapper: FC<{
  element: BlockElement;
  readonly: boolean;
  selected?: boolean;
  disable?: boolean;
  src: string;
  editor: EditorKit;
}> = props => {
  const [src, setSrc] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const id = props.element.uuid;

  const needPreview = !props.disable && (props.readonly || props.selected);

  const preview = async () => {
    if (needPreview) {
      const src = props.src;
      setSrc(src || "");
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const resider = e.target;
    const element = ref.current;
    const config = props.element[IMAGE_KEY];
    e.stopPropagation();
    e.preventDefault();
    if (resider instanceof HTMLDivElement && resider.dataset.type && element && id && config) {
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;
      const ratio = startWidth / startHeight;
      const type = resider.dataset.type;
      const path = findNodePath(props.editor.raw, props.element);
      if (!path) return;
      const onMouseMove = (e: MouseEvent) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        let width = startWidth;
        let height = startHeight;
        switch (type) {
          case "lt":
            width -= diffX;
            height -= diffY;
            break;
          case "rt":
            width += diffX;
            height -= diffY;
            break;
          case "lb":
            width -= diffX;
            height += diffY;
            break;
          case "rb":
            width += diffX;
            height += diffY;
            break;
        }
        if (width / height > ratio) {
          height = width / ratio;
        } else {
          width = height * ratio;
        }
        setBlockNode(
          props.editor.raw,
          {
            [IMAGE_KEY]: { ...config, width: Math.max(width, 50), height: Math.max(height, 50) },
          },
          { at: path, key: IMAGE_KEY }
        );
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  return (
    <>
      {src && <Preview src={src} visible={!!src} onVisibleChange={v => !v && setSrc("")} />}
      {!props.readonly && (
        <>
          <div
            className={cs(needPreview && "doc-image-resider")}
            data-type="lt"
            onMouseDown={onMouseDown}
          ></div>
          <div
            className={cs(needPreview && "doc-image-resider")}
            data-type="rt"
            onMouseDown={onMouseDown}
          ></div>
          <div
            className={cs(needPreview && "doc-image-resider")}
            data-type="lb"
            onMouseDown={onMouseDown}
          ></div>
          <div
            className={cs(needPreview && "doc-image-resider")}
            data-type="rb"
            onMouseDown={onMouseDown}
          ></div>
        </>
      )}
      <div ref={ref} onClick={preview} className={cs(needPreview && "doc-image-preview")}>
        {props.children}
      </div>
    </>
  );
};
