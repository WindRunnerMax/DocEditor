# DocEditor
 [Github](https://github.com/WindrunnerMax/DocEditor) ｜ [Editor DEMO](https://windrunnermax.github.io/DocEditor/) ｜ [BLOG](https://github.com/WindrunnerMax/EveryDay/blob/master/Plugin/%E5%9F%BA%E4%BA%8Eslate%E6%9E%84%E5%BB%BA%E6%96%87%E6%A1%A3%E7%BC%96%E8%BE%91%E5%99%A8.md)

`slate.js`是一个完全可定制的框架，用于构建富文本编辑器。在这里基于`slate.js`实现了简单的文档编辑器，`slate`提供了富文本的`controller`，简单来说他本身并不提供各种富文本编辑功能，所有的富文本功能都需要自己来通过其提供的`API`来实现，甚至他的插件机制也需要通过自己来拓展，所以在插件的实现方面就需要自己制定一些策略。在交互与`ui`方面对于飞书文档的参考比较多，整体来说坑也是比较多的，尤其是在做交互策略方面，不过做好兜底以后实现基本的文档编辑器功能是没有问题的。

```bash
$ pnpm install
$ npx husky install && chmod 755 .husky/pre-commit
```

## 类型拓展
在`slate`中预留了比较好的类型拓展机制，可以通过`TypeScript`中的`declare module`配合`interface`来拓展`BlockElement`与`TextElement`的类型，使实现插件的`attributes`有较为严格的类型校验。

```typescript
// base
export type BaseNode = BlockElement | TextElement;
declare module "slate" {
  interface BlockElement {
    children: BaseNode[];
    [key: string]: unknown;
  }
  interface TextElement {
    text: string;
    [key: string]: unknown;
  }
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: BlockElement;
    Text: TextElement;
  }
}

// plugin
declare module "slate" {
  interface BlockElement {
    type?: { a: string; b: boolean };
  }
  interface TextElement {
    type?: boolean;
  }
}
```
## 插件注册
插件注册时通过`slate-plugins.tsx`来实现，具体来说，每个插件都是一个必须返回一个`Plugin`类型的函数，当然直接定义一个对象也是没问题的，函数的好处是可以在注册的时候传递参数，所以一般都是直接用函数定义的。

* `key`: 表示该插件的名字，一般不能够重复。
* `priority`: 表示插件执行的优先级，通常用户需要包裹`renderLine`的组件。
* `command`: 注册该插件的命令，工具栏点击或者按下快捷键需要执行的函数。
* `onKeyDown`: 键盘事件的处理函数，可以用他来制定回车或者删除等操作的具体行为等。
* `type`: 标记其是`block`或者是`inline`。
* `match`: 只有返回`true`即匹配到的插件才会执行。
* `renderLine`: 用于`block`的组件，通常用作在其子元素上包裹一层组件。
* `render`: 对于`block`组件具体渲染的组件由该函数决定，对于`inline`组件则与`block`的`renderLine`表现相同。


```typescript
type BasePlugin = {
  key: string;
  priority?: number; // 优先级越高 在越外层
  command?: CommandFn;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => boolean | void;
};
type ElementPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.BLOCK;
  match: (props: RenderElementProps) => boolean;
  renderLine?: (context: ElementContext) => JSX.Element;
  render?: (context: ElementContext) => JSX.Element;
};
type LeafPlugin = BasePlugin & {
  type: typeof EDITOR_ELEMENT_TYPE.INLINE;
  match: (props: RenderLeafProps) => boolean;
  render?: (context: LeafContext) => JSX.Element;
};
```
## 插件策略
在这里是具体的插件实现方案与示例，每个部分都是一种类型的插件的实现。在具体的插件实现方面，整体还是借助了`HTML5`的标签来完成各种样式，这样能够保持文档的标签语义完整性但是会造成`DOM`结构嵌套比较深。使用纯`CSS`来完成各种插件也是没问题的，而且实现上是更简单一些的，`context`提供`classList`来操作`className`，只不过纯`CSS`实现样式的话标签语义完整性就欠缺一些。这方面主要是个取舍问题，在此处实现的插件都是借助`HTML5`的标签以及一些自定义的交互策略来完成的，交互的执行上都是通过插件注册命令后触发实现的。

### Leaf
`leaf`类型的插件是行内的元素，例如加粗、斜体、下划线、删除线等等，在实现上只需要注意插件的命令注册与在该命令下如何渲染元素即可，在`bold`插件的[实现](https://github.com/WindrunnerMax/DocEditor/blob/master/src/plugins/bold/index.tsx)中，主要是注册了操作`attributes`的命令，以及使用`<strong />`作为渲染格式的标签。

### Element
`element`类型的插件是属于块级元素，例如标题、段落、对齐等等，简单来说是作用在行上的元素，在实现上不光要注意命令的注册和渲染元素，还有注意各种`case`，尤其是在`wrapper`嵌套下的情况。在`heading`插件的[实现](https://github.com/WindrunnerMax/DocEditor/blob/master/src/plugins/heading/index.tsx)中，在命令阶段处理了是否已经处于`heading`状态，如果处于改状态那就取消`heading`，生成的`id`是为了之后作为锚点使用，在处理键盘事件的时候，就需要处理一些`case`，在这里实现了我们回车的时候不希望在下一行继承`heading`格式，以及当光标置于行最前点击删除则会删除该行标题格式。


### Wrapper
`wrapper`类型的插件同样也是属于块级元素，例如引用块、有序列表、无序列表等，简单来说是在行上额外嵌套了一行，所以在实现上不光要注意命令的注册和渲染元素，还有注意各种`case`，在`wrapper`下需要注意的`case`就特别多，所以我们也需要自己实现一些策略来避免这些问题。在`quote-block`插件的[实现](https://github.com/WindrunnerMax/DocEditor/blob/master/src/plugins/quote-block/index.tsx)中，实现了支持一级块引用，回车会继承格式，作为`wrapped`插件不能与其他`wrapped`插件并行使用，行空且该行为`wrapped`首行或尾行时回车和删除会取消该行块引用格式，光标置于行最前点击删除且该行为`wrapped`首行或尾行时则会取消该行块引用格式。

### Void
`void`类型的插件同样也是属于块级元素，例如分割线、图片、视频等，`void`元素应该是一个空元素，他会有一个空的用于渲染的文本子节点，并且是不可编辑的，所以是一类单独的节点类型。在`dividing-line`插件的[实现](https://github.com/WindrunnerMax/DocEditor/tree/master/src/plugins/dividing-line)中，主要需要注意分割线的选中以及`void`节点的定义。

### Toolbar
`toolbar`类型的插件是属于自定义的一类单独的插件，主要是用于执行命令，因为我们在插件定义的时候注册了命令，那么也就意味着我们完全可以通过命令来驱动节点的变化，`toolbar`就是用于执行命令的插件。在`doc-toolbar`插件的[实现](https://github.com/WindrunnerMax/DocEditor/blob/master/src/plugins/toolbar/doc-toolbar.tsx)中，我们可以看到如何实现左侧的悬浮菜单以及命令的执行等。

### Shortcut
`shortcut`类型的插件是属于自定义的一类单独的插件，同样也是用于快捷键执行命令，这也是使用命令驱动的一种实现。在`shortcut`插件的[实现](https://github.com/WindrunnerMax/DocEditor/blob/master/src/plugins/shortcut/index.tsx)中，我们可以看到如何处理快捷键的输入以及命令的执行等。





