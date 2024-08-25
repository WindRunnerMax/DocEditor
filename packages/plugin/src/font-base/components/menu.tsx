import { Button, InputNumber } from "@arco-design/web-react";
import type { FC } from "react";
import { useMemo } from "react";

import { useMemoFn } from "../../shared/hooks/preset";
import type { FontBaseConfig } from "../types";

interface Props {
  top: number;
  left: number;
  config: FontBaseConfig;
  onChange: (value: FontBaseConfig) => void;
}

export const FONT_COLOR_LIST = [
  "var(--color-white)",
  "var(--color-black)",
  "rgb(var(--red-6))",
  "rgb(var(--blue-6))",
  "rgb(var(--green-6))",
  "rgb(var(--orange-6))",
  "rgb(var(--purple-6))",
  "rgb(var(--magenta-6))",
  "rgb(var(--pinkpurple-6))",
];

export const FontBaseMenu: FC<Props> = props => {
  const top = props.top + 50;
  const left = props.left - 180;
  let changedConfig: FontBaseConfig = props.config;

  const onChange = useMemoFn((key: keyof FontBaseConfig, value: string | number | undefined) => {
    changedConfig = { ...changedConfig, [key]: value };
    props.onChange(changedConfig);
  });

  const resetDefault = useMemoFn(() => {
    props.onChange({});
    changedConfig = {};
  });

  const generatePicker = useMemo(
    () => (list: string[] | (string | undefined)[], type: keyof FontBaseConfig) => {
      return (
        <div className="font-base-picker">
          {list.map((item, index) => (
            <div
              key={index}
              className="picker-item"
              onClick={() => onChange(type, item)}
              style={{ backgroundColor: item }}
            ></div>
          ))}
        </div>
      );
    },
    [onChange]
  );

  return (
    <div className="font-base-menu" style={{ left, top }}>
      <div className="menu-line">
        <div>
          <span className="label" style={{ marginRight: 8 }}>
            字号
          </span>
          <InputNumber
            size="mini"
            defaultValue={props.config.fontSize || 14}
            mode="button"
            min={10}
            onChange={v => onChange("fontSize", v)}
          />
        </div>
      </div>
      <div className="menu-line">
        <span className="label">颜色</span>
        {generatePicker(FONT_COLOR_LIST, "color")}
      </div>
      <div className="menu-line">
        <span className="label">背景</span>
        {generatePicker(FONT_COLOR_LIST, "background")}
      </div>
      <div className="menu-line reset-default">
        <Button type="outline" size="mini" onClick={resetDefault}>
          恢复默认
        </Button>
      </div>
    </div>
  );
};
