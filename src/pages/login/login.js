import React,{Component} from 'react';
import { Form, Icon, Input, Button} from 'antd';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux'
import './login.less'
import logo from '../../assets/images/logo.png'
import {login} from '../../redux/actions'


/* 登录的路由组件 */
class Login extends Component {

    handleSubmit = (event)=>{
        event.preventDefault()    
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
              const {username,password} = values;
              this.props.login(username,password)
              }                        
            else{
              console.log('校验失败！')
            }
          }
        );
    }


    validatePWD = (rule,value,callback)=>{
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度不能低于4位')
        }else if(value.length>12){
            callback('密码长度不能多于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或者下划线组成')
        }else{
            callback()
        }       
    }
    /* 
    callback()有两种调用方式：
    callback()//验证通过
    callback('xxx')//验证失败，传递出去要提示的文本 
    */


    render(){
        const user = this.props.user
        if(user && user._id){
            return <Redirect to='/home'/>
        }
        const form = this.props.form;
        const {getFieldDecorator} = form;
      
        return (
        <div className="login">
        <header className="login-header">
            <img src={logo} alt="logo"/>
            <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
        <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
            <h2>用户登录</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
            {
            getFieldDecorator('username',{
            rules:[
                {required:true,  whitespace:true, message:'用户名必须输入'},
                {min:4, message:'用户名至少四位'},
                {max:12, message:'用户名最多12位'},
                {pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或者下划线组成'}           
            ],
            initialValue:'admin'
            })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />)
            }
            </Form.Item>
            <Form.Item>
             {
            getFieldDecorator('password',{
                rules:[
                    {validator:this.validatePWD},
                ]
            })(
            <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"/>)
            }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
        </div>
        )
    }
}  

/* 
1.高阶函数：一类特别的函数
    1).接受函数类型的参数
    2).返回值时函数
    3).常见高阶函数：
        a.setTimeout()/setInterval()
        b.Promise:Promise(()=>{}) / then(result=>{})
        c.数组遍历相关方法：forEach() / filter() / map() / reduce() / find() / findIndex()
        d.函数对象的bind()方法
        e.Form.creat()()/getFieldDecorator()()
    4).高阶函数更加动态，更加具有扩展性

2.高阶组件
组件本质上是一种构造函数类型，组件标签是它的一个实例
  本质：是一个函数
  特点：接受一个组件（被包装组件），返回一个新的组件（包装组件），包装组件向被包装组件内部传入特定属性
  作用：扩展组件的功能
  关系：高阶组件实际上是高阶函数，接受一个组件函数（组件用类定义，类的本质是函数），返回一个新的组件函数
  
3.create能够返回一个函数，返回的函数包装Form组件，生成一个新的组件：Form(Login)。新组件会向Form组件传递一个强大的对象属性：form
 */
const WrapLogin = Form.create()(Login);
export default connect(
    state=>({user:state.user}),
    {login}
)(WrapLogin);

/* 
1.收集表单填入的数据 
2.验证数据有两个时机：
    在输入的过程中验证：在getFieldDecorator函数中使用规则验证
    输入完在提交的时候统一验证：在点击提交的监听事件中获取输入的数据并验证
*/

/* 
async和await
作用：
    简化Promise对象的使用，不在使用then()来指定成功或失败的回调函数
    以同步编码（没有回调函数）的方式实现异步流程
位置:
    在返回promise的表达式左侧写await
    await所在的最近的函数的左侧
 */