import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { existKey } from "../../utils/slate-get";
import { BlockElement, Editor, Transforms } from "slate";
import { useFocused, useSelected } from "slate-react";
import { cs } from "src/utils/classnames";
import { CommandFn } from "src/utils/slate-commands";
import { Image as ArcoImage } from "@arco-design/web-react";
declare module "slate" {
  interface BlockElement {
    "image"?: {
      src: string;
      width?: number | string;
      height?: number | string;
    };
  }
}

export const imageKey = "image";
const DocImage: React.FC<{
  element: BlockElement;
  isRender: boolean;
}> = props => {
  const selected = useSelected();
  const focused = useFocused();
  const src = props.element.image && props.element.image.src;

  return (
    <div className={cs("doc-image", focused && selected && "selected")}>
      <ArcoImage src={src || void 0} preview={props.isRender}></ArcoImage>
    </div>
  );
};

export const ImagePlugin = (editor: Editor, isRender: boolean): Plugin => {
  const IMAGE_INPUT_DOM_ID = "doc-image-upload-input";

  const command: CommandFn = (editor, key) => {
    let imageInput = document.getElementById(IMAGE_INPUT_DOM_ID);
    if (!imageInput) {
      imageInput = document.createElement("input");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("class", IMAGE_INPUT_DOM_ID);
      imageInput.setAttribute("accept", "image/png, image/jpeg, image/svg+xml");
      document.body.append(imageInput);
    }
    imageInput.onchange = e => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      files &&
        Array.from(files).forEach(file => {
          const blobSRC = window.URL.createObjectURL(file);
          Transforms.insertNodes(editor, { [key]: { src: blobSRC }, children: [{ text: "" }] });
        });
      Transforms.insertNodes(editor, { children: [{ text: "" }] });
    };
    imageInput.click();
  };
  return {
    key: imageKey,
    isVoid: true,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command,
    match: props => existKey(props.element, imageKey),
    render: context => <DocImage element={context.element} isRender={isRender}></DocImage>,
  };
};
