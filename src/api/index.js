/* 
包含应用中所有接口请求函数的模块
一个项目中有很多个接口，每个接口发送ajax请求都需要调用ajax.jx中定义的接口请求函数
但是不同接口的接口请求函数的url和请求方式是固定的，变化的只是携带的请求参数
现将所有接口的请求函数统一封装，给ajax()的url和type传入固定参数，让函数参数只留请求参数，用户在调用封装后的函数只需要传入请求参数即可
 */
/* 每个接口的请求返回值都是promise对象 */

import {message} from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

 /* 从当前端口发送请求给代理，代理转发到5000的端口。空字符代表当前所在端口，不一定是3000 */
 const BASE = ''

//登录接口
export const reqLogin = (username,password)=>ajax(BASE + 'login',{username,password},'POST')

//获取一级/二级分类列表
export const reqCategorys = (parentId)=>ajax(BASE+'/manage/category/list',{parentId},'GET')

//添加分类
export const reqAddCategorys = (categoryName,parentId)=>ajax(BASE+'/manage/category/add',{categoryName,parentId},'POST')

//修改分类名称
export const reqUpdateCategorys = ({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize},'GET')

/* 
搜索商品分页列表
searchType：搜索类型，productName/productDesc
*/
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
},'GET')

//商品上下架
export const reqUpdateStatus = (productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product)=>ajax(BASE+'/manage/product/'+ (product._id?'update':'add'), product ,'POST')

//获取一个分类
export const reqCategory = (categoryId)=>ajax(BASE+'/manage/category/info',{categoryId},'GET')

//删除图片
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')

//获取角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list',undefined,'GET')

//添加角色
export const reqAddRole = (roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')

//更新角色（包括授权等）
export const reqUpdateRole = (role)=>ajax(BASE+'/manage/role/update',role,'POST')

//获取所有用户列表
export const reqUsers = () => ajax(BASE+'/manage/user/list',undefined,'GET')

//删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+ (user._id?'update':'add'),user,'POST')

/* jsonp请求的天气接口请求函数 */
export const reqWeather = (city)=>{
    return new Promise((resolve,reject)=>{
        const url= `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送jsonp请求
        jsonp(url,{},(err,data)=>{
        //如果成功了
        if(!err && data.status==='success'){
            //取出需要的数据
            const {dayPictureUrl,weather} = data.results[0].weather_data[0]
            resolve({dayPictureUrl,weather})
        }else{
            //如果失败了
            message.error('获取天气信息失败！')
        }
    })
  })
}
/* 
jsonp解决get请求的跨域问题 
不是ajax请求，是普通的get请求
浏览器端通过script标签发送请求，script标签用来获取js代码数据
服务器端返回函数执行的js代码
*/




