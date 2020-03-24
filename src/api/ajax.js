/* 
能发送异步ajax请求的函数模块 
封装axios库
函数返回值是promise对象

1、优化1：统一处理请求异常
方法：在外层包一个自己创建的promise对象；在请求出错时不使用reject(error)，而是显示错误提示
原理：resolve()方法会把成功请求的返回值传递出去，reject()方法会把请求失败的错误信息传递。
这里不使用reject()方法就不会把错误信息传递出去，而是基于错误信息进行提示。
在外部调用接口请求函数，只会接收成功请求的返回值，对于错误信息不用自己再捕获处理，在这里统一弹窗提示。
2、优化2：异步得到的不是response，直接将response.data传递出去
*/

import axios from 'axios'
import {message} from 'antd'

//url必传，data可选所以传入默认值{}，type常用get方式，给type默认值以get方式传请求时就不需要传参
export default function ajax(url,data={},type){
    return new Promise((resolve,reject)=>{
       let promise;
       //执行异步请求
       if(type==='GET'){//发get请求
        promise = axios.get(url,{//配置对象
            params:data//指定请求参数
        })
       }
       else{//发post请求
        promise = axios.post(url,data)//post请求直接传输携带所有参数的对象
       }
       //成功了调用resolve(value)
       promise.then(response=>{
           resolve(response.data) //responde.data是对象，里面包含{status:0,data:} {status:1,msg:错误信息}
       //失败了不调用reject，显示异常信息
       }).catch(error=>{
           message.error("请求出错了：" + error.message)
       })
    });   
}

// ajax('/login', {username:'admin',password:'admin'}, 'POST')//调用登录接口请求函数
// ajax('/manage/user/add',{username:'admin',password:'admin',phone:12456358421},'POST')//添加用户接口请求函数
