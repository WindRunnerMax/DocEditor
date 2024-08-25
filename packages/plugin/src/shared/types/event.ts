import type { EDITOR_EVENT, EventMap } from "doc-editor-core";

export type ContentChangeEvent = EventMap[typeof EDITOR_EVENT.CONTENT_CHANGE];
export type SelectChangeEvent = EventMap[typeof EDITOR_EVENT.SELECTION_CHANGE];
