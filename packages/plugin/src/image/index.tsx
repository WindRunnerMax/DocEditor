import "./styles/index.scss";

import type { BlockContext, CopyContext, EditorKit, PasteContext } from "doc-editor-core";
import type { CommandFn } from "doc-editor-core";
import { BlockPlugin, isHTMLElement } from "doc-editor-core";
import type { BlockElement, RenderElementProps } from "doc-editor-delta";
import { Editor, HistoryEditor, Range, Transforms } from "doc-editor-delta";
import { existKey, getClosestBlockPath, getId, getUniqueId } from "doc-editor-utils";

import { isMatchTag } from "../clipboard/utils/is";
import { focusSelection } from "../shared/modules/selection";
import { DocImage } from "./components/doc-image";
import { IMAGE_KEY, IMAGE_STATUS } from "./types";
import { uploadImageHandler } from "./utils/upload";

export class ImagePlugin extends BlockPlugin {
  public key: string = IMAGE_KEY;
  private IMAGE_INPUT_DOM_ID = "doc-image-upload-input";

  constructor(
    private editor: EditorKit,
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
      // 基于`selection`的`path`处理图片位置
      const selection = this.editor.raw.selection;
      if (!selection || !Range.isCollapsed(selection)) return void 0;
      const at = selection.anchor.path;
      const path = getClosestBlockPath(editor.raw, at);
      if (!path) return void 0;
      // 异步上传 需要处理`Path Transform`
      const pathRef = Editor.pathRef(editor.raw, path);
      Transforms.setNodes(
        this.editor.raw,
        {
          uuid,
          [IMAGE_KEY]: { src: blobSRC, status: IMAGE_STATUS.LOADING },
          children: [{ text: "" }],
        },
        { at: path }
      );
      this.uploadHandler(file)
        .then(res => {
          const path = pathRef.unref();
          if (!path) return void 0;
          HistoryEditor.withoutSaving(editor.raw, () => {
            Transforms.setNodes(
              editor.raw,
              {
                [IMAGE_KEY]: {
                  src: res.src,
                  status: IMAGE_STATUS.SUCCESS,
                  width: res.width,
                  height: res.height,
                },
              },
              { at: path }
            );
          });
        })
        .catch(() => {
          const path = pathRef.unref();
          if (!path) return void 0;
          HistoryEditor.withoutSaving(editor.raw, () => {
            Transforms.setNodes(
              editor.raw,
              { [IMAGE_KEY]: { src: void 0, status: IMAGE_STATUS.FAIL } },
              { at: path }
            );
          });
        });
    });
  };

  public onCommand: CommandFn = data => {
    const editor = this.editor;
    let imageInput = document.getElementById(this.IMAGE_INPUT_DOM_ID);
    if (!imageInput) {
      imageInput = document.createElement("input");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("id", this.IMAGE_INPUT_DOM_ID);
      imageInput.setAttribute("class", this.IMAGE_INPUT_DOM_ID);
      imageInput.setAttribute("accept", "image/png, image/jpeg, image/svg+xml");
      document.body.append(imageInput);
    }
    imageInput.onchange = e => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      focusSelection(editor, data?.path);
      files && this.uploadImage(files);
      Transforms.insertNodes(editor.raw, { children: [{ text: "" }] });
    };
    imageInput.click();
  };

  public serialize(context: CopyContext): void {
    const element = context.node as BlockElement;
    const img = element[IMAGE_KEY];
    if (!img) return void 0;
    const node = document.createElement("img");
    node.src = img.src;
    node.setAttribute("data-type", IMAGE_KEY);
    node.appendChild(context.html);
    context.html = node;
  }

  public deserialize(context: PasteContext): void {
    const { html } = context;
    if (!isHTMLElement(html)) return void 0;
    if (isMatchTag(html, "img")) {
      const src = html.getAttribute("src") || "";
      const width = html.getAttribute("data-width") || 100;
      const height = html.getAttribute("data-height") || 100;
      context.nodes = [
        {
          [IMAGE_KEY]: {
            src: src,
            status: IMAGE_STATUS.SUCCESS,
            width: Number(width),
            height: Number(height),
          },
          uuid: getId(),
          children: [{ text: "" }],
        },
      ];
    }
  }

  public render(context: BlockContext): JSX.Element {
    return (
      <DocImage editor={this.editor} element={context.element} readonly={this.readonly}></DocImage>
    );
  }
}
