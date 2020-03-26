/* 入口js */

import React from 'react'
import ReactDOM from 'react-dom'//写库尽量看提示
import { Provider } from 'react-redux'

import App from './App' //引入自定义组件，在同一目录下先加点
import store from './redux/store'


ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
),
document.getElementById("root")
)