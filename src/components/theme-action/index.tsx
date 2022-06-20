import { IconDesktop, IconMoon, IconSun } from "@arco-design/web-react/icon";
import React, { FC, useEffect, useState } from "react";
import storage from "src/utils/storage";

const storageKey = "theme-index";
const darkThemeMatch = window.matchMedia("(prefers-color-scheme: dark)");
const list = [<IconDesktop />, <IconSun />, <IconMoon />];
const handler = (e: MediaQueryListEvent) => {
  if (e.matches) document.body.setAttribute("arco-theme", "dark");
  else document.body.removeAttribute("arco-theme");
};
export const ThemeAction: FC = () => {
  const [index, setIndex] = useState(storage().get<number>(storageKey) || 0);

  useEffect(() => {
    switch (index) {
      case 0: {
        if (darkThemeMatch.matches) document.body.setAttribute("arco-theme", "dark");
        else document.body.removeAttribute("arco-theme");
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

  const changeTheme = () => {
    const nextIndex = (index + 1) % list.length;
    setIndex(nextIndex);
    storage().set(storageKey, nextIndex);
  };

  return <div onClick={changeTheme}>{list[index]}</div>;
};
