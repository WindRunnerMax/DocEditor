type SchemaItem = {
  /** 块级节点 */
  block?: boolean;
  /** 行内块节点 */
  // COMPAT: `Inline`节点与设计有所冲突
  // inline?: boolean;
  /** 空节点 */
  void?: boolean;
  /** 嵌套包装节点 */
  wrap?: string;
  /** 块级嵌套边界 */
  instance?: boolean;
};

export type EditorSchema = Record<string, SchemaItem>;
