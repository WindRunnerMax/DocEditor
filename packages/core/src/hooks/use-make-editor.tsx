import type { BaseNode } from "doc-editor-delta";
import { useEffect, useMemo } from "react";

import { EditorKit } from "../editor";
import type { EditorSchema } from "../schema/types";

export function makeEditor(config: EditorSchema, init?: BaseNode[]) {
  return new EditorKit(config, init);
}

export const useMakeEditor = (...args: Parameters<typeof makeEditor>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editor = useMemo(() => makeEditor(...args), []);

  useEffect(() => {
    return () => {
      editor.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return editor;
};
