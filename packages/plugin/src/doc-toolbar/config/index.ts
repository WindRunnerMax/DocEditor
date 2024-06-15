import { CodeBlockDocToolBarPlugin } from "../modules/code-block";
import { DefaultAddDocToolBarPlugin } from "../modules/default-add";
import { DividingLineDocToolBarPlugin } from "../modules/dividing-line";
import { FlowChartDocToolBarPlugin } from "../modules/flow-chart";
import { HeadingDocToolBarPlugin } from "../modules/heading";
import { HighLightBlockDocToolBarPlugin } from "../modules/hl-block";
import { ImageDocToolBarPlugin } from "../modules/image";
import { ListDocToolBarPlugin } from "../modules/list";
import { OperationDocToolBarPlugin } from "../modules/operation";
import { QuoteDocToolBarPlugin } from "../modules/quote";
import { ReactLiveDocToolBarPlugin } from "../modules/react-live";
import { TableDocToolBarPlugin } from "../modules/table";
import { TextDocToolBarPlugin } from "../modules/text";
import type { DocToolbarPlugin } from "../types";

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
