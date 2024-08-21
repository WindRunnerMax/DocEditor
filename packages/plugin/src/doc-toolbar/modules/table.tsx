import "../styles/table.scss";

import { IconApps } from "@arco-design/web-react/icon";
import { cs } from "doc-editor-utils";
import React from "react";

import { TABLE_BLOCK_KEY } from "../../table/types/index";
import type { DocToolbarPlugin } from "../types";
import { exec } from "../utils/exec";
import { getWrappedBannerMenuWithTrigger } from "../utils/wrapper";

const ROW_SIZE = 6;
const COL_SIZE = 6;
const ROW_GROUP = Array(ROW_SIZE).fill(null);
const COL_GROUP = Array(COL_SIZE).fill(null);
const TablePicker: React.FC<{
  onClick: (row: number, col: number) => void;
}> = props => {
  const [currentRowIndex, setCurrentRowIndex] = React.useState(-1);
  const [currentColIndex, setCurrentColIndex] = React.useState(-1);

  return (
    <div
      className="table-size-picker"
      onMouseLeave={() => {
        setCurrentRowIndex(-1);
        setCurrentColIndex(-1);
      }}
    >
      {ROW_GROUP.map((_, rowIndex) => (
        <div key={rowIndex} className="table-size-picker-row">
          {COL_GROUP.map((_, colIndex) => (
            <div
              key={colIndex}
              className={cs(
                "table-size-picker-item",
                rowIndex <= currentRowIndex && colIndex <= currentColIndex && "active"
              )}
              onMouseEnter={() => {
                setCurrentRowIndex(rowIndex);
                setCurrentColIndex(colIndex);
              }}
              onClick={() => {
                props.onClick(currentRowIndex + 1, currentColIndex + 1);
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const TableDocToolBarPlugin: DocToolbarPlugin = {
  renderIcon: state => {
    if (state.element[TABLE_BLOCK_KEY]) {
      return {
        element: <IconApps />,
        config: { position: "lt", style: { marginTop: -17, marginLeft: 5 } },
      };
    }
    return null;
  },
  renderSignal: () => null,
  renderBanner: state => {
    if (state.status.isBlock || !state.status.isEmptyLine || state.status.isInTableBlock) {
      return null;
    }
    const onBannerClick = () => {
      exec(state, TABLE_BLOCK_KEY);
      state.close();
    };
    const onPickerClick = (row: number, col: number) => {
      if (row > 0 && col > 0) {
        exec(state, `${TABLE_BLOCK_KEY}.${row}.${col}`);
      }
      state.close();
    };
    return getWrappedBannerMenuWithTrigger(<IconApps />, "表格[WIP]", onBannerClick, {
      popup: () => <TablePicker onClick={onPickerClick}></TablePicker>,
    });
  },
};
