/* 头部组件 */
import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import {connect} from 'react-redux'
import './header.less'
import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import {reqWeather} from '../../api/index' 
import LinkButton from '../link-button/link-button'
import {logout} from '../../redux/actions'


class Header extends Component{

    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    getTime=()=>{
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
        const path = this.props.location.pathname;
        menuList.forEach(item=>{
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                }
            }          
        })
        return title
    }

    logout=()=>{
        Modal.confirm(
            {
                content: '确定退出登录吗？',
                onOk:()=> {
                this.props.logout()
                },
              }
        )
    }

    componentDidMount(){
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount(){ 
        clearInterval(this.intervalId)
    }

    render(){
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = this.props.user.username
        const title = this.props.headTitle
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

export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)( withRouter(Header))