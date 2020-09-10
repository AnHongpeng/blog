# React Conf 2018 演讲笔记

## Part 1 - Sophie Alpert's keynote

自从 2013 年 React 发布以来，它的主要使命就是——让开发者更容易地构建好的 UI。当 React 团队想要增加新的特性时，通常会经过深思熟虑，新增一个 API 将会考虑非常多的事情，如果新增加的 API 能够让你做到一些以前不能做到的事情，如果可以显著简化组件里的代码和类库，让你的工作量减少，用户下载更少的代码，那新增 API 就是有价值的。

有很多方法可以实现 React 的使命，其中一点便是 **'Simplify hard stuff'**，尝试简化复杂的东西。`Suspense` 便是用来显著简化获取数据请求、代码分割和异步数据依赖的问题。

摘取 Dan Abramov 在冰岛的 JS Conf 演讲，这样描述 `Suspense`：

* Pause any state update until the data is ready
* Add async data to any component without "plumbing"
* On a fast network, render after the whole tree is ready
* On a slow network, precisely control the loading states
* There's both a high-level and a low-level API

另外一个提升 React 的方式就是 **'Performance'**，提升性能。最近和提升性能有关的内容有 `Time Slicing`。"Time Slicing" 可以确保你 APP 里面最重要的渲染会最先执行，解除主线程的阻塞，并且能让你的 APP 运行地更快速。

同样摘取 Dan Abramov 在冰岛的 JS Conf 演讲，这样描述 `Time Slicing`：

* React dosen't block the thread while rending
* Feels synchronous if the device is fast
* Feels responsive if the device is slow
* Only the final rendered state is displayed
* Same declarative component model

第三种提升方式是 **'Developer tooling'**，使用开发者工具帮助你 debug。一开始，React 就包含了对开发者友好的警告来帮助指出问题，随后在 React Dev Tools 中可以让你检查并且 debug 组件树。在 React 16.5 版本，引入了一个叫 `Profiler` 的新特性，它能够帮助我们了解到你的 APP 中到底发生了什么，然后更好地优化它。

但，现在的 React 有哪些糟糕的地方，总结起来主要有三个问题：

1. 'Reusing logic'，多组件间的逻辑复用问题。在 React 中我们主要使用组件来构建我们的应用。组件主要有两种主要的模式来复用代码，它们是高阶组件（Higher-order components）和渲染属性（Render props）。这两种模式对于某些场景来说是很好的，但是它们也造成了一个极大的缺点。在更加复杂的场景中你必须将它们抽离出去以重构你的 APP。这会导致一个问题，我们称之为“包装地狱”，过多的嵌套会造成很难去跟踪 state，如果能复用这类有状态的逻辑，而不需要修改组件的层级，那肯定是很好的方法。
2. 'Giant components'，逻辑杂乱无章的庞大的组件。经常会遇到，本应独立的逻辑代码被分散到不同的生命周期中去完成，非常难以跟踪。
3. 'Confusing classes'，理解 JavaScript 中的 class 需要较高的成本。目前为了使用 state 和生命周期，必须要使用 class 组件。如果你使用了 function 组件，增加了一些 state，将其转化为 class 组件，就要写很多模板式代码，而作用仅仅是用来定义一个 class 组件。大多初学者和很多有经验的的开发者曾向 React 团队抱怨过在 class 里面的绑定和转化工作相当令人困惑。并且很多时候并不明确何时该用 function 组件，一部分原因是担心早晚要将这个组件转换为 class 组件。class 不仅令人类困惑，它同样也令机器困惑，在压缩过的组件文件中，所有的 class 方法名都没有被压缩，而且也不会剔除掉没有使用过的方法，因为在编译时很难准确判断方法是否被使用。并且 class 会使得可靠的热加载变慢，class 组件的一些模式使得编译器优化变得更难。

接下来由 Dan Abranov 的演讲，为我们带来以上三个问题的解决方案。

## Part 2 - Dan's keynote

当 React 团队试图单独去解决以上三个问题中的一个时，又会令另一个问题变得更加严重。所以与其说是三个问题，不如说是一个问题的三个症状。这三个症状来源于一个问题 —— React 没有提供一个比 class 组件更简单、更小型、更轻量级的方式来添加 state 或生命周期，并且当你一旦使用了 class 组件，你没有办法在不造成“包装地狱”的情况下进一步地拆分它。

### useState

Dan 对 `useState` 这个 hook 的使用，做了简单示例。如果要实现一个简单的 `Input` 控件输入值后更新值的显示，传统做法是：

``` js
import React from 'react'
import Row from './Row'

export default class Gretting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Mary',
    }
    this.handleNameChange = this.handleNameChange.bind(this) // 需要处理函数以便调用
  }

  handleNameChange(e) {
    this.setstate({ // 事件处理函数中需要使用 setState 来更新 state
      name: e.target.value
    })
  }

  render() { // render 中需要获取 state 时需要使用 this.state.something
    return (
      <section>
        <Row label="name">
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </Row>
      </section>
    )
  }
}
```

改为使用 `useState` 这个 hook 后，去掉了冗余的模板式代码：

``` js
import React, { useState } from 'react'
import Row from './Row'

export default function Greeting(props) {
  const [name, setName] = useState('Marry')

  function handleNameChange(e) {
    setName(e.target.value)
  }

  return (
    <section>
      <Row label="name">
        <input
          value={name}
          onChange={handleNameChange}
        />
      </Row>
    </section>
  )
}
```

在这个例子中，不再需要 `this.state.something` 来获取 `state` 值，因为在 `state` 中的 `name` 变量在函数里已经可用。同样地，当我们想要设置 `state` 时，函数也可以让我们在其作用域内设置 `name` 的值。**`useState` 是一个 Hook，Hook 是 React 提供的函数，它可以让你在 function 组件中“钩”到一些 React 特性。**

### useContext

下一个要介绍的特性有关于在组件中读取 `context`。`context` 就像一种为子树准备的全局变量，它在读取当前主题或者是读取用户当前正在使用的语言时会非常有用。当所有组件都需要读取一个相同变量的时候，它可以有效避免总是通过 `props` 传值。

继续上面的例子，如果我们需要引入主题和区域设置，来改变界面显示，这里引入 `ThemeContext` 和 `LocaleContext`，传统的 render props 做法是：

``` js
import React from 'react'
import Row from './Row'
import { ThemeContext, LocaleContext } from './context' // 1.这里引入在另一个文件中定义好的 context

export default class Gretting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'Mary',
    }
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleNameChange(e) {
    this.setstate({
      name: e.target.value
    })
  }

  render() {
    return (
      <ThemeContext.Consumer> {/* 2.这里调用 ThemeContext.Consumer 来消费 theme context */}
        {theme => (
          <section className={theme}>
            <Row label="name">
              <input
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </Row>
            <LocaleContext.Consumer> {/* 3. 这里调用 LocaleContext.Consumer 消费 locale context */}
              {locale => (
                <Row label="language">
                  {locale}
                </Row>
              )}
            </LocaleContext.Consumer>
          </section>
        )}
      </ThemeContext.Consumer>
    )
  }
}
```

那么如何使用 Hook 来实现相同的功能呢：

``` js
import React, { useState, useContext } from 'react' // 2.类似地，引入 useContext
import Row from './Row'
import { ThemeContext, LocaleContext } from './context' // 1.同样是导入要使用的 context

export default function Greeting(props) {
  const [name, setName] = useState('Marry')

  // 3. 这里的 useContext 不止是读取了 context 值，它也订阅了组件。当 context 发生了变化，组件也随之更新
  const theme = useContext(ThemeContext)
  const locale = useContext(LocaleContext)

  function handleNameChange(e) {
    setName(e.target.value)
  }

  return (
    <section className={theme}> {/* 4.调用时不需要组件嵌套，使用变量就好 */}
      <Row label="name">
        <input
          value={name}
          onChange={handleNameChange}
        />
      </Row>
      <Row label="language">
        {locale}
      </Row>
    </section>
  )
}
```

两者比较，传统的 render prop API 方式，非常清楚地显示了它在做什么，但还是包含了一点点的嵌套，然而不仅仅是使用 context 情况下，在任何使用 render prop api 的场景中都会遇到这类额外嵌套的问题。而使用 Hook，完成了同样的事情，但是代码会更扁平。

那么，你可能想问 React 是如何知道 state 是和哪个 useState 相对应的，答案是 React 依赖于这些 Hook 调用的顺序，为了让它正确地运行起来，当你要使用 Hook 的时候，必须遵守**“不能在条件判断中调用 Hook”**，Hook 必须在你的组件顶层。

### useEffect

我们使用 `class` 时想用的另一个东西可能就是生命周期方法，我们会在生命周期中执行一些副作用，比如发送请求、调用浏览器 API 来检测 DOM 变化。所以我们需要一些能够执行副作用但又不在渲染阶段进行的操作，因为它还没有渲染完成。传统情况下我们通常会声明一个 `componentDidMount` 生命周期方法，然后在其中执行副作用。

例如，我们想在初始渲染后根据输入来更新浏览器标签页的标题，传统做法是：

``` js
componentDidMount() {
  document.title = this.state.name + ' ' + this.state.surname
}
componentDidUpdate() {
  document.title = this.state.name + ' ' + this.state.surname
}
```

这是一个典型的如何在 class 中执行副作用的例子。那么如何使用 Hook 来实现相同的功能呢。执行副作用的能力是 React 组件的又一个核心特性，这里需要引入 `useEffect` 这个 Hook：

``` js
import React, { useState, useContext, useEffect } from 'react'
...

export default function Greeting(props) {
  const [name, setName] = useState('Marry')
  const [surname, setSurname] = useState('Poppins')
  const theme = useContext(ThemeContext)
  const locale = useContext(LocaleContext)

  // useEffect 传入一个函数，我们在函数中执行副作用
  useEffect(() => {
    document.title = name + ' ' + surname
  })
}
```

`useEffect` 默认会在初始渲染和每一次更新渲染之后执行。当然如果出于性能考虑或者一些特殊的逻辑，可以选择不采取这种默认行为。后面 Ryan 的演讲会谈到一些关于这个的内容。

对比两种方式，传统的方式会把逻辑分开到不同的生命周期方法中，这是代码里为什么会出现 `componentDidMout`、`componentDidUpdate` 的原因，它们会在不同时间点被触发。我们有时在它们之间重复一些逻辑，虽然可以把这些逻辑放到一个函数里，但我们还是不得不在不同的地方调用它们，而且要记得保持一致。而通过 `useEffect` Hook，副作用默认具有一致性，而且可以选择不使用该默认行为。另外需要注意的是，在 class 组件中需要访问 this.state，这需要一个特殊的 API 来完成，而使用 Hook 后它已经存在于函数的作用域中了。

另外有些时候，我们想通过生命周期方法实现订阅功能。比如去订阅一些浏览器 API，它会提供给你一些值，比如窗口的大小，随后你需要组件跟随着这些值进行更新。我们在 class 组件中实现的方法是：

``` js
constructor(props) {
  super(props)
  this.state = {
    width: window.innerWidth, // 1.在 this.state 中初始化
  }
  this.handleResize = this.handleResize.bind(this) // 4.对事件处理函数进行绑定
}
componentDidMount() { // 3.在 componentDidMount 中进行事件监听
  window.addEventListener('resize', this.handleResize)
}
componentWillUnmount() { // 6.最后还需要在组件销毁时取消订阅，以免造成内存泄漏
  window.removeEventListener('resize', this.handleResize)
}
handleResize() { // 5.声明 handleResize 函数
  this.setState({
    width: window.innerWidth
  })
}
render() { // 2.在 render 中渲染窗口宽度
  return (
    <section>
      <Row label="width">
        {this.state.width}
      </Row>
    </section>
  )
}
```

那么如何使用 Hook 来实现这个功能：

``` js
const [width, setWidth] = useState(window.innerWidth) // 2.初始化 state
useEffect(() => { // 1.可以使用多次 useEffect 来实现不同的副作用
  const handleResize = () => setWidth(window.innerWidth) // 3.声明 handleResize 函数
  window.addEventListener('resize', handleResize)

  return () => { // 4.useEffect 可以选择返回一个函数，React 会在 Effect 之后来执行这个函数进行清除操作
    window.removeEventListener('resize', this.handleResize)
  }
})
```

在使用 Hook 时，我们分离代码不是基于生命周期函数的名字，而是基于这段代码要做什么。

### custom hook

在 function 组件中做更多的事，组件会逐渐变得庞大，那么如何来复用组件中的逻辑呢，将公有的逻辑封装起来提供给很多组件用，该如何实现？有趣的是，Hook 调用实际上就是函数调用，而且组件也是函数，那么我们是如何在两个函数之间复用逻辑呢，把它抽取到另外一个函数里就可以了。来看示例：

``` js
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', this.handleResize)
    }
  })
  return width // 注意这里 return 了 width
}

export default function Greeting(props) {
  const width = useWindowWidth()

  return (
    ...
  )
}
```

这里有一个约定，我们把 `useWindowWidth` 这种函数叫做 `custom hook`。按照约定，**custom hook 的名字需要以 `use` 开头**，这样约定主要有两个原因：

1. React 会读取函数名或修改函数名，以 `use` 开头来命名 `custom hook`，可以让我们自动检测是否违反了之前提到的“不能在条件判断里使用 hook”这个约定。
2. 以 `use` 开头的函数表示这个函数是与 `state` 相关的。

进一步地，借助 custom hook，之前进行输入控件值更新来重新设置标签页标题的例子还可以进一步简化，这里给出一个完整示例：

``` js
import React, { useState, useContext, useEffect } from 'react'
import Row from './Row'
import { ThemeContext, LocaleContext } from './context'


export default function Greeting(props) {
  const name = useFormInput('Marry')
  const surname = useFormInput('Poppins')
  const theme = useContext(ThemeContext)
  const locale = useContext(LocaleContext)
  const width = useWindowWidth()
  useDocumentTitle(name.value + ' ' + surname.value)

  return (
    <section className={theme}>
      <Row label="Name">
        <input {...name} />
      </Row>
      <Row lable="Surname">
        <input {...surname} />
      </Row>
      <Row label="Language">
        {locale}
      </Row>
      <Row label="Width">
        {width}
      </Row>
    </section>
  )
}

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  function handleChange(e) {
    setValue(e.target.value)
  }

  return {
    value,
    onChange: handleChange
  }
}

// custom hook 就是一般的 javascript 函数，它们可以传递参数，可以有返回值
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  })
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', this.handleResize)
    }
  })
  return width
}
```

总结一下，**Hook 能够让大家复用有状态的逻辑，并将其从组件中提取出来，可以进行分别测试。逻辑可以在不同组件之间复用，并且可以避免“包装地狱”。重要的是，Hook 不是一个破坏性的改动，它完全向后兼容，是严格的可添加性的。**

最后，笔者想用 Dan 在会上的一段话来结束本篇文章：

> “最后，我想讲讲我个人的一些观点。我从四年前学习 React。我遇到的第一个问题就是为什么要使用 JSX。嗯，第二个问题是 React 的 logo 到底有什么含义。React 项目没有起名叫‘原子’，它并不是一个物理引擎。有一个解释是，React 是基于反应（reactions）的，原子也参与了化学反应，因此从 reactions 到 React。但是 React 没有官方承认过这种说法。我发现了一个对我来说更有意义的解释。我是这样思考的，我们知道物质是由原子组成的。我们学过物质的外观和行为是由原子和其内部的属性决定的。而 React 在我看来是类似的，你可以使用 React 来构建用户界面，将其拆分为叫做组件的独立单元。用户界面的外观和行为是由这些组件及其内部的属性决定的。具有讽刺意味的是，原子一词，在字面上是不可分割的。当科学家们首次发现原子的时候，他们认为原子是我们发现的最小的物质。但是之后他们就发现了电子，电子是原子内部更小的微粒。后来证明实际上电子更能描述原子的运行原理。我对 hook 也有类似的感觉。我感觉 hook 不是一个新特性，而是 hook 提供了使用我们已知特性的的能力，如 state、context 和生命周期。而且我感觉 hook 就像 React 的一个更直观的表现。Hook 在组件内部真正解释了组件是如何工作的。我感觉 hook 一直在我们的视线里隐藏了 4 年。事实上，如果看看 React 的 logo，可以看到电子的轨道，而 Hook 好像一直就在那里，谢谢大家。”
