import React,{PureComponent} from 'react'
import {Form,Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent{

    static propTypes = {
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
      }

    render(){

        const {roles,user} = this.props
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 15 },//右侧包裹的宽度
          };
        return(
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {getFieldDecorator('username',{
                            initialValue:user.username,
                            rules:[
                                {required:true, message:'请填写用户名称'}
                            ]
                        }
                    )(
                        <Input placeholder='请输入用户名称'/>
                    )}             
                </Item>

                {
                    user._id ? null : (
                        <Item label='密码'>
                        {getFieldDecorator('password',{
                                initialValue:user.password,
                                rules:[
                                    {required:true, message:'请设置密码'}
                                ]
                            }
                        )(
                            <Input type = 'password' placeholder='请输入密码'/>
                        )}             
                        </Item>
                    )}
               
                <Item label='手机号'>
                    {getFieldDecorator('phone',{
                            initialValue:user.phone,
                            rules:[
                                {required:true, message:'请填写手机号'}
                            ]
                        }
                    )(
                        <Input placeholder='请输入手机号'/>
                    )}             
                </Item>
                <Item label='邮箱'>
                    {getFieldDecorator('email',{
                            initialValue:user.email,
                            rules:[
                                {required:true, message:'请填写邮箱'}
                            ]
                        }
                    )(
                        <Input placeholder='请输入邮箱'/>
                    )}             
                </Item>
                <Item label='角色'>
                    {getFieldDecorator('role_id',{
                            initialValue:user.role_id,
                        }
                    )(
                        <Select placeholder='请选择角色'>
                        {
                            roles.map((item)=>{
                                return(
                                    <Option key={item._id}>{item.name}</Option>
                                )
                            })
                        }                          
                        </Select>
                    )}             
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)
