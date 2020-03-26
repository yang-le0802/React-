/* 
更新商品名称的form组件
*/
import React,{Component} from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class UpdateForm extends Component{

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render(){
        const {categoryName} = this.props
        const {getFieldDecorator} = this.props.form
        return(
            <Form>
                <Item>
                {getFieldDecorator('categoryName',{
                        initialValue:categoryName,
                        rules:[
                            {required:true,message:'请填写修改名称'}
                        ]
                    }
                )(
                    <Input placeholder='请输入分类名称'/>
                )}             
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UpdateForm)