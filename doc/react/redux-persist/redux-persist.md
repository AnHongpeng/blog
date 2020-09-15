# redux-persist 使用介绍

> 2018.03.01 发布，最后更新于 2019.07.18

持久化和再水化 Redux Store，当前版本 V5.9.1

## （一）基本用例

基本用例中涉及配置 `persistReducer` 和 `persistStore`。**重要：**每个应用均要确定 `state` 合并等级，默认1级。

```js
// configureStore.js

import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
```

如果要结合 react 使用，使用 [PersistGate](https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md) 来包裹应用的根元素。这会延迟 APP 的 UI 渲染直到持久化数据被重新取回并且存入 redux store。**注意**`PersistGate` 的 `loading` 属性可以是 null 或其他任何 react 实例。(e.g. `loading={<Loading />}`)

```js
import { PersistGate } from 'redux-persist/integration/react'

// ... normal setup, create store and persistor, import components etc.

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootComponent />
      </PersistGate>
    </Provider>
  );
};
```

## （二）线上资源

* [Github redux-persist](https://github.com/rt2zz/redux-persist)
