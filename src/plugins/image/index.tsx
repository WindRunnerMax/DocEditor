import "./index.scss";
import { EDITOR_ELEMENT_TYPE, Plugin } from "../../core/plugin/interface";
import { existKey, getPathById } from "../../core/ops/get";
import { setBlockNode, focusSelection } from "../../core/ops/set";
import { BaseEditor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { CommandFn } from "src/core/command";
import { v4 } from "uuid";
import { uploadImageHandler } from "./utils/upload";
import { HistoryEditor } from "slate-history";
import { DocImage } from "./components/doc-image";
import { IMAGE_KEY, IMAGE_STATUS } from "./types";

export const ImagePlugin = (
  editor: BaseEditor & ReactEditor & HistoryEditor,
  readonly: boolean,
  uploadHandler = uploadImageHandler
): Plugin => {
  const IMAGE_INPUT_DOM_ID = "doc-image-upload-input";

  const uploadImage = (files: FileList) => {
    Array.from(files).forEach(file => {
      const blobSRC = window.URL.createObjectURL(file);
      const uuid = v4();
      setBlockNode(editor, {
        uuid,
        [IMAGE_KEY]: { src: blobSRC, status: IMAGE_STATUS.LOADING },
        children: [{ text: "" }],
      });
      uploadHandler(file)
        .then(res => {
          const path = getPathById(editor, uuid);
          if (path) {
            HistoryEditor.withoutSaving(editor, () => {
              setBlockNode(
                editor,
                {
                  [IMAGE_KEY]: {
                    src: res.src,
                    status: IMAGE_STATUS.SUCCESS,
                    width: res.width,
                    height: res.height,
                  },
                },
                { at: path, key: IMAGE_KEY }
              );
            });
          }
        })
        .catch(() => {
          const path = getPathById(editor, uuid);
          if (path) {
            HistoryEditor.withoutSaving(editor, () => {
              setBlockNode(
                editor,
                { [IMAGE_KEY]: { src: void 0, status: IMAGE_STATUS.FAIL } },
                { at: path, key: IMAGE_KEY }
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
    key: IMAGE_KEY,
    type: EDITOR_ELEMENT_TYPE.BLOCK,
    command,
    match: props => existKey(props.element, IMAGE_KEY),
    render: context => (
      <DocImage editor={editor} element={context.element} readonly={readonly}></DocImage>
    ),
  };
};
