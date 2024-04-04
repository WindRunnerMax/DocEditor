import { useEffect, useMemo } from "react";

import { makeEditor } from "../editor";

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
