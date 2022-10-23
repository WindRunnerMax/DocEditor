import "./index.scss";
import { FC } from "react";
import { InputNumber } from "@arco-design/web-react";

interface Props {
  top: number;
  left: number;
  config: number;
  onChange: (value: number) => void;
}

export const LineHeightMenu: FC<Props> = props => {
  const top = props.top + 30;
  const left = props.left - 100;

  return (
    <div className="line-height-menu" style={{ left, top }} onMouseDown={e => e.stopPropagation()}>
      <div className="menu-line">
        <div>
          <span className="label">行高</span>
          <InputNumber
            size="mini"
            mode="button"
            defaultValue={props.config || 1.8}
            step={0.1}
            precision={1}
            min={0.5}
            onChange={props.onChange}
          />
        </div>
      </div>
    </div>
  );
};
