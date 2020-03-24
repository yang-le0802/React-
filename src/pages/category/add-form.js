/* 
添加商品种类的form组件
*/
import React,{Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component{

    static propTypes = {
        categorys:PropTypes.array.isRequired,//一级分类数组
        parentId:PropTypes.string.isRequired,//某个一级分类的_id
        setForm:PropTypes.func.isRequired
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const {categorys,parentId} = this.props
        return(
            <Form>
                <Item>
                {getFieldDecorator('parentId',{
                        initialValue:parentId
                    }
                )(
                    <Select>
                    <Option value='0'>一级分类</Option>
                    {categorys.map((item)=><Option value={item._id}>{item.name}</Option>)}
                    </Select>
                )}
                
                </Item>
                <Item>
                {getFieldDecorator('categoryName',{
                        initialValue:'',
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

export default Form.create()(AddForm)
