# Note

## 插件类型体系
`slate`相当于实现了富文本的引擎能力，包括数据结构的定义、选区与数据的映射、模型的操作函数等等，而对我们来说主要的工作就是实现类型完备的插件化体系，并且如果需要实现完备的富文本应用，可能还需要借助`slate`提供的能力继续封装一层编辑器能力。实际上对于`slate`而言可以认为有两种插件化实现，使用`with`定义插件的方式更类似于在原本的富文本引擎上进行能力拓展，而基于`Editable`的插件定义更像是针对视图渲染层的扩展，当然实际上这两种方式不会独立存在，而是相辅相成的，在本文的相关实现可以参考`README`提到的`BLOG`。

## Wrap Normalize
在`slate`中数据结构的规整是比较麻烦的事情，特别是对于需要嵌套的结构来说，例如在本项目中存在的`Quote`和`List`，那么在规整数据结构的时候就有着多种方案，同样以这两组数据结构为例，每个`Wrap`必须有相应的`Pair`的结构嵌套，那么对于数据结构就有如下的方案。实际上我觉得对于这类问题是很难解决的，嵌套的数据结构对于增删改查都没有那么高效，因此在缺乏最佳实践相关的输入情况下，也只能不断摸索。

首先是复用当前的块结构，也就是说`Quote Key`和`List Key`都是平级的，同样的其`Pair Key`也都复用起来，这样的好处是不会出现太多的层级嵌套关系，对于内容的查找和相关处理会简单很多。但是同样也会出现问题，如果在`Quote`和`List`不配齐的情况下，也就是说其并不是完全等同关系的情况下，就会需要存在`Pair`不对应`Wrap`的情况，此时就很难保证`Normalize`，因为我们是需要可预测的结构。

```js
{
    "quote-wrap": true,
    "list-wrap": true,
    children: [
        { "quote-pair": true, "list-pair": 1, children: [/* ... */] },
        { "quote-pair": true, "list-pair": 2, children: [/* ... */] },
        { "quote-pair": true,  children: [/* ... */] },
        { "quote-pair": true, "list-pair": 1, children: [/* ... */] },
        { "quote-pair": true, "list-pair": 2, children: [/* ... */] },
    ]
}
```

那么如果我们不对内容做很复杂的控制，在`slate`中使用默认行为进行处理，那么其数据结构表达会出现如下的情况，在这种情况下数据结构是可预测的，那么`Normalize`就不成问题，而且由于这是其默认行为，不会有太多的操作数据处理需要关注。但是问题也比较明显，这种情况下数据虽然是可预测的，但是处理起来特别麻烦，当我们维护对应关系时，必须要递归处理所有子节点，在特别多层次的嵌套情况下，这个计算量就颇显复杂了，如果在支持表格等结构的情况下，就变得更加难以控制。

```js
{
    "quote-wrap": true,
    children: [
        {
            "list-wrap": true,
            children: [
                { "quote-pair": true, "list-pair": 1, children: [/* ... */] },
                { "quote-pair": true, "list-pair": 2, children: [/* ... */] },
            ]
        },
        { "quote-pair": true,  children: [/* ... */] },
        { "quote-pair": true,  children: [/* ... */] },
    ]
}
```

那么这个数据结构实际上也并不是很完善，其最大的问题是`wrap - pair`的间隔太大，这样的处理方式就会出现比较多的边界问题，举个比较极端的例子，假设我们最外层存在引用块，在引用块中又嵌套了表格，表格中又嵌套了高亮块，高亮块中又嵌套了引用块，这种情况下我们的`wrap`需要传递`N`多层才能匹配到`pair`，这种情况下影响最大的就是`Normalize`，我们需要有非常深层次的`DFS`处理才行，处理起来不仅需要耗费性能深度遍历，还容易由于处理不好造成很多问题。

那么在这种情况下，我们可以尽可能简化层级的嵌套，也就是说我们需要避免`wrap - pair`的间隔问题，那么很明显我们直接严格规定`wrap`的所有`children`必须是`pair`，在这种情况下我们做`Normalize`就简单了很多，只需要在`wrap`的情况下遍历其子节点以及在`pair`的情况下检查其父节点即可。当然这种方案也不是没有缺点，这让我们对于数据的操作精确性有着更严格的要求，因为在这里我们不会走默认行为，而是全部需要自己控制，特别是所有的嵌套关系以及边界都需要严格定义，这对编辑器行为的设计也有更高的要求。

```js
{
    "quote-wrap": true,
    children: [
        {
            "list-wrap": true,
            "quote-pair": true,
            children: [
                { "list-pair": 1, children: [/* ... */] },
                { "list-pair": 2, children: [/* ... */] },
            ]
        },
        { "quote-pair": true,  children: [/* ... */] },
        { "quote-pair": true,  children: [/* ... */] },
    ]
}
```

## Transformers
前边也提到了，在嵌套的数据结构中是存在默认行为的，而在之前由于一直遵守着默认行为所以并没有发现太多的数据处理方面的问题，然而当将数据结构改变之后，就发现了很多时候数据结构并不那么容易控制。先前在处理`SetBlock`的时候通常我都会通过`match`参数匹配`Block`类型的节点，因为在默认行为的情况下这个处理通常不会出什么问题。

然而在变更数据结构的过程中，处理`Normalize`的时候就出现了问题，在块元素的匹配上其表现与预期的并不一致，这样就导致其处理的数据一直无法正常处理，`Normalize`也就无法完成直至抛出异常。在这里主要是其迭代顺序与我预期的不一致造成的问题，例如在`DEMO`页上执行`[...Editor.nodes(editor, {at: [9, 1, 0] })]`，其返回的结果是由顶`Editor`至底`Node`，当然这里还会包括范围内的所有`Leaf`节点相当于是`Range`。

```
[]          Editor
[9]         Wrap
[9, 1]      List
[9, 1, 9]   Line
[9, 1, 0]   Text
```

实际上在这种情况下如果按照原本的`Path.equals(path, at)`是不会出现问题的，在这里就是之前太依赖其默认行为了，这也就导致了对于数据的精确性把控太差，我们对数据的处理应该是需要有可预期性的，而不是依赖默认行为。此外，`slate`的文档还是太过于简练了，很多细节都没有提及，在这种情况下还是需要去阅读源码才会对数据处理有更好的理解，例如在这里看源码让我了解到了每次做操作都会取`Range`所有符合条件的元素进行`match`，在一次调用中可能会发生多次`Op`调度。

此外，因为这次的处理主要是对于嵌套元素的支持，所以在这里还发现了`unwrapNodes`或者说相关数据处理的特性，当我调用`unwrapNodes`时仅`at`传入的值不一样，分别是`A-[3, 1, 0]`和`B-[3, 1, 0, 0]`，这里有一个关键点是在匹配的时候我们都是严格等于`[3, 1, 0]`，但是调用结果却是不一样的，在`A`中`[3, 1, 0]`所有元素都被`unwrap`了，而`B`中仅`[3, 1, 0, 0]`被`unwrap`了，在这里我们能够保证的是`match`结果是完全一致的，那么问题就出在了`at`上。此时如果不理解`slate`数据操作的模型的话，就必须要去看源码了，在读源码的时候我们可以发现其会存在`Range.intersection`帮我们缩小了范围，所以在这里`at`的值就会影响到最终的结果。

```js
unwrapNodes(editor, { match: (_, p) => Path.equals(p, [3, 1, 0]), at: [3, 1, 0] }); // A
unwrapNodes(editor, { match: (_, p) => Path.equals(p, [3, 1, 0]), at: [3, 1, 0, 0] }); // B
```

上边这个问题也就意味着我们所有的数据都不应该乱传，我们应该非常明确地知道我们要操作的数据及其结构。其实前边还提到一个问题，就是多级嵌套的情况很难处理，这其中实际上涉及了一个编辑边界情况，使得数据的维护就变得复杂了起来。举个例子，加入此时我们有个表格嵌套了比较多的`Cell`，如果我们是多实例的`Cell`结构，此时我们筛选出`Editor`实例之后处理任何数据都不会影响其他的`Editor`实例，而如果我们此时是`JSON`嵌套表达的结构，我们就可能存在超过操作边界而影响到其他数据特别是父级数据结构的情况。所以我们对于边界条件的处理也必须要关注到，也就是前边提到的我们需要非常明确要处理的数据结构，明确划分操作节点与范围。

```js
{
    children: [
        {
            BLOCK_EDGE: true, // 块结构边界
            children: [
                { children: [/* ... */] },
                { children: [/* ... */] },
            ]
        },
        {  children: [/* ... */] },
        {  children: [/* ... */] },
    ]
}
```

此外，在线上已有页面中调试代码可能是个难题，特别是在`editor`并没有暴露给`window`的情况下，想要直接获得编辑器实例则需要在本地复现线上环境，在这种情况下我们可以借助`React`会将`Fiber`实际写在`DOM`节点的特性，通过`DOM`节点直接取得`Editor`实例，不过原生的`slate`使用了大量的`WeakMap`来存储数据，在这种情况下暂时没有很好的解决办法，除非`editor`实际引用了此类对象或者拥有其实例，否则就只能通过`debug`打断点，然后将对象在调试的过程中暂储为全局变量使用了。

```js
const el = document.querySelector(`[data-slate-editor="true"]`);
const key = Object.keys(el).find(it => it.startsWith("__react"));
const editor = el[key].child.memoizedProps.node;
```

## 表格模块
表格应该是整个富文本编辑器中最复杂的组件之一了，表格在普通的文档中大概是唯一的二维结构表达，无论是分栏还是`Tabs`也都只是一维`Row`结构即可表达，而表格就需要`Row + Column`的二维表达才可以，此外表格还会涉及到比较复杂的交互，例如单元格的滑动选中，以此衍生的单元格合并、拆分等操作，还有拖拽调整列宽等等，这些数据都需要在表格的交互中处理，并且将数据存储到本身的数据结构中。

那么实现表格结构的表达首先需要我们设计数据结构，在初步思考之后，我觉得比较可行的数据结构表达有两种。第一种是将相关数据都在`Table`块结构中表达，也就是将所有的`Cell`都作为`Table`这个`Block Type`的`Children`，相当于将其扁平化表达了，之后记录行数与列数就足够初步表达整体结构了，而对于表格合并等数据，可以直接在`Cell`中记录`RowSpan`和`ColSpan`即可。这种方式可以省略一层结构表达，让我们的数据结构更加清晰，对于数据的操作也方便一些，但是在`Slate`中似乎不容易实现基于这个表达的编辑能力，因为我们现在不是多实例的结构，对于我们的主文档而言不能做到非受控模式的渲染与编辑，所以这种表达方式可能不太适合，此外如果能够拥有多实例的非受控渲染方式的话，我们还可以提炼一种`RowId - ColId`数组引用形式的渲染方式。

```js
{
    "table": true,
    "table-row-size": 2,
    "table-col-size": 2,
    children: [
        { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
        { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
        { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
        { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
    ]
}
```

还有一种方案就是比较常规的嵌套结构了，将`Table`的数据结构完整地表达出来，也就是将`Row`作为`Table`的`Children`，`Cell`作为`Row`的`Children`，这样的表达方式更加贴近于`DOM`结构的表达，并且在`JSON`结构中也是能够轻松表示的，只不过就是嵌套的层次太深了，这里的嵌套结构深会达到`Table - Row - Cell - Line`，没错我们需要在`Cell`中继续嵌套一层`Block`结构作为文本行结构的承载位置，否则我们直接编辑的话就会操作到`Cell`结构了，所以这里的嵌套结构会变得特别深，我们的`Schema`也就需要变得更加深入，至于额外的数据表达例如单元格合并等内容我们与上述的方案一致。

```js
{
    "table": true,
    children: [
        {
            "table-row": true,
            "table-header": true,
            children: [
                { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
                { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
            ]
        },
        {
            "table-row": true,
            children: [
                { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
                { "table-cell": true, rowSpan: 1, colSpan: 1, children: [{ children: [/** ... */] }] },
            ]
        }
    ]
}
```

针对于宽度模型我们可以设计多种形式来控制，而实际上由于单元格合并的存在，我们可能需要大量计算才能准确将设置在单元格上的具体宽度设置出来，特别是我们还需要控制`max-width`来避免宽度内部元素导致单元格元素的过大宽度。因此在这里提供相对较为简单的单元格宽度控制方式，我们通过`colgroup`以及`col`标签来指定列宽，此时相当于已经标记好单元格的宽度，那么即使在合并单元格时指定当前单元格的宽度是可以保持合并后的宽度的，而不需要重新计算。那么这里的单元格宽度属性就需要可以设置在`table`标签对应的`block node`中，而不需要每个`cell node`都带一个`width`属性了，但是这里也同样会存在问题，在更新宽度时会导致整个表格范围的节点更新，如果是在每个单元格中更新宽度的话可能不会有这么大的更新范围，所以在这里还需要见仁见智地看待这个问题，如果对每个单元格设置宽度表达的话时间消耗是会在更新时的计算上，而直接设置到`table`的消耗就是在渲染表格时。

```js
<table border="1" style="word-break: break-word;">
  <colgroup>
    <col width="100" />
    <col width="100" />
    <col width="100" />
  </colgroup>
  <tbody>
    <tr>
      <td >123123123123123123123123123123</td>
      <td colspan="2">123123123123123123123123123123</td>
    </tr>
    <tr>
      <td>1</td>
      <td colspan="2" style="max-width: 100;">2</td>
    </tr>
  </tbody>
</table>
```

## Node - Path
经常使用`Slate`的同学都知道，无论是`RenderElementProps`还是`RenderLeafProps`在渲染的时候，除了`attributes`以及`children`等数据之外，是没有`Path`数据的传递的，这对于普通的节点渲染自然是没有问题的，但是当我们想实现比较复杂的模块或者交互时，例如表格模块与图片的异步上传等场景时，这可能并不足以让我们完成这些功能。

```js
export interface RenderElementProps {
    children: any;
    element: Element;
    attributes: {
        // ...
    };
}
export interface RenderLeafProps {
    children: any;
    leaf: Text;
    text: Text;
    attributes: {
        // ...
    };
}
```

那么平时我们对于数据操作的时候，`Path`是非常重要的，在平时的交互处理中，我们使用`editor.selection`就可以满足大部分功能了。然而很多情况下单纯用`selection`来处理要操作的目标`Path`是有些捉襟见肘的。那么此时在传递的数据结构中我们可以看到与`Path`最相关的数据就是`element/text`值了，那么此时我们可以比较轻松地记起在`ReactEditor`中存在`findPath`方法，可以让我们通过`Node`来查找对应的`Path`。

```js
// https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/plugin/react-editor.ts#L90
findPath(editor: ReactEditor, node: Node): Path {
  const path: Path = []
  let child = node
  while (true) {
    const parent = NODE_TO_PARENT.get(child)
    if (parent == null) {
      if (Editor.isEditor(child))   return path
      else break
    }
    const i = NODE_TO_INDEX.get(child)
    if (i == null) break
    path.unshift(i)
    child = parent
  }
}
```

简单压缩了代码，在这里的实现是通过两个`WeakMap`非常巧妙地让我们可以取得节点的`Path`。那么这里就需要思考一个问题，为什么我们不直接在`RenderProps`直接将`Path`传递到渲染的方法中，而是非得需要每次都得重新查找而浪费一部分性能。实际上，如果我们只是渲染文档数据，那么自然是不会有问题的，然而我们通常是需要编辑文档的，在这个时候就会出现问题。举个例子，假设我们在`[10]`位置有一个表格，而此时我们在`[6]`位置上增添了`1`个空白行，那么此时我们的表格`Path`就应该是`[11]`了，然而由于我们实际上并没有编辑与表格相关的内容，所以我们本身也不应该刷新表格的相关内容，自然其`Props`就不会变化，此时我们如果直接取值的话，则会取到`[10]`而不是`[11]`。

那么同样的，即使我们用`WeakMap`记录`Node`与`Path`的对应关系，即使表格的`Node`实际并没有变化，我们也无法很轻松地迭代所有的节点去更新其`Path`。因此我们就可以基于这个方法，在需要的时候查找即可。那么新的问题又来了，既然前边我们提到了不会更新表格相关的内容，那么应该如何更新其`index`的值呢，在这里就是另一个巧妙的方法了，在每次由于数据变化导致渲染的时候，我们同样会向上更新其所有的父节点，这点和`immutable`的模型是一致的，那么此时我们就可以更新所有影响到的索引值了，那么如何避免其他节点的更新呢，很明显我们可以根据`key`去控制这个行为，对于相同的节点赋予唯一的`id`即可。另外在这里可以看出，`useChildren`是定义为`Hooks`的，那么其调用次数必定不会低，而在这里每次组件`render`都会存在`findPath`调用，所以这里倒也不需要太过于担心这个方法的性能问题，因为这里的迭代次数是由我们的层级决定的，通常我们都不会有太多层级的嵌套，所以性能方面还是可控的。

```js
// https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/hooks/use-children.tsx#L90
const path = ReactEditor.findPath(editor, node)
const children = []
for (let i = 0; i < node.children.length; i++) {
  const p = path.concat(i)
  const n = node.children[i] as Descendant
  const key = ReactEditor.findKey(editor, n)
  // ...
  if (Element.isElement(n)) {
    children.push(
      <SelectedContext.Provider key={`provider-${key.id}`} value={!!sel}>
        <ElementComponent />
      </SelectedContext.Provider>
    )
  } else {
      children.push(<TextComponent />)
  }
  NODE_TO_INDEX.set(n, i)
  NODE_TO_PARENT.set(n, node)
}
```

## Decorate
在`slate`中`decoration`是比较有趣的功能，设想一个场景，当需要实现代码块的高亮时，我们可以有几种方案来实现: 第一种方案是我们可以通过直接将代码块的内容解析的方式，解析出的关键字类别直接写入数据结构中，这样就可以直接在渲染时将高亮信息渲染出来，缺点就是会增加数据结构存储数据的大小；那么第二种方式我们就可以只存储代码信息，当需要数据高亮时也就是前端渲染时我们再将其解析出`Marks`进行渲染，但是这样的话如果存在协同我们还需要为其标记为非协同操作以及无需服务端存储的纯客户端`Op`，会稍微增加一些复杂度；那么第三种方法就是使用`decoration`，实际上可以说这里只是`slate`帮我们把第二种方法的事情做好了，可以在不改变数据结构的情况下将额外的`Marks`内容渲染出来。

在前段时间测试`slate`官网的`search-highlighting example`时，当我搜索`adds`时，搜索的效果很好，但是当我执行跨节点的搜索时，就不能非常有效地突出显示内容了，具体信息可以查看`https://github.com/ianstormtaylor/slate/pull/5670`。这也就是说当`decoration`执行跨节点处理的时候，是存在一些问题的。例如下面的例子，当我们搜索`123`或者`12345`时，我们能够正常将标记出的`decoration`渲染出来，然而当我们搜索`123456`时，此时我们构造的`range`会是`path: [0], offset: [0-6]`，此时我们跨越了`[0]`节点进行标记，就无法正常标记内容了。

```js
[
    { text: "12345" },
    { text: "67890" }
]
```

通过调用查找相关代码，我们可以看到上级的`decorate`结果会被传递到后续的渲染中，那么在本级同样会调度传递的`decorate`函数来生成新的`decorations`，并且这里需要判断如果父级的`decorations`与当前节点的`range`存在交集的话，那么内容会被继续传递下去。那么重点就在这里了，试想一下我们的场景，依旧以上述的例子中的内容为例，如果我们此时想要获取`123456`的索引，那么在`text: 12345`这个节点中肯定是不够的，我们必须要在上层数组中将所有文本节点的内容拼接起来，然后再查找才可以找到准确的索引位置。

```js
// https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate-react/src/hooks/use-children.tsx#L21
const useChildren = (props: {
  decorations: Range[]
  // ...
}) => {
  // ...

  for (let i = 0; i < node.children.length; i++) {
    // ...
    const ds = decorate([n, p])
    for (const dec of decorations) {
      const d = Range.intersection(dec, range)
      if (d) {
        ds.push(d)
      }
    }
    // ...
  }
  // ...
}
```

那么此时我们就明确需要我们调用`decorate`的节点是父级元素，而父级节点传递到我们需要处理的`text`节点时，就需要`Range.intersection`来判断是否存在交集，实际上这里判断交集的策略很简单，在下面我们举了两个例子，分别是存在交集和不存在交集的情况，我们实际上只需要判断两个节点的最终状态即可。

```js
// https://github.com/ianstormtaylor/slate/blob/25be3b/packages/slate/src/interfaces/range.ts#L118

// start1          end1          start2          end2
// end1          start2
// end1 < start2 ===> 无交集

// start1          start2          end1          end2
// start2          end1
// start2 < end1 ===> 有交集 [start2, end1]
```

那么我们可以通过修改在`decorate`这部分代码中的`Range.intersection`逻辑部分来解决这个问题吗，具体来说就是当我们查找出的内容超出原本`range`的内容，则截取其需要装饰的部分，而其他部分舍弃掉，实际上这个逻辑在上边我们分析的时候已经发觉是没有问题的，也就是当我们查找`123456`的时候是能够将`12345`这部分完全展示出来的。根据前边的分析，本次循环我们的节点都在`path: [0]`，这部分代码会将`start: 0`到`end: 5`这部分代码截取`range`并渲染。

然而我们在下一个`text range`范围内继续查找`6`这部分就没有那么简单了，因为前边我们实际上查找的`range`是`path: [0], offset: [0-6]`，而第二个`text`的基本`range`是`path: [1], offset: [0-5]`，基于上述判断条件的话我们是发现是不会存在交集的。因此如果需要在这里进行处理的话，我们就需要取得前一个`range`甚至在跨越多个节点的情况下我们需要向前遍历很多节点，当`decorations`数量比较多的情况下我们需要检查所有的节点，因为在此节点我们并不知道前一个节点是否超越了本身节点的长度，这种情况下在此处的计算量可能比较大，或许会造成性能问题。

因此我们还是从解析时构造`range`入手，当跨越节点时我们就需要将当前查找出来的内容分割为多个`range`，然后为每个`range`分别置入标记，还是以上边的数据为例，此时我们查找的结果就是`path: [0], offset: [0, 5]`与`path: [1], offset: [0, 1]`两部分，这种情况下我们在`Range.intersection`时就可以正常处理交集了，此时我们的`path`是完全对齐的，而即使完全将内容跨越，也就是搜索内容跨越不止一个节点时，我们也可以通过这种方式来处理。


```js
// https://github.com/ianstormtaylor/slate/pull/5670
const texts = node.children.map(it => it.text)
const str = texts.join('')
const length = search.length
let start = str.indexOf(search)
let index = 0
let iterated = 0
while (start !== -1) {
  while (index < texts.length && start >= iterated + texts[index].length) {
    iterated = iterated + texts[index].length
    index++
  }
  let offset = start - iterated
  let remaining = length
  while (index < texts.length && remaining > 0) {
    const currentText = texts[index]
    const currentPath = [...path, index]
    const taken = Math.min(remaining, currentText.length - offset)
    ranges.push(/* 构造新的`range` */)
    remaining = remaining - taken
    if (remaining > 0) {
      iterated = iterated + currentText.length
      offset = 0
      index++
    }
  }
  start = str.indexOf(search, start + search.length)
}
```

## Clipboard
剪贴板模块是需要我们精心设计的内容，在这里我们需要考虑比较复杂的功能点，因为我们的剪贴板相当于跨平台的中转点，无论我们的文档编辑器实现方式是什么，通常都需要遵循一些规范，才能让我们的编辑器在跨平台的时候有更好的表现。此外，由于我们的编辑器是遵循插件化的能力设计，所以我们还需要将整个剪贴板能力做可插拔的能力，转换的逻辑交由插件来实现。总结起来，我们需要实现的内容主要有一下几点：

* 将选区内容转换为`HTML`: 由于需要维护`DOM`与`MODEL`的映射关系，因此我们的`DOM`结构通常会比较复杂，在这种情况下如果直接将选择的`HTML`复制到剪贴板是不够通用的，特别是在跨平台的过程中，例如要将`slate`的内容复制到`Word`中，我们需要尽可能地保持`HTML`格式的规范。
* 将剪贴板内容转换为`JSON`: 与上述逻辑相反，在跨平台复制时，例如从`Word`将内容复制到我们的编辑器中时，我们就可以从剪贴板中获取内容，此时就需要我们按照一定规范读取`HTML`数据将其转换为`JSON`格式，也就是我们实际维护的`slate`的数据结构表达。
* 编辑器内部的无损复制粘贴: 如果我们是在编辑器内部进行数据处理的话，是完全不需要经过额外的一套数据结构转换的，我们可以直接将内部的`JSON`数据写在剪贴板中作为一个`key`，在读取的时候直接检查是否有这个`key`即可，`slate`默认的`key`是`application/x-slate-fragment`。此外，考虑到我们可能会作为`SDK`开发`slate`，为了防止不同业务逻辑数据结构的冲突，我们也可以在编辑器实例化时强制要求传递具体的业务`id`来区分不同业务的行为。

那么我们首先来处理编辑器内部的无损粘贴行为，在这里我们不需要为其设计插件化能力，而且`slate`已经有实现可以提供给我们参考。当我们使用`slate`测试复制粘贴行为时，会发现`slate`会通过`getFragment`来获取当前选区的内容，但是在这里存在一点问题是，其会直接读取从选区到`Editor`实例的所有内容，也就是相当于获取了从最顶部到两个选区节点之间的所有内容。

例如此时我们是表格嵌套的代码块，此时我们选择代码块的某一行中几个文本，并且执行复制程序的话，则会获得从`table - table-tr - table-cell - codeblock - line - text`的所有内容，而此时将内容粘贴在代码块内的话则会导致出现代码块内部出现表格再嵌套高亮块的问题，并且此时我们粘贴出的内容会只存在一个单元格，还会与`table-col-widths`、`cell-span`等内容产生冲突的情况。

```js
[
  {
    "table": true,
    "table-col-widths": [199, 292, 224],
    "children": [
      {
        "table-row": true,
        "children": [
          {
            "table-cell": true,
            "children": [
              {
                "code-block": true,
                "code-block-config": { language: "JavaScript" },
                "children": [{ children: [{ text: "console.log" }] }],
              },
            ],
            "cell-row-span": 2,
            "cell-col-span": 1,
          },
        ],
      },
    ],
  },
];
```

那么这种模式是在嵌套层级不多的情况下是完全没有问题的，然而在我们这种多级嵌套的情况下，就需要为其做高度的自定义处理。那么我们可以思考一下应该如何读取我们想要的内容，在上面的例子中我们可能会想直接读取最后的`text`内容即可，不需要考虑外边的嵌套情况。那么我们就需要假设另一种情况了，如果我们是从代码块的外部选择内容到了代码块内部，此时我们就需要保留代码块的块级格式了。

```js
[
  { heading: { type: "h2", id: "82651426" }, children: [{ text: "代码块" }] },
  {
    "code-block": true,
    "code-block-config": { language: "JavaScript" },
    "children": [{ children: [{ text: "const a = 1;" }] }],
  },
];
```

那么我们应该怎么处理才比较好，可能会出现的一个想法是我们遍历当前选区内的所有`Line`结构，通过遍历`Line`来确定应该保留那些层级，相当于缩小了入口的范围，最高的`index`当然是取`text`的位置，而最低的`index`则由`Line`的`parent`决定。实际上这样的思路是没有问题的，只是我们不需要遍历这么复杂的数据来确定范围，别忘了我们的选区表达是存在`Path`的，我们可以借助`Path`来裁剪内容。也就是说，我们可以通过判断`Path`的相同前缀来决定要跳过哪些`Fragment`。

实际上我们可以换个说法，当取得`Fragment`时，我们可以从顶层开始遍历，如果发现该`node-children`只有一个元素，那么我们就可以认为这部分时不需要写入剪贴板的，可以将这部分直接舍弃，而当我们遍历到开始存在多个节点的`node`时，我们就可以认为这里是实际的内容选区，将`children`取出写入剪贴板即可。当然最终的方案不会这么粗暴，因为还有一些`case`需要处理，例如我们就是对于某个`text`的不同`offset`的选区，这种时候我们还是需要保留最后的`text`节点的。

```js
({
  anchor: { path: [37, 1, 1, 2, 0, 0], offset: 0 },
  focus: { path: [37, 1, 1, 2, 0, 0], offset: 11 },
})
// =>
({
  anchor: { path: ["xxx", 0], offset: 0 },
  focus: { path: ["xxx", 0], offset: 11 },
})

({
  anchor: { path: [37, 2, 2, 2, 0], offset: 0 },
  focus: { path: [37, 2, 2, 3, 0, 0], offset: 12 },
})
// =>
({
  anchor: { path: ["xxx", 2, 0], offset: 0 },
  focus: { path: ["xxx", 3, 0, 0], offset: 12 },
})
```

此外，还有一个重要的问题，通过这种方式处理的`Wrap`类型的节点可能会丢失其`wrap-key`的值，因为我们在这种情况下选取的内容必然是内部元素而不是完整选取整个元素，这种情况下如果需要特殊处理的话就需要交给插件去做格式化了，需要实现`willSetToClipboard`的`Hook`，否则作为没有`wrap-key`的`pair-key`会被`Normalize`的规则处理掉。不过通常这种情况不会出现，在选区的情况下我们选择块级内容一般都是文本或者节点内的选区，而只有在工具栏的剪贴板操作时我们需要为其特殊处理。但是对于`Table`节点单元格的处理会是比较麻烦的问题，只不过暂时我们还没有将表格的选区融合到编辑器整个选区模块，这块暂时不用考虑。

## 零宽字符 IME
通常实现`Void/Embed`节点时，我们都需要在`Void`节点中实现一个零宽字符，用来处理选区的映射问题。通常我们都需要隐藏其本身显示的位置以隐藏光标，然而在特定条件下这里会存在吞`IME`输入的问题。

```html
<div contenteditable="true"><span contenteditable="false" style="background:#eee;">Void<span style="height: 0px; color: transparent; position: absolute;">&#xFEFF;</span></span><span>!</span></div>
```

处理这个问题的方式比较简单，我们只需要将零宽字符的标识放在`EmbedNode`之前即可，这样也不会影响到选区的查找。`https://github.com/ianstormtaylor/slate/pull/5685`。此外飞书文档的实现方式也是这样的，`ZeroNode`永远在`FakeNode`前。

```html
<div contenteditable="true"><span contenteditable="false" style="background:#eee;"><span style="height: 0px; color: transparent; position: absolute;">&#xFEFF;</span>Void</span><span>!</span></div>
```

## Void IME
在这里我还发现了一个很有趣的事情，是关于`ContentEditable`以及`IME`的交互问题。在`slate`的`issue`中发现，如果最外层节点是`editable`的，然后子节点中某个节点是`not editable`的，然后其后续紧接着是`span`的文本节点，当前光标位于这两者中间，此时唤醒`IME`输入部分内容，如果按着键盘的左键将`IME`的编辑向左移动到最后，则会使整个编辑器失去焦点，`IME`以及输入的文本也会消失，此时如果在此唤醒`IME`则会重新出现之前的文本。这个现象只在`Chromium`中存在，在`Firefox/Safari`中则表现正常。

```html
<div contenteditable="true"><span contenteditable="false" style="background:#eee;">Void</span><span>!</span></div>
```

这个问题我在`https://github.com/ianstormtaylor/slate/pull/5736`中进行了修复，关键点是外层`span`标签有`display:inline-block`样式，子`div`标签有`contenteditable=false`属性。

```html
<div contenteditable="true"><span contenteditable="false" style="background: #eee; display: inline-block;"><div contenteditable="false">Void</div></span><span>!</span></div>
```
