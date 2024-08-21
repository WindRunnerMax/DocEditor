type Rect = {
  width: number;
  height: number;
};

export type ResizeCallback = (prev: Rect, next: Rect) => void;

export const createResizeObserver = (dom: HTMLElement, callback: ResizeCallback) => {
  // COMPAT: `Rect`的精度会比直接读`clientWidth/clientHeight`高
  // 因此这里需要精确读取其值 否则会导致创建时的额外事件触发
  const rect = dom.getBoundingClientRect();
  let prevWidth = rect.width;
  let prevHeight = rect.height;

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(entries => {
      const [entry] = entries;
      if (!entry) return void 0;
      const { width, height } = entry.contentRect;
      if (width !== prevWidth || height !== prevHeight) {
        callback({ width: prevWidth, height: prevHeight }, { width, height });
        prevWidth = width;
        prevHeight = height;
      }
    });
    observer.observe(dom);
    return () => {
      observer.disconnect();
    };
  } else {
    dom.style.position = "relative";
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "//about:blank");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("contenteditable", "false");
    // 不可以设置 iframe.hidden 属性为 true
    iframe.setAttribute(
      "style",
      [
        "position: absolute",
        "top: 0",
        "left: 0",
        "right: 0",
        "bottom: 0",
        "opacity: 0",
        "width: 100%",
        "height: 100%",
        "border: none",
        "z-index: -999999",
        "user-select: none",
        "visibility: hidden",
        "pointer-events: none",
        "transform: translate(-999999px, -999999px)",
      ].join(";")
    );
    iframe.onload = () => {
      if (!iframe.contentWindow) return void 0;
      iframe.contentWindow.onresize = () => {
        const { clientWidth: width, clientHeight: height } = dom;
        if (width !== prevWidth || height !== prevHeight) {
          callback({ width: prevWidth, height: prevHeight }, { width, height });
          prevWidth = width;
          prevHeight = height;
        }
      };
    };
    dom.appendChild(iframe);
    return () => {
      dom.removeChild(iframe);
    };
  }
};
