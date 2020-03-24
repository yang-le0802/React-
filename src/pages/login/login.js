import React,{Component} from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom';


/* 登录的路由组件 */
class Login extends Component {

    //通过getFieldDecorator方法保存输入的表单数据，在表单登录的监听事件中拿到保存的数据，可以进行ajax请求
    handleSubmit = (event)=>{
        //阻止事件的默认行为
        event.preventDefault()
        //对所有的表单字段进行验证。这个函数会先获取表单字段，再利用其中的回调函数进行验证
        //values中存放的是以{标识名称：表单数据}形式存放的所有表单数据      
        this.props.form.validateFields(async (err, values) => {
            //如果校验成功
            if (!err) {
              //请求登录
              const {username,password} = values;
              const result = await reqLogin(username,password);//{status:0,data:} {status:1,msg:错误信息}
              //console.log('请求成功',result)             
              if(result.status===0){//登录成功，提示成功
                message.success('登录成功')   
                //保存user
                const user = result.data  
                memoryUtils.user = user //保存在内存中，页面刷新后，内存中就不存在user了
                storageUtils.saveUser(user)//保存在local中去

                //跳转到管理界面去,用replace()不需要回退到登录界面
                this.props.history.replace('/')
              }else{//登录失败，提示错误信息
                message.error(result.msg)
              }
              }                        
             //请求成功不等于登录成功，请求失败不等于登录失败
            else{
              console.log('校验失败！')
            }
          }
        );

        // //手动获取表单字段：得到form对象
        // const form = this.props.form
        // //获取表单项的输入数据
        // //表单数据通过getFieldDecorator方法存入的时候，通过标识名称做标识，所得到的values是对象而不是数组
        // const values = form.getFieldValue()
    }


    //专门用来对密码进行验证的函数
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
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/'/>
        }

        //得到具有强大功能的form对象，其身上具有收集数据、表单验证等方法
        const form = this.props.form;
        //解构赋值得到getFieldDecorator方法放到变量getFieldDecorator上
        const {getFieldDecorator} = form;
      
        return (
        <div className="login">
        <header className="login-header">
            <img src={logo} alt="logo"/>
            <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
            <h2>用户登录</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
            {//username是标识名称，输入的用户名保存在这里
            getFieldDecorator('username',{//配置对象：属性名是特定的一些名称
            //声明式验证：直接使用别人定义好的规则进行验证
            rules:[
                {required:true,  whitespace:true, message:'用户名必须输入'},
                {min:4, message:'用户名至少四位'},
                {max:12, message:'用户名最多12位'},
                {pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或者下划线组成'}           
            ]}
            )(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />)
            }
            </Form.Item>
            <Form.Item>
             {//password是标识名称，输入的密码保存在这里
            getFieldDecorator('password',{
                //使用校验器校验，值是一个函数，所以要写一个校验函数
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
export default WrapLogin;

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