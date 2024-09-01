import "./styles/index.scss";

import { Anchor as AnchorNode } from "@arco-design/web-react";
import type { EditorKit } from "doc-editor-core";
import { EDITOR_EVENT } from "doc-editor-core";
import { cs, debounce } from "doc-editor-utils";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getLinkElement } from "./utils/link";
import type { Anchor } from "./utils/parse";
import { parseAnchor } from "./utils/parse";

const AnchorLink = AnchorNode.Link;

export const DocAnchor: FC<{
  editor: EditorKit;
  width?: number;
  boundary?: number;
  className?: string;
  scrollContainer?: HTMLElement | Window;
}> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<Anchor[]>([]);

  const onParse = useMemo(() => {
    return debounce(() => {
      const res = parseAnchor(props.editor);
      setList(res);
    }, 300);
  }, [props.editor]);

  useEffect(() => {
    onParse();
    props.editor.event.on(EDITOR_EVENT.CONTENT_CHANGE, onParse);
    return () => {
      props.editor.event.off(EDITOR_EVENT.CONTENT_CHANGE, onParse);
    };
  }, [onParse, props.editor]);

  const onAnchorChange = (newLink: string) => {
    const el = ref.current;
    const link = el && getLinkElement(newLink);
    if (el && link) {
      const refRect = el.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      if (refRect.top > linkRect.top) {
        el.scrollBy({ top: linkRect.top - refRect.top, behavior: "smooth" });
      }
      if (refRect.bottom < linkRect.bottom) {
        el.scrollBy({ top: linkRect.bottom - refRect.bottom, behavior: "smooth" });
      }
    }
  };

  return list.length ? (
    <div className={cs("doc-anchor", props.className)} ref={ref}>
      <AnchorNode
        style={{ width: props.width || 200 }}
        affix={false}
        onChange={onAnchorChange}
        boundary={props.boundary}
        scrollContainer={props.scrollContainer}
      >
        {list.map(item => (
          <AnchorLink
            title={item.title}
            key={item.id}
            href={`#${item.id}`}
            style={{ marginLeft: item.level * 10 }}
          ></AnchorLink>
        ))}
      </AnchorNode>
    </div>
  ) : null;
};
