import { isString } from "doc-editor-utils";
import type * as DiagramEditor from "embed-drawio/dist/packages/core/diagram-editor";
import type * as DiagramViewer from "embed-drawio/dist/packages/core/diagram-viewer";
import ReactDOM from "react-dom";

let editor: typeof DiagramEditor | null = null;
export const diagramEditorLoader = (): Promise<typeof DiagramEditor> => {
  if (editor) return Promise.resolve(editor);
  return Promise.all([
    import(
      /* webpackChunkName: "embed-drawio-editor" */ "embed-drawio/dist/packages/core/diagram-editor"
    ),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import(/* webpackChunkName: "embed-drawio-css" */ "embed-drawio/dist/index.css"),
  ]).then(res => (editor = res[0]));
};

let viewer: typeof DiagramViewer | null = null;
export const diagramViewerLoader = (): Promise<typeof DiagramViewer> => {
  if (viewer) return Promise.resolve(viewer);
  return Promise.all([
    import(
      /* webpackChunkName: "embed-drawio-viewer" */ "embed-drawio/dist/packages/core/diagram-viewer"
    ),
  ]).then(res => (viewer = res[0]));
};

export const getSvg = (xml: XMLDocument | string): Promise<SVGElement | null> => {
  return diagramViewerLoader().then(({ DiagramViewer, stringToXml }) => {
    const xmlDoc = isString(xml) ? stringToXml(xml) : xml;
    const viewer = new DiagramViewer(xmlDoc);
    return viewer.renderSVG(null, 1, 1);
  });
};

export const diagramEditor = (
  lang: "en" | "zh",
  init: string | null,
  onSave: (xml: Element) => void
): Promise<{ start: () => void }> => {
  return diagramEditorLoader()
    .then(({ stringToXml, DiagramEditor, getLanguage }) => {
      const renderExit = (el: HTMLDivElement) => {
        ReactDOM.render(
          <div onClick={diagramEditor.exit} className="diagram-exit-btn">
            退出
          </div>,
          el
        );
      };
      const diagramEditor = new DiagramEditor(document.body, renderExit);
      return getLanguage(lang).then(res => ({ res, stringToXml, diagramEditor }));
    })
    .then(({ res, stringToXml, diagramEditor }) => ({
      start: () => {
        diagramEditor.start(res, init ? stringToXml(init) : null, onSave);
      },
    }));
};

export const diagramPreview = (xml: string) => {
  return diagramViewerLoader().then(({ convertSVGToBase64 }) => convertSVGToBase64(xml));
};

export const diagramDownload = (xml: string) => {
  return diagramViewerLoader()
    .then(({ downloadSVG }) => downloadSVG(xml))
    .then(res => res && res());
};
