import React,{Component} from 'react';
import { Layout } from 'antd';
import { Redirect, Route,Switch } from 'react-router-dom';
import {connect} from 'react-redux'
import Header from '../../components/header/header'
import LeftNav from '../../components/left-nav/left-nav'
import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'


const { Footer, Sider, Content } = Layout;

/* 后台管理的路由组件 */
class Admin extends Component {
    
    render(){
        const user = this.props.user
        //如果内存中没有存储user，说明当前没有登录
        if(!user || !user._id){
            //自动跳转到登录页面（在render中登录）
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
                <Header>Header</Header>
                <Content style={{margin:'20px',backgroundColor:'white'}}>{/* 这些子路由是admin的子路由，在admin上切换展示，所以注册在admin上 */}
                   <Switch>
                   <Redirect exact from='/' to='/home'/>
                    <Route path='/home' component={Home}></Route>
                    <Route path='/product' component={Product}></Route>
                    <Route path='/category' component={Category}></Route>
                    <Route path='/role' component={Role}></Route>
                    <Route path='/user' component={User}></Route>
                    <Route path='/charts/bar' component={Bar}></Route>
                    <Route path='/charts/line' component={Line}></Route>
                    <Route path='/charts/pie' component={Pie}></Route>
                    <Route component={NotFound}></Route>
                   </Switch>                   
                </Content>
                <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
            </Layout>
            </Layout>
        )
    }
}
export default connect(
    state=>({user:state.user}),
    {}
)(Admin)

/* 
跳转路由的两种方式：
在render()中：用<Redirect/>标签直接渲染
在监听事件中：Router提供的history堆栈对象，保存在当前组件的props属性中，用history堆栈对象的push或者replace方法切换路由 
*/