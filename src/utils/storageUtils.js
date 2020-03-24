/* 进行local数据存储管理的工具模块 */

import store from 'store'
const USER_KET = 'user_key'

export default{
    /* 保存user */
    saveUser(user){
    //   //手动转换user类型
    //   localStorage.setItem(USER_KET,JSON.stringify(user))//localStorage只支持string类型的存储,但它不会将JSON对象转成字符串
    
    //使用store库自动转换
    store.set(USER_KET,user)
    },


    /* 读取user */
    getUser (){
        // return JSON.parse(localStorage.getItem(USER_KET) || '{}')
        return store.get(USER_KET) || {} 
    },



    /* 删除user */
    removeUser(){
        // localStorage.removeItem(USER_KET)
        store.remove(USER_KET)
    }
}