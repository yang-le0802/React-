/* 左侧导航组件 */
import React,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import './left-nav.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;


class LeftNav extends Component{

  hasAuth = (item) => {
    const {key,isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    if(username === 'admin' || isPublic || menus.indexOf(key)!== -1){
      return true
    }else if(item.children){
      return !!item.children.find(child => menus.indexOf(child.key)!== -1)
    }
    return false
  }

/* 
根据menu的数据数组生成对应的标签数组
使用map()+递归调用
 */
  getMenuNodes_map = (menuList)=>{
    return menuList.map(item=>{
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>            
          </Menu.Item>
        )
      }else{
        return (
          <SubMenu key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
          {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      } 
    })
  }


/* 
根据menu的数据数组生成对应的标签数组
使用reduce()+递归调用
 */
  getMenuNodes = (menuList)=>{
    //得到当前请求的路由路径
    const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      if(this.hasAuth(item)){
        if(!item.children){
          pre.push((
            <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>            
           </Menu.Item>
          ))
        }else{
        //查找一个与当前请求路径匹配的Item
        const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
        //如果存在，说明当前item所对应的子列表需要展开
        if(cItem){
          this.openKey = item.key
        }
        pre.push((
          <SubMenu key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
            {this.getMenuNodes(item.children)}
            </SubMenu>
        ))
        }
      }
      
      return pre
    },[])
  }

  /*
  在第一次渲染之前执行，执行一次
  为第一个render()准备数据（必须同步的） 
   */
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
    //在渲染之前先将menuList中的数组数据动态生成标签数组，渲时直接渲染
  }


  render(){
     //得到当前请求的路由路径
     let path = this.props.location.pathname
     if(path.indexOf('/product')===0){
       path = '/product'
     }
     //得到需要打开菜单项的key
     const openKey = this.openKey

       return (
      //这些menu是路由链接，点击他们会跳转到不同的子路由界面
      <div className="left-nav">
         <Link to='/' className="left-nav-header">
         <img src={logo} alt="logo"/>
         <h1>后台管理</h1>
         </Link>
       
        <Menu 
        mode="inline" 
        theme="dark" 
        selectedKeys={[path]} 
        defaultOpenKeys={[openKey]}>
        {/* 
        先请求根路径时：
        1.使用defaultSelectedKeys只在初始值时定义默认路径，页面渲染后LeftNav生成，会跳转到当前请求的根路径
        在admin中再使用Redirect指定默认跳转到home就无效了
        2.使用selectKeys会跟随指定的变化而跳转到不同界面，
        会先跳转到请求的根路径，然后再admin中指定跳转到home时，再跳转到home
         */}


          {
            this.menuNodes
          }
         
        </Menu>

      </div>
       
       )
    }
}

/* 
withRouter高阶组件，包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)