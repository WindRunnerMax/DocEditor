import { useFocused, useSelected } from "doc-editor-delta";
import { cs } from "doc-editor-utils";

export const DividingLine: React.FC = () => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div className="dividing-line-container">
      <div className={cs("dividing-line", focused && selected && "selected")}></div>
    </div>
  );
};
