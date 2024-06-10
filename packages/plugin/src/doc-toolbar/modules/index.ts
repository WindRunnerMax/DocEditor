import type { DocToolbarPlugin } from "../types";
import { CodeBlockDocToolBarPlugin } from "./code-block";
import { DefaultAddDocToolBarPlugin } from "./default-add";
import { DividingLineDocToolBarPlugin } from "./dividing-line";
import { FlowChartDocToolBarPlugin } from "./flow-chart";
import { HeadingDocToolBarPlugin } from "./heading";
import { HighLightBlockDocToolBarPlugin } from "./hl-block";
import { ImageDocToolBarPlugin } from "./image";
import { ListDocToolBarPlugin } from "./list";
import { OperationDocToolBarPlugin } from "./operation";
import { QuoteDocToolBarPlugin } from "./quote";
import { ReactLiveDocToolBarPlugin } from "./react-live";
import { TableDocToolBarPlugin } from "./table";
import { TextDocToolBarPlugin } from "./text";

export const DOC_TOOLBAR_MODULES: DocToolbarPlugin[] = [
  TextDocToolBarPlugin,
  HeadingDocToolBarPlugin,
  QuoteDocToolBarPlugin,
  ListDocToolBarPlugin,
  DividingLineDocToolBarPlugin,
  ImageDocToolBarPlugin,
  TableDocToolBarPlugin,
  HighLightBlockDocToolBarPlugin,
  CodeBlockDocToolBarPlugin,
  FlowChartDocToolBarPlugin,
  ReactLiveDocToolBarPlugin,
  OperationDocToolBarPlugin,
  DefaultAddDocToolBarPlugin,
];
