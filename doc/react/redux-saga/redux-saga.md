# 理解、使用 redux-saga

## （一）定位

* 目标：使 Redux 应用中副作用（例如异步获取数据、读取本地缓存 localStorage/Cookie、监听并更新 DOM 等）的管理更容易、执行更高效、测试更简单、编码更优雅；
* 工作方式（watcher -> worker）：“监听 -> 执行”的工作方式。它是一个 `redux` 中间件。可以想象为为应用启动了一个独立的“监听线程”，输入是 `action`，过程中能访问完整的 `redux state`，输出新的 `action`，这样使得 `action` 的编写保持简洁；
* 特点：它使用了 `ES6` 的 `Generator` 特性；
* 特点：声明式的 `Effects`，便于测试；
* 特点：能很直观简洁地编码复杂异步问题，适合逻辑复杂的应用；

## （二）重要概念

### 连接 Redux Store

使用 `redux-saga` 这个中间件连接 Redux Store 后就可以在应用中使用 Saga 了：

``` js
// main.js:
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import mySaga from './sagas'

// 创建 saga 中间件
const sagaMiddleware = createSagaMiddleware()
// 创建 Redux Store 实例，并将 Saga 中间件挂载到 Store 上。之后每次执行 store.dispatch(action) 都会经过 Saga 中间件的处理
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// 运行 Saga
sagaMiddleware.run(mySaga)

// 继续渲染应用
```

### 声明式 Effects

在 `redux-saga` 世界中，Effect 是什么？

> An effect is a plain JavaScript Object containing some instructions to be executed by the saga middleware.

即 Effect 本质上是一个普通对象，包含着一些指令信息，这些指令最终会被 saga 中间件解释并执行。

一个 Effect 可以是这样：

``` js
{
  CALL: {
    context: null,
    fn: ajaxLib.get,
    args: ['/fetchUrl']
  }
}
```

创建并执行 Effect 的示例：

``` js
function* fetchData() {
  const effect = call(ajaxLib.get, '/fetchUrl') // 创建 effect
  const res = yield effect // 执行 effect，即调用 ajaxLib.get('/fetchUrl')
}
```

其中，

* `call`方法用来创建 Effect 对象，它是一个 Effect Factory；
* `yield`  语法将 effect 对象传给 Saga 中间件，被解释执行并返回值；

类似 `call`，`redux-saga` 还提供了很多 Effect Factory，比较常用的有：

* `put(action)`：创建一个 Effect 描述信息，用来命令中间件向 Store 发起一个 action。相当于在 Saga 中调用 `store.dispatch(action)`；
* `take(pattern)`：创建一个 Effect 描述信息，用来命令中间件在 Store 上等待指定的 action。 在发起与 pattern 匹配的 action 之前，Generator 将暂停。即它会阻塞当前 Saga，直到匹配到指定的 action，代码才会继续执行；
* `fork(fn, ...args)`：类似 `call`，不同的是它以非阻塞调用的形式命令中间件执行 fn 并返回一个 Task 对象；
* `cancel(task)`：命令中间件取消一个 Task 的执行；

### Call vs Fork 阻塞与非阻塞调用

`call` 和 `fork` 都是用来执行指定函数 fn，区别在于：

* call effect 会阻塞当前 Saga 的执行，直到被调用函数 fn 返回结果，才会执行下一步代码；
* fork effect 则不会阻塞当前 Saga，会立即返回一个 task 对象；

## （三）工作流程

![redux-saga 工作流程](https://gw.alipayobjects.com/zos/rmsportal/fkpkHBwmTAJtjgyDhMto.png?x-oss-process=image/watermark,type_d3F5LW1pY3JvaGVp,size_14,text_TG92ZXN1ZWVl,color_FFFFFF,shadow_50,t_80,g_se,x_10,y_10)

## （四）对比 redux-thunk

[redux-thunk](https://github.com/reduxjs/redux-thunk) 以中间件的形式来增强 `redux store` 的 `dispatch` 方法，即支持 `dispatch(function)`。这样不仅可以集中地管理副作用，并且可以将副作用操作从视图层编码中分离出去。用发送一个异步请求举例：

``` js
// action.js:
// fetchData 函数是一个 actionCreator，它返回的回调中进行异步操作
export function fetchData(data) {
  return (dispatch, getState) => {
    ajaxLib.post('/fetchUrl', data)
      .then(res => dispatch({ type: 'FETCH_SUCCEEDED', payload: res }))
      .catch(err => dispatch({ type: 'FETCH_FAILED', error: err }))
  }
}

// 视图层 XXX Component.js：
const { dispatch } = this.props
dispatch(fetchData({ userId: 1 }))
```

对比使用 `redux-saga` 实现相同功能的编码如下：

``` js
// saga.js:
// fetchData 函数是一个 worker saga，它包含着业务逻辑。使用 Generator 函数让异步代码逻辑看起来像同步的
function* fetchData(action) {
  const { payload } = action
  try {
    const res = yield call(ajaxLib.post, '/fetchUrl', payload)
    yield put({ type: 'FETCH_SUCCEEDED', payload: res })
  } catch(err) {
    yield put({ type: 'FETCH_FAILED', error: err })
  }
}

// watchFetchData 函数是一个 watcher saga，它监听每一次的 dispatch(action)，如果该 action.type 是 'FETCH'，
// 那么执行 fetchData 这个 worker saga
export function* watchFetchData() {
  yield takeEvery('FETCH', fetchData)
}

// 视图层 XXX Component.js:
// 这里 dispatch 的依然是一个 plain object
const { dispatch } = this.props
dispatch({
  type: 'FETCH',
  payload: {
    userId: 1
  }
})
```

对比使用 `redux-thunk` 的实现，可以将使用 `redux-saga` 的区别概括为以下几点：

* 业务相关的副作用管理转移到了单独的 saga 中，这使得视图层 `dispatch` 的 `action` 更加纯粹；
* `saga` 是 Generator 函数，其中的异步逻辑使用同步方式编码，更易读；
* 受益于 Generator，异步操作执行的成功与否可以使用 `try ... catch` 语句捕获处理；

## （五）结合 dva 和 umi 使用

### dva

`dva` 首先是一个基于 `redux` 和 `redux-saga` 的数据流方案，然后为了简化开发体验，`dva` 还额外内置了 `react-router` 和 `fetch`，所以也可以理解为一个轻量级的应用框架。

* 易学易用，仅有 6 个 `api`，对 `redux` 用户尤其友好，配合 `umi` 使用后更是降低为 0 `API`；
* `elm` 概念，通过 `reducers`, `effects` 和 `subscriptions` 组织 `model`
* 插件机制，比如 `dva-loading` 可以自动处理 `loading` 状态，不用一遍遍地写 `showLoading` 和 `hideLoading`
* 支持 `HMR`，基于 `babel-plugin-dva-hmr` 实现 `components`、`routes` 和 `models` 的 `HMR`

他最核心的是提供了 `app.model` 方法，用于把 `reducer`, `initialState`, `action`, `saga` 封装到一起，比如：

```js
app.model({
  namespace: 'products',
  state: {
    list: [],
    loading: false,
  },
  subscriptions: [
    function(dispatch) {
      dispatch({ type: 'products/query' })
    }
  ],
  effects: {
    ['products/query']: function*() {
      yield call(delay(800))
      yield put({
        type: 'products/query/success',
        payload: ['ant-tool', 'roof']
      })
    },
  },
  reducers: {
    ['products/query'](state) {
      return { ...state, loading: true, }
    },
    ['products/query/success'](state, { payload }) {
      return { ...state, loading: false, list: payload }
    }
  }
})
```

其中 `model` 的 `key`：

* `namespace` - 对应 `reducer` 在 `combine` 到 `rootReducer` 时的 `key` 值；
* `state` - 对应 `reducer` 的 `initialState`；
* `subscription` - elm@0.17 的新概念，在 `dom ready` 后执行，详见：[A Farewell to FRP](https://elm-lang.org/news/farewell-to-frp)；
* `effects` - 对应 `saga`，并简化了使用；
* reducers；

`dva` 通过 `model` 的概念把一个领域的模型管理起来，包含同步更新 `state` 的 `reducers`，处理异步逻辑的 `effects`，订阅数据源的 `subscriptions`。`dva` 提供了 `connect` 方法，将 `model` 和 `component` 关联起来，这个 `connect` 就是 `react-redux` 的 `connect`。

#### 数据流向

数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 `dispatch` 发起一个 `action`，如果是同步行为会直接通过 `Reducers` 改变 `State` ，如果是异步行为（副作用）会先触发 `Effects` 然后流向 `Reducers` 最终改变 `State`，所以在 `dva` 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致（也是来自于开源社区）

![数据流向](https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png)

明确 `action`、`dispatch` 和 `reducer` 的关系：

* `action` 是改变 `State` 的唯一途径，但是它只描述了一个行为；
* `dipatch` 可以看作是触发这个行为的方式；
* `reducer` 描述如何改变数据；

#### Subscription

`Subscriptions` 是一种从源获取数据的方法，它来自于 `elm`。

`Subscription` 语义是订阅，用于订阅一个数据源，然后根据条件 `dispatch` 需要的 `action`。数据源可以是当前的时间、服务器的 `websocket` 连接、`keyboard` 输入、`geolocation` 变化、`history` 路由变化等等。

```js
import key from 'keymaster'
...
app.model({
  namespace: 'count',
  subscriptions: {
    keyEvent({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({ type: 'add' }) })
    }
  }
})
```

### umi

Umi，中文可发音为乌米，是可扩展的企业级前端应用框架。Umi 以路由为基础，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求。

Umi 提供了哪些功能？

* 提供了丰富的插件，来服务一个项目的完整生命周期；
* 提供配置式路由和约定式路由；
* 支持配置 HTML 模板；
* 支持 Mock 数据；
* 内置支持 CSS Modules 和 Less；
* 等等...
