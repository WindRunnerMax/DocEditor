import { IconDesktop, IconMoon, IconSun } from "@arco-design/web-react/icon";
import { Storage } from "doc-editor-utils";
import type { FC } from "react";
import { useEffect, useState } from "react";

const storageKey = "theme-index";
const darkThemeMatch = window.matchMedia("(prefers-color-scheme: dark)");
const list = [<IconDesktop />, <IconSun />, <IconMoon />];

const handler = (e: MediaQueryListEvent) => {
  if (e.matches) {
    document.body.setAttribute("arco-theme", "dark");
  } else {
    document.body.removeAttribute("arco-theme");
  }
};

export const ThemeAction: FC = () => {
  const [index, setIndex] = useState(() => Storage.local.get<number>(storageKey) || 0);

  useEffect(() => {
    switch (index) {
      case 0: {
        if (darkThemeMatch.matches) {
          document.body.setAttribute("arco-theme", "dark");
        } else {
          document.body.removeAttribute("arco-theme");
        }
        darkThemeMatch.onchange = handler;
        break;
      }
      case 1: {
        darkThemeMatch.onchange = null;
        document.body.removeAttribute("arco-theme");
        break;
      }
      case 2: {
        darkThemeMatch.onchange = null;
        document.body.setAttribute("arco-theme", "dark");
        break;
      }
    }
  }, [index]);

  const onChangeTheme = () => {
    const nextIndex = (index + 1) % list.length;
    setIndex(nextIndex);
    Storage.local.set(storageKey, nextIndex);
  };

  return <div onClick={onChangeTheme}>{list[index]}</div>;
};
