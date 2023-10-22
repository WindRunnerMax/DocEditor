import { DocToolbarPlugin } from "../types";
import { CodeBlockDocToolBarPlugin } from "./code-block";
import { DefaultAddDocToolBarPlugin } from "./default-add";
import { DividingLineDocToolBarPlugin } from "./dividing-line";
import { FlowChartDocToolBarPlugin } from "./flow-chart";
import { HeadingDocToolBarPlugin } from "./heading";
import { HighLightBlockDocToolBarPlugin } from "./highlight-block";
import { ImageDocToolBarPlugin } from "./image";
import { ListDocToolBarPlugin } from "./list";
import { QuoteDocToolBarPlugin } from "./quote";
import { ReactLiveDocToolBarPlugin } from "./react-live";
import { TextDocToolBarPlugin } from "./text";

export const DOC_TOOLBAR_MODULES: DocToolbarPlugin[] = [
  TextDocToolBarPlugin,
  HeadingDocToolBarPlugin,
  QuoteDocToolBarPlugin,
  ListDocToolBarPlugin,
  DividingLineDocToolBarPlugin,
  ImageDocToolBarPlugin,
  HighLightBlockDocToolBarPlugin,
  CodeBlockDocToolBarPlugin,
  FlowChartDocToolBarPlugin,
  ReactLiveDocToolBarPlugin,
  DefaultAddDocToolBarPlugin,
];
