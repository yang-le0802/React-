/* 应用的根组件 */
import React,{Component} from "react" // Component作为React的一个属性，加大括号
import {BrowserRouter,HashRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component{

    render(){
        return (
            <HashRouter>
            <Switch>{/* 只匹配其中一个，匹配到目标路由后，就不往下匹配了 */}
                <Route path='/login' component={Login}></Route>
                <Route path='/' component={Admin}></Route>
            </Switch>               
            </HashRouter>
        )
    }

}

