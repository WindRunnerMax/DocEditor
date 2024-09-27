import { isString } from "doc-editor-utils";
import type { DiagramEditor } from "embed-drawio/dist/es/core/editor";
import type { DiagramViewer } from "embed-drawio/dist/es/core/viewer";
import { makeSVGDownloader, svgToBase64 } from "embed-drawio/dist/es/utils/svg";
import { stringToXml } from "embed-drawio/dist/es/utils/xml";

let editor: typeof DiagramEditor | null = null;
export const loadEditor = async (): Promise<typeof DiagramEditor> => {
  if (editor) return Promise.resolve(editor);
  const res = await Promise.all([
    import(/* webpackChunkName: "embed-drawio-editor" */ "embed-drawio/dist/es/core/editor"),
    // @ts-expect-error css declaration
    import(/* webpackChunkName: "embed-drawio-css" */ "embed-drawio/dist/es/index.css"),
  ]);
  editor = res[0].DiagramEditor;
  return editor;
};

let viewer: typeof DiagramViewer | null = null;
export const loadViewer = async (): Promise<typeof DiagramViewer> => {
  if (viewer) return Promise.resolve(viewer);
  const res = await Promise.all([
    import(/* webpackChunkName: "embed-drawio-viewer" */ "embed-drawio/dist/es/core/viewer"),
  ]);
  viewer = res[0].DiagramViewer;
  return viewer;
};

export const getSvg = async (xml: XMLDocument | string): Promise<SVGElement | null> => {
  const Viewer = await loadViewer();
  const xmlDoc = isString(xml) ? stringToXml(xml) : xml;
  const viewer = new Viewer(xmlDoc);
  const svg = viewer.renderSVG(null, 1, 1);
  viewer.destroy();
  return svg;
};

export const makeEditor = async (
  lang: "en" | "zh",
  init: string | null,
  onSave: (xml: Element) => void
): Promise<{ start: () => void }> => {
  const Editor = await loadEditor();
  const onExit = () => editor.exit();
  const editor = new Editor(document.body, onExit);
  const intl = await Editor.getLang(lang);
  return {
    start: () => {
      editor.start(intl, init ? stringToXml(init) : null, onSave);
    },
  };
};

export const diagramPreview = async (xml: string) => {
  const Viewer = await loadViewer();
  const svg = Viewer.xmlToSvg(stringToXml(xml), "#fff");
  return svg && svgToBase64(svg);
};

export const diagramDownload = async (xml: string) => {
  const Viewer = await loadViewer();
  const svg = Viewer.xmlToSvg(stringToXml(xml), null);
  if (!svg) return void 0;
  const func = await makeSVGDownloader(svg);
  func && func();
};
