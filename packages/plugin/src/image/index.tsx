import "./index.scss";

import type { BlockContext, EditorSuite } from "doc-editor-core";
import type { CommandFn } from "doc-editor-core";
import { BlockPlugin } from "doc-editor-core";
import type { RenderElementProps } from "doc-editor-delta";
import { HistoryEditor, Transforms } from "doc-editor-delta";
import { existKey, getPathById, getUniqueId } from "doc-editor-utils";
import { setBlockNode } from "doc-editor-utils";

import { focusSelection } from "../utils/selection";
import { DocImage } from "./components/doc-image";
import { IMAGE_KEY, IMAGE_STATUS } from "./types";
import { uploadImageHandler } from "./utils/upload";

export class ImagePlugin extends BlockPlugin {
  public key: string = IMAGE_KEY;
  private IMAGE_INPUT_DOM_ID = "doc-image-upload-input";

  constructor(
    private editor: EditorSuite,
    private readonly: boolean,
    private uploadHandler = uploadImageHandler
  ) {
    super();
  }

  public destroy(): void {}

  public match(props: RenderElementProps): boolean {
    return existKey(props.element, IMAGE_KEY);
  }

  private uploadImage = (files: FileList) => {
    const editor = this.editor;
    Array.from(files).forEach(file => {
      const blobSRC = window.URL.createObjectURL(file);
      const uuid = getUniqueId();
      setBlockNode(editor, {
        uuid,
        [IMAGE_KEY]: { src: blobSRC, status: IMAGE_STATUS.LOADING },
        children: [{ text: "" }],
      });
      this.uploadHandler(file)
        .then(res => {
          const path = getPathById(editor, uuid);
          if (!path) return void 0;
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
        })
        .catch(() => {
          const path = getPathById(editor, uuid);
          if (!path) return void 0;
          HistoryEditor.withoutSaving(editor, () => {
            setBlockNode(
              editor,
              { [IMAGE_KEY]: { src: void 0, status: IMAGE_STATUS.FAIL } },
              { at: path, key: IMAGE_KEY }
            );
          });
        });
    });
  };

  public onCommand: CommandFn = (editor, _, data) => {
    let imageInput = document.getElementById(this.IMAGE_INPUT_DOM_ID);
    if (!imageInput) {
      imageInput = document.createElement("input");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("class", this.IMAGE_INPUT_DOM_ID);
      imageInput.setAttribute("accept", "image/png, image/jpeg, image/svg+xml");
      document.body.append(imageInput);
    }
    imageInput.onchange = e => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      focusSelection(editor, data?.path);
      files && this.uploadImage(files);
      Transforms.insertNodes(editor, { children: [{ text: "" }] });
    };
    imageInput.click();
  };

  public render(context: BlockContext): JSX.Element {
    return (
      <DocImage editor={this.editor} element={context.element} readonly={this.readonly}></DocImage>
    );
  }
}
