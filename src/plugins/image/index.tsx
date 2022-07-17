import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../utils/slate-plugins";
import { existKey, getPathByUUID } from "../../utils/slate-get";
import { setBlockNode, focusSelection } from "../../utils/slate-set";
import { BaseEditor, BlockElement, Transforms } from "slate";
import { ReactEditor, useFocused, useSelected } from "slate-react";
import { cs } from "src/utils/classnames";
import { CommandFn } from "src/utils/slate-commands";
import { Image as ArcoImage, Spin } from "@arco-design/web-react";
import { v4 } from "uuid";
import { uploadImageHandler } from "./utils";
import { HistoryEditor } from "slate-history";

enum ImageStatus {
  LOADING = 1,
  SUCCESS = 2,
  FAIL = 3,
}
declare module "slate" {
  interface BlockElement {
    uuid?: string;
    image?: {
      status: ImageStatus;
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
  if (!props.element.image) return null;
  const config = props.element.image;

  return (
    <Spin loading={config.status === ImageStatus.LOADING}>
      <div className={cs("doc-image", focused && selected && "selected")}>
        <ArcoImage src={config.src} preview={props.isRender}></ArcoImage>
      </div>
    </Spin>
  );
};

export const ImagePlugin = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  isRender: boolean,
  uploadHandler = uploadImageHandler
): Plugin => {
  const IMAGE_INPUT_DOM_ID = "doc-image-upload-input";

  const uploadImage = (files: FileList) => {
    Array.from(files).forEach(file => {
      const blobSRC = window.URL.createObjectURL(file);
      const uuid = v4();
      Transforms.insertNodes(editor, {
        uuid,
        [imageKey]: { src: blobSRC, status: ImageStatus.LOADING },
        children: [{ text: "" }],
      });
      uploadHandler(file)
        .then(res => {
          const path = getPathByUUID(editor, uuid);
          if (path) {
            HistoryEditor.withoutSaving(editor, () => {
              setBlockNode(
                editor,
                { [imageKey]: { src: res.src, status: ImageStatus.SUCCESS } },
                { at: path, key: imageKey }
              );
            });
          }
        })
        .catch(() => {
          const path = getPathByUUID(editor, uuid);
          if (path) {
            HistoryEditor.withoutSaving(editor, () => {
              setBlockNode(
                editor,
                { [imageKey]: { src: void 0, status: ImageStatus.FAIL } },
                { at: path, key: imageKey }
              );
            });
          }
        });
    });
  };

  const command: CommandFn = (editor, _, data) => {
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
      focusSelection(editor, data?.path);
      files && uploadImage(files);
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
