# DocEditor
基于`slate.js`完成的文档编辑器，`slate.js`是一个完全可定制的框架，用于构建富文本编辑器，简单来说他本身并不提供各种富文本编辑功能，所有的富文本功能都需要自己来通过其提供的`API`来实现，甚至他的插件机制也需要通过自己来拓展，所以文档组件方面就有了一些自己制定的策略。  
交互与`ui`方面对于飞书文档的参考比较多，整体来说坑也是比较多的，尤其是在做交互策略方面，不过做好兜底以后实现基本的文档编辑器功能是没有问题的。编辑器在线`DEMO` [Editor DEMO](https://windrunnermax.github.io/doceditor)，文档预览在线`DEMO` [Render DEMO](https://windrunnermax.github.io/doceditor/render)。  
  

```bash
$ pnpm install
$ npx husky install && chmod 755 .husky/pre-commit
```

## 插件注册
插件注册时通过`create-plugins.tsx`来实现，具体来说，每个插件都是一个必须返回一个`Plugin`类型的函数，当然直接定义一个对象也是没问题的，函数的好处是可以在注册的时候传递参数，所以一般都是直接用函数定义的。

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
在插件方面，整体还是借助了`HTML5`的标签来完成各种样式，这样能够保持文档的标签语义完整性但是会造成`DOM`结构嵌套比较深。使用纯`CSS`来完成各种插件也是没问题的，而且实现上是更简单一些的，`context`提供`classList`来操作`className`，只不过纯`CSS`实现样式的话标签语义完整性就欠缺一些。这方面主要是个取舍问题，在此处实现的插件都是借助`HTML5`的标签以及一些自定义的交互策略来完成的。

* `bold`: 加粗插件。
    * 通过`<strong />`标签嵌套实现。
    * 紧跟其后继续编写内容则会保持相同格式。
* `italic`: 斜体插件。
    * 通过`<em />`标签嵌套实现。
    * 紧跟其后继续编写内容则会保持相同格式。
* `under-line`: 下划线插件。
    * 通过`<u />`标签嵌套实现。
    * 紧跟其后继续编写内容则会保持相同格式。
* `strike-through`: 删除线插件。
    * 通过`<del />`标签嵌套实现。
    * 紧跟其后继续编写内容则会保持相同格式。
* `inline-code`: 删除线插件。
    * 通过`<del />`标签嵌套实现。
    * 紧跟其后继续编写内容则会保持相同格式。
* `hyper-link`: 超链接插件。
    * 交互方面点击工具栏则会弹出编辑框以输入链接，嵌入完成之后如需修改则在文档编辑模式下点击链接同样可以弹出编辑框。
    * 支持本页面打开与新页面打开。
    * 紧跟其后继续编写内容则会保持相同格式。
* `heading`: 标题插件。
    * 支持三级标题，会以`<h1-3/>`的标签展示。
    * 回车不会继承标题格式。
    * 光标置于行最前点击删除则会删除该行标题格式。
* `paragraph`: 段落插件。
    * 用以保证每行的格式，每行作为段落使用。
* `shortcut`: 快捷键插件。
    * 支持有序列表`1.`、无序列表`*`、标题`# ## ###`、块级引用`>`的快捷键来应用格式。
* `toolbar`: 工具栏插件。
    * 鼠标悬浮行则唤醒左侧的工具栏。
    * 选中文字则唤醒顶部的工具栏。
    * 应用格式时通过插件的`command`机制实现。
    * 对于`inline`的格式实现了将其转为普通文字的功能。
* `quote-block`: 块级引用插件。
    * 支持一级块引用。
    * 回车会继承格式。
    * 作为`wrapped`插件不能与其他`wrapped`插件并行使用。
    * 行空且该行为`wrapped`首行或尾行时，回车和删除会取消该行块引用格式。
    * 光标置于行最前点击删除且该行为`wrapped`首行或尾行时，则会取消该行块引用格式。
* `ordered-list`: 有序列表插件。
    * 支持三级有序列表。
    * 回车会继承格式。
    * 各级有序列表的`index`独立计数。
    * 作为`wrapped`插件不能与其他`wrapped`插件并行使用。
    * 使用`tab`键进入下一级有序列表，删除键恢复上一级有序列表。
    * 行空且该行为`wrapped`首行或尾行，且此时列表级别为`1`时，回车和删除会取消该行有序列表格式。
    * 光标置于行最前点击删除，且该行为`wrapped`首行或尾行，且此时列表级别为`1`时，则会取消该行有序列表格式。
* `ordered-list`: 无序列表插件。
    * 支持三级无序列表。
    * 回车会继承格式。
    * 作为`wrapped`插件不能与其他`wrapped`插件并行使用。
    * 使用`tab`键进入下一级有序列表，删除键恢复上一级有序列表。
    * 行空且该行为`wrapped`首行或尾行，且此时列表级别为`1`时，回车和删除会取消该行有序列表格式。
    * 光标置于行最前点击删除，且该行为`wrapped`首行或尾行，且此时列表级别为`1`时，则会取消该行有序列表格式。
