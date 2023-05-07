import styles from "./index.module.scss";
import { Image } from "@arco-design/web-react";
import { FC, useState } from "react";
import { cs } from "src/utils/classnames";

const Preview = Image.Preview;
export const ImageWrapper: FC<{
  readonly: boolean;
  selected?: boolean;
  disable?: boolean;
  src: string;
}> = props => {
  const [src, setSrc] = useState("");

  const needPreview = !props.disable && (props.readonly || props.selected);

  const preview = async () => {
    if (needPreview) {
      const src = props.src;
      setSrc(src || "");
    }
  };

  return (
    <>
      {src && <Preview src={src} visible={!!src} onVisibleChange={v => !v && setSrc("")} />}
      <div onClick={preview} className={cs(needPreview && styles.preview)}>
        {props.children}
      </div>
    </>
  );
};
