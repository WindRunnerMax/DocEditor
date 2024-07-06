import { EditorModule } from "../../editor/inject";

export class Paste extends EditorModule {
  public onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/with-react.ts#L224
    event.preventDefault();
  };
}
