import { useEffect, useMemo } from "react";

import { EditorKit } from "../editor";
import type { EditorOptions } from "../editor/types";
import type { EditorSchema } from "../schema/types";

export function makeEditor(config: EditorSchema, options?: Partial<EditorOptions>) {
  return new EditorKit(config, options);
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
