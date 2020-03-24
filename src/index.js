/* 入口js */

import React from 'react'
import ReactDOM from 'react-dom'//写库尽量看提示

import App from './App' //引入自定义组件，在同一目录下先加点
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取local中保存的user，保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;
//将App组件标签渲染到index页面的div上
ReactDOM.render(<App/>,document.getElementById("root"))//渲染到哪个容器里面看index.html