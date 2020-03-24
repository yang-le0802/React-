/* 头部组件 */
import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import './header.less'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api/index' 
import LinkButton from '../link-button/link-button'


class Header extends Component{

    state={
        currentTime:formateDate(Date.now()),//当前时间字符串
        dayPictureUrl:'',//天气图片
        weather:''//天气文本
    }

    getTime=()=>{
        //每隔一秒获取当前时间并更新状态
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather= async ()=>{
        const result = await reqWeather('徐州')
        const {dayPictureUrl,weather} = result
        this.setState({dayPictureUrl,weather})
    }

    getTitle=()=>{
        let title
        //得到当前请求路径
        const path = this.props.location.pathname;
        menuList.forEach(item=>{
            if(item.key===path){ //在所有的一级菜单中查找
                title = item.title
            }else if(item.children){ //一级菜单中没找到，在所有二级菜单中查找
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                }
            }          
        })
        return title
    }

    logout=()=>{
        //显示确认框
        Modal.confirm(
            {
                content: '确定退出登录吗？',
                onOk:()=> {
                  //删除保存的user数据
                  storageUtils.removeUser();
                  memoryUtils.user = {};
                  //跳转到登录界面
                  this.props.history.replace('/login')
                },
              }
        )
    }

    /* 在渲染之后执行一次，一般执行异步操作：发ajax请求、启动定时器 */
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount(){
        //清除定时器
        clearInterval(this.intervalId)
    }

    render(){
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
        <div className="header">
           <div className="header-top">
               <span>欢迎，{username}</span>
               <LinkButton onClick={this.logout}>退出</LinkButton>
           </div>
           <div className="header-bottom"> 
               <div className="header-bottom-left">{title}</div>
               <div className="header-bottom-right">
                   <span>{currentTime}</span>
                   <img src={dayPictureUrl} alt="weather"/>
                   <span>{weather}</span>
               </div>
           </div>
        </div>
        )
    }
}

export default withRouter(Header)