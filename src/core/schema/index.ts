import { Editor, Path } from "slate";
import { isBlock, isText, isTextBlock, setBlockNode, setUnBlockNode } from "../ops";
import { BaseNode } from "src/types/types";
import { isDev } from "src/utils/is";

type SchemaItem = {
  void?: boolean;
  wrap?: string;
};
export type SlateSchema = Record<string, SchemaItem>;

export const withSchema = <T extends Editor>(schema: SlateSchema, editor: T): T => {
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
            if (isText(cur)) return;
            else if (isBlock(editor, cur) && cur[packagedKey]) return;
            else if (isTextBlock(editor, cur)) {
              if (isDev) {
                console.log("NormalizeWrapperNode: ", path, `${key}--${packagedKey}`);
              }
              batch.push(() => setBlockNode(editor, { [packagedKey]: true }, { at: path }));
              return;
            }
            const children = cur.children;
            if (!children) return;
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
          // 路径上一定要存在`Wrapper Node`
          // 否则在`Base Node`上删除`Packaged Key`
          while (parent && isBlock(editor, parent[0])) {
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
