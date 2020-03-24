import React,{Component} from 'react'
import './link-button.less'

/* 外形像链接的按钮 */
export default class LinkButton extends Component{
    render(){
        return <button {...this.props} className="link-button"></button>
    }
}