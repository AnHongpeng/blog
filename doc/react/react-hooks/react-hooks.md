# 深入理解 React Hook

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

## （一）为什么需要 React Hook

Hook 提案出来前，React 团队总结了三个 React 比较糟糕的地方：

一是，**组件间状态和逻辑的复用很难。**有两个复用方案，一个是使用 [Render Props](https://react.docschina.org/docs/render-props.html)，另一个是使用 [高阶组件](https://react.docschina.org/docs/higher-order-components.html)，但它们都需要重新组织组件结构，过多的组件间嵌套会形成“包装地狱”，这会令组件间状态的跟踪非常困难。

二是，随着项目维护，**很容易出现拥有相当多逻辑的大型组件，它们充斥着状态逻辑与副作用，并且每个生命周期方法中包含着不相关的逻辑，**这很容易产生 bug。

三是，为了使用 `state` 和生命周期方法，就必须要使用 `class` 组件，而**理解 `class` 需要较高的成本，并且 `class` 在编译时不能很好地被压缩（方法名无法被压缩，而且也不会剔除掉没有使用过的方法），`class` 也会让热加载变慢。另外，对于开发者来说，也很难去区分何时该用 `class` 组件而何时该用 `function` 组件。**

对于第一点，我们需要复用组件间有状态的逻辑，但又不想修改组件的层级；对于第二点，我们不想将本应独立的逻辑拆分在不同的生命周期方法中；对于第三点，我们需要在避开 `class` 的情况下在组件中使用更多的 React 特性。

而 React Hook，就能解决以上三个问题。

## （二）使用 React Hook

那么 React Hook 究竟是什么呢？一句话概括，**React Hook 是 React 提供的函数，它可以让你在 `function` 组件中“钩”到一些 React 特性。**

下面依次讲解各 React Hook API 的使用方式及实践关键点。

### useState

一段非常简单的使用 `useState` 的示例：

``` js
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

例子中，在 `Example` 这个函数组件内部，通过 `const [count, setCount] = useState(0)` 设置了 `count` 这个 `state`，并且设置其初始值为 `0`，点击按钮时就会调用 `setCount()` 函数来更新 `count` 这个 `state` 值。

`useState()` 方法唯一的参数就是初始 state 值，调用它将返回一个数组，数组中包含了当前 state 值以及一个用来更新 state 的函数。一般我们通过[数组解构赋值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)将调用结果赋值给变量（示例中赋值给了 `count` 和 `setCount`）。

我们也可以多次调用 `useState` 来声明多个 `state` 变量：

``` js
function ExampleWithManyStates() {
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);
```

相较于传统 `class` 组件管理 `state` 的方式，使用 Hook 便不再需要一个特定的 `this.state.xxx` 来取 `state`，我们可以直接使用 `state` 变量。也不需要通过 `this.setState()` 将新的 `state` 值合并入当前 `state` 中，而是通过调用 Hook 返回的设置 `state` 函数来将 `state` 替换为新的值。

可见，`useState` 提供给我们可以在函数组件中初始化声明 `state`、读取 `state` 值以及更新 `state` 值的能力。

### useEffect

`useEffect` 可以让我们在函数组件中执行副作用操作。哪些操作是副作用操作呢？比如请求接口数据、订阅一个数据更新、设置定时器、通过浏览器 API 监听 DOM 变化、手动更改 React 组件中的 DOM 等等，这些都属于副作用操作。在 `class` 组件中，这些副作用往往被分离到不同的生命周期方法中执行，而使用 `useEffect` 可以将这些本该独立的逻辑集中起来编写。来看一个简单示例：

``` js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

每次点击按钮后，都会更新标签页标题中点击次数的显示。

`useEffect()` 第一个参数接收一个包含着副作用操作的函数，默认情况下该函数会在组件首次渲染后、每次更新渲染后以及组件销毁后被调用，对应着 `class` 组件 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 这三个生命周期。

有些副作用我们希望在组件销毁时将它们清除掉以防止内存泄漏，比如清空定时器或者取消数据的订阅。传给 `useEffect` 第一个参数的函数可以 `return` 一个函数，这个 `return` 的函数会在组件卸载时调用执行：

``` js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

例子中在组件销毁时将会取消订阅好友在线状态。

另外需要注意的是，默认情况下每次渲染后都会执行 Effect 函数，React 也会在执行当前 Effect 之前对上一个 effect 进行清除操作。如果我们想改变这个默认行为呢，不想让 Effect 函数在每次渲染后都执行从而影响性能，该如何做？这时就要用到 `useEffect` 的第二个参数了：

``` js
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // 仅在 props.friend.id 发生变化时，重新订阅
```

第二个参数接收一个数组，如果该数组中的值在前后渲染中没有改变，那么 React 将跳过这次 Effect 函数的执行。

那如果想得到一个只运行一次的 Effect 函数怎么做呢？`useEffect` 第二个参数传入空数组 `[]` 就可以了。这就告诉 React 你的 Effect 不依赖于 `props` 或 `state` 中的任何值，所以它永远都不需要重复执行。

类似 `useState`，我们可以将不同的但又相对独立的逻辑写进几个 `useEffect` 中，并一个个单独调用它们。

可见，相比于传统 `class` 组件中定义副作用的方式，使用 `useEffect` 可以让逻辑更集中，它们不会被分割到各个不同的生命周期方法中去，同时也可以很方便地定义如何清除 Effect 以及是否需要跳过不必要的 Effect 执行。

### useContext

`const value = useContext(MyContext)`。它接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。

当上层组件中最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重新渲染，并使用最新传递给 `MyContext provider` 的 `context value` 值。

一个简单示例：

``` js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### Custom Hook

如果我们想把 Hook 中的逻辑复用到不同组件中去，该如何做？Hook 是函数，函数组件也是函数，那么在函数之间复用逻辑，再抽出一个函数就可以了，这就要用到自定义 Hook：

``` js
import React, { useState, useEffect } from 'react';

// 自定义 Hook，该 Hook 将被复用
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}

function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

示例中 `useFriendStatus` 便是自定义 Hook，它在 `FriendStatus` 和 `FriendListItem` 中被复用。就是这么简单，有几个点需要注意：

* 自定义 Hook 必须以 `use` 开头命名。这有助于 React 区分是一般函数还是带有状态操作的自定义 Hook 函数；
* 在不同组件中不会共享自定义 Hook 中的 `state`。每次使用自定义 Hook 时，其中的所有 `state` 和副作用都是完全隔离的；
* 同一般函数一样，我们可以为自定义 Hook 传递参数，也可以为它指定返回值；

有了自定义 Hook，我们可以很方便地进行组件间的逻辑复用，更可贵的是这不需要改变组件嵌套结构，因此也规避了“包装地狱”问题。

到这里，三个基础 Hook：`useState`、`useEffect`、`useContext`，以及用于组件间逻辑复用的 `Custom Hook` 的使用就介绍完了。接下来是一些用于特定场景的额外 Hook 补充。

### useReducer

管理 `state` 时还会遇到下面这些情况：

* 需要用更为复杂的结构来表示 `state`，比如一个拥有多个属性的对象或者数组；
* 更新 `state` 的逻辑较为复杂或者在不同场景下会对同一个 `state` 做不同的更新；
* 将要更新的 `state` 值依赖于当前 `state` 值，需要经过计算；

这时候 `useReducer` 就派上用场了，它是 `useState` 的替代方案，用来定义比较综合的 `state` 更新情况。

`const [state, dispatch] = useReducer(reducer, initialArg, init)`

`useReducer` 接收一个 `(state, action) => newState` 的 reducer 函数，返回当前的 state 以及与其配套的 `dispatch` 方法。更新流程类似 Redux，通过 `dispatch` 一个 `Action` 对象来更新状态值，不同的是它是用来更新 `state` （而不是用来更新 Redux Store）的。

来看一个完整示例：

``` js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

示例中为计数器 `state` 设置了初始值 `{ count: 0 }`，并在 `reducer` 函数中定义了如何处理 `dispatch` 不同 `action.type` 时的情况——计数器增或减，并且最终将要更新的 `state return` 出来。

一个更为特殊的情况是，我们无法确定初始的 `state` 值是什么，而是要根据组件当前情况来推算出初始的 `state` 值，这个时候就要用到 `useReducer` 的第三个参数 `init` 函数了，`state` 初始值会被设置为 `init(initialArg)`（`initialArg` 是 `useReducer` 的第二个参数）的返回值。来看示例：

``` js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload); // 调用 init 函数得到 state 初始值
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>

        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```

另外，示例中，初始化 `state` 值的逻辑写在了 `init` 函数里，它被提取到了 `reducer` 函数的外部，这也有助于“重置 state 值”这类功能的代码复用，只要在 `reducer` 中调用 `init` 函数就可以拿到初始值了。

### useMemo 和 useCallback

先说“记忆化”的概念，在计算机科学中，记忆化（memoization）是一种提高程序运行速度的优化技术。通过储存大计算量函数的返回值，当这个结果再次被需要时将其从缓存提取，而不用再次计算来节省计算时间。

`useMemo` 和 `useCallback` 就是用来实现记忆化的，`useMemo` 返回一个记忆化的值而 `useCallback` 返回一个记忆化的回调函数。

`useMemo` 语法：`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

把计算记忆化值的函数和其依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才会重新计算记忆化值。这种优化有助于避免在每次渲染时都进行高开销的计算。需要注意的是，由于传入 `useMemo` 的函数会在渲染期间执行，因此在该函数内部不应出现与渲染无关的副作用操作，副作用操作应当被移到 `useEffect` 中。

再来看 `useCallback` 语法：

``` js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

把内联回调函数及其依赖项数组作为参数传入 `useCallback`，返回该回调函数的记忆化版本，该回调函数仅在某个依赖项改变时才会更新。

### useRef

`const refContainer = useRef(initialValue)`

`useRef` 返回一个 ref 对象，该对象的 `.current` 属性被初始化为传入的参数（`initialValue`）。来看示例：

``` js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

`useRef` 提供给我们在函数组件中使用 Ref 的能力。

### useImperativeHandle

`useImperativeHandle(ref, createHandle, [deps])`

`useImperativeHandle` 可以在使用 Ref 时自定义暴露给父组件的实例值。示例：

``` js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

### useLayoutEffect

它与 `useEffect` 唯一的区别是它会在所有的 DOM 变更之后**同步**调用 Effect 函数。

### useDebugValue

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的相关信息：

``` js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边将会显示信息
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

## （三）React Hook 约定与最佳实践

### 不能在循环语句、条件判断或嵌套函数中调用 React Hook

由于 React 是通过 Hook 的调用顺序来将其状态信息与处理行为相对应的，因此在重新渲染时 Hook 的调用顺序必须是确定的。React Hook 应出现在函数组件的最顶层。

### React Hook 不能出现在一般函数中

只有两个地方可以调用 React Hook：

1. 函数组件中；
2. 自定义 Hook 中；

### 使用 ESLint 插件帮助警告提示

编码阶段，可以通过安装 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) 这个 ESLint 插件来帮助我们遵守 Hook 约定的规则，出现违规编码时会收到警告。
