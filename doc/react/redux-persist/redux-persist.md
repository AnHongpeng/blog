# Redux Persist 实践记录

> 2019.08.07 发布，最后更新于 2019.08.07

## （一）概念

[redux-persist](https://github.com/rt2zz/redux-persist) 定位：对 Redux Store 进行持久化与解冻。

对于每个使用 Redux Persist 的应用来说，决策使用何种 Level 的 state merge 机制是至关重要的，默认为 Level 1。

持久化意味着：State 从 Store 持久化至 LocalStorage，即从内存持久化到浏览器本地存储；

解冻意味着：State 从 LocalStorage 解冻至 Store，即从浏览器本地存储解冻至内存；

## （二）创建 store 实例

`store.js`：

```js
/**
 * @File: store根文件
 */
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import createRootReducer from './reducers'
import initialStore from '@/constants/initialStore'
export const history = createBrowserHistory()

function configureStore(preloadedState) {
  const NODE_ENV = process.env.NODE_ENV
  const persistConfig = { // ReduxPersist 的持久化配置
    key: 'root',
    storage, // defaults to localStorage for web and AsyncStorage for react-native
    whitelist: ['account'],
  }
  const logger = createLogger({ // 配置 redux-logger: https://github.com/LogRocket/redux-logger#options-description
    duration: true,
    collapsed: true,
  })
  // https://github.com/rt2zz/redux-persist#persistreducerconfig-reducer
  // 得到持久化了的并且联结了 ReactRouter 的 Reducer
  const persistedReducer = persistReducer(persistConfig, createRootReducer(history))
  let middlewares = [
    routerMiddleware(history), // for dispatching history actions
  ]
  let composeEnhancers = compose
  if (NODE_ENV === 'development') { // 做本地开发环境的配置区分
    middlewares.push(logger)
    composeEnhancers = composeWithDevTools
  }
  return createStore(
    persistedReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  )
}

const store = configureStore(initialStore)
// https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
export const persistor = persistStore(store)
export default store
```

## （三）使用 PersistGate

通过 `PersistGate` 包裹 React 根组件。它会延迟应用的 UI 渲染直到我们持久化了的数据完全恢复并存储至 Redux。`PersistGate` 的 `loading` prop 可以设为 `null` 或任何其他 React 实例（eg.`loading={<Loading />`）

`App.js`：

```js
/**
 * @File: 根组件
 * @Docs: https://github.com/supasate/connected-react-router#usage
 */
import React, { Component } from 'react'
import { LocaleProvider } from 'antd'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import store, { history, persistor } from './store'
import RouterLayout from './pages/RouterLayout'
class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
              <RouterLayout />
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      </LocaleProvider>
    )
  }
}
export default App
```

## （四）State Reconciler

State reconcilers define how incoming state is merged in with initial state.

1.hardSet：硬合并即将到来的 State。对于深层嵌套的持久化 Reducer 树场景或者 Reducer 无需依赖 initialState 的场景这会非常适用。

* incoming state: { foo: incomingFoo }
* initial state: { foo: initialFoo, bar: initialBar }
* reconciled state: { foo: incomingFoo } // note bar has been dropped

2.autoMergeLevel1 (default)：会自动合并一个层次深度。自动合并意味着如果在 REHYDRATE Action 过程中通过 Reducer 将 Store 的一些子节点变更了，那么会进行忽略。Level 1 意味着仅浅合并一个层级。

* incoming state: { foo: incomingFoo }
* initial state: { foo: initialFoo, bar: initialBar }
* reconciled state: { foo: incomingFoo, bar: initialBar } // note incomingFoo overwrites initialFoo

3.autoMergeLevel2：它的行为类似 autoMergeLevel1，只是它进行了2层的浅合并。

* incoming state: { foo: incomingFoo }
* initial state: { foo: initialFoo, bar: initialBar }
* reconciled state: { foo: mergedFoo, bar: initialBar } // note: initialFoo and incomingFoo are shallow merged

## （五）Blacklist & Whitelist

我们团队目前推荐使用白名单，仅在业务必要性场景使用 Redux 持久化存储。

```js
// BLACKLIST
const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['navigation'] // navigation will not be persisted
};

// WHITELIST
const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['navigation'] // only navigation will be persisted
}
```
