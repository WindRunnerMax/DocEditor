import type * as Diagram from "embed-drawio";
import ReactDOM from "react-dom";
import { isString } from "src/utils/is";
let instance: typeof Diagram | null = null;

export const diagramLoader = (): Promise<typeof Diagram> => {
  if (instance) return Promise.resolve(instance);
  return Promise.all([
    import(/* webpackChunkName: "embed-drawio" */ "embed-drawio"),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import(/* webpackChunkName: "embed-drawio-css" */ "embed-drawio/dist/index.css"),
  ]).then(res => (instance = res[0]));
};

export const getSvg = (xml: XMLDocument | string): Promise<SVGElement | null> => {
  return diagramLoader().then(({ DiagramViewer, stringToXml }) => {
    const xmlDoc = isString(xml) ? stringToXml(xml) : xml;
    const viewer = new DiagramViewer(xmlDoc);
    return viewer.renderSVG(null, 1, 1);
  });
};

export const diagramEditor = (
  lang: "en",
  init: string | null,
  onSave: (xml: Element) => void
): Promise<{ start: () => void }> => {
  return diagramLoader()
    .then(({ stringToXml, DiagramEditor, getLanguage }) => {
      const renderExit = (el: HTMLDivElement) => {
        ReactDOM.render(
          <div onClick={diagramEditor.exit} className="diagram-exit-btn">
            Exit
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
