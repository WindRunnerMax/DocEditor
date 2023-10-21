import { Editor, Path } from "slate";
import { isBlock, isText, isTextBlock, setBlockNode, setUnBlockNode } from "../ops";
import { BaseNode } from "src/types";
import { isDev } from "src/utils/is";

type SchemaItem = {
  block?: boolean;
  void?: boolean;
  wrap?: string;
};
export type EditorSchema = Record<string, SchemaItem>;

export const withSchema = <T extends Editor>(schema: EditorSchema, editor: T): T => {
  const { isVoid, normalizeNode } = editor;

  const voidKeys: Set<string> = new Set<string>();
  const wrapperMap: Map<string, string> = new Map();
  const packagedMap: Map<string, string> = new Map();

  for (const [key, value] of Object.entries(schema)) {
    value.void && voidKeys.add(key);
    value.wrap && wrapperMap.set(value.wrap, key);
    value.wrap && packagedMap.set(key, value.wrap);
  }

  editor.isVoid = element => {
    for (const key of Object.keys(element)) {
      if (voidKeys.has(key)) return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;
    const batch: (() => void)[] = [];

    // `Normalize Wrap Node`
    if (isBlock(editor, node)) {
      for (const key of Object.keys(node)) {
        // `Wrapper Node`
        if (wrapperMap.has(key)) {
          const packagedKey = wrapperMap.get(key) as string;
          // 深度优先遍历
          // 路径上一定需要存在`Packaged Key`
          // 否则在`Text Node`上加入`Packaged Key`
          const dfs = (cur: BaseNode, path: Path) => {
            if (isText(cur) || (isBlock(editor, cur) && cur[packagedKey])) {
              return void 0;
            } else if (isTextBlock(editor, cur)) {
              // `Text Block Node`一定是最后最后一个`Block Node`
              if (isDev) {
                console.log("NormalizeWrapperNode: ", path, `${key}--${packagedKey}`);
              }
              batch.push(() => setBlockNode(editor, { [packagedKey]: true }, { at: path }));
              return void 0;
            }
            const children = cur.children;
            if (!children) return void 0;
            for (let i = 0; i < children.length; i++) {
              dfs(children[i], path.concat(i));
            }
          };
          dfs(node, path);
        }

        // `Packaged Node`
        if (packagedMap.has(key)) {
          const wrapperKey = packagedMap.get(key) as string;
          let matchWrapperNode = false;
          let parent = Editor.parent(editor, path);
          // 从当前节点向上遍历
          // 路径上一定需要存在`Wrapper Node`
          // 否则在`Base Node`上删除`Packaged Key`
          while (parent && parent[0] && parent[1] && isBlock(editor, parent[0])) {
            const cur = parent[0];
            if (cur[wrapperKey]) {
              matchWrapperNode = true;
              break;
            }
            parent = Editor.parent(editor, parent[1]);
          }
          if (!matchWrapperNode) {
            if (isDev) {
              console.log("NormalizePackagedNode: ", path, `${wrapperKey}--${key}`);
            }
            batch.push(() => setUnBlockNode(editor, [key], { at: path }));
          }
        }
      }
    }

    batch.forEach(fn => fn());
    normalizeNode(entry);
  };

  return editor;
};
