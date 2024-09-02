import type { TriggerProps } from "@arco-design/web-react";
import { Trigger as ArcoTrigger } from "@arco-design/web-react";
import type { FC } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useMemoFn } from "../hooks/preset";

type ContextProps = { lock: () => void; unlock: () => void };
const Context = createContext<ContextProps>({
  lock: () => null,
  unlock: () => null,
});

export const TriggerContext: FC<TriggerProps> = props => {
  const { children, ...rest } = props;
  const context = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [prevVisible, setPrevVisible] = useState(true);
  const popupVisible = rest.popupVisible === void 0 ? visible : rest.popupVisible;

  const lock = useMemoFn(() => {
    setPrevVisible(false);
  });

  const unlock = useMemoFn(() => {
    setPrevVisible(true);
  });

  const provider = useMemo(() => ({ lock, unlock }), [lock, unlock]);

  const onVisibleChange = useMemoFn((v: boolean) => {
    if (rest.onVisibleChange) {
      rest.onVisibleChange(v);
    } else {
      setVisible(v);
    }
  });

  useEffect(() => {
    if (popupVisible) {
      context.lock();
    } else {
      context.unlock();
    }
  }, [popupVisible, context]);

  return (
    <Context.Provider value={provider}>
      <ArcoTrigger
        {...rest}
        popupVisible={popupVisible}
        onVisibleChange={onVisibleChange}
        style={{
          ...rest.style,
          opacity: !prevVisible ? 0 : void 0,
          visibility: !prevVisible ? "hidden" : void 0,
          transition: "opacity 0.3s",
        }}
      >
        {children}
      </ArcoTrigger>
    </Context.Provider>
  );
};
