import "./App.css";
import SlateDocEditor from "src/views";

export const App: React.FC = () => (
  <div className="doc-editor">
    <SlateDocEditor isRender={false}></SlateDocEditor>
  </div>
);
