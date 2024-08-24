import type { EDITOR_EVENT, EventMap, WithStop } from "doc-editor-core";

export type ContentChangeEvent = WithStop<EventMap[typeof EDITOR_EVENT.CONTENT_CHANGE]>;
export type SelectChangeEvent = WithStop<EventMap[typeof EDITOR_EVENT.SELECTION_CHANGE]>;
