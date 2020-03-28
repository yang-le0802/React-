/* 
商品修改与添加的子路由
*/
import React,{Component} from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    Icon,
    message
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'
import RichTextEditor from './rich-text-editor'
import PicturesWall from './pictures-wall'
import memoryUtils from '../../utils/memoryUtils'

const { Item } = Form;
const { TextArea } = Input;

class ProductAddUpdate extends Component{
    constructor(props){
        super(props) 
        this.myRef = React.createRef()
        this.editor = React.createRef()
    }

    state = {
        options:[],
      };
      
    //获取一级分类列表或者二级分类列表并显示
    getCategorys = async (parentId)=>{
        const result = await reqCategorys(parentId)
        if(result.status===0){
            const categorys = result.data
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{
                return categorys//返回二级列表，当前函数返回的promise就会成功且value为categorys
            }
        }
    }

    initOptions= async (categorys)=>{
        //根据categorys生成Option数组
        const options = categorys.map((item)=>({
            value: item._id,
            label: item.name,
            isLeaf: false,
        }))

        const {isUpdate,product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map((item)=>({
                value: item._id,
                label: item.name,
                isLeaf: true,            
            }))
            const targetOption = options.find(item=>item.value===pCategoryId)
            targetOption.children = childOptions
        }

        //更新options状态
        this.setState({options})
    }

   //自定义价格验证函数
    validatePrice=(rule, value, callback)=>{
        if(value*1 > 0){
            callback();//验证通过
        }else{
            callback('价格必须大于0');//验证没通过
        }      
    }
    
    //在按钮集中再表单验证，通过了才发送请求
    submit=()=>{     
        this.props.form.validateFields(async (error,values)=>{
            if(!error){
                //收集数据并封装成product对象
                const {name,desc,price,categoryIds,} = values
                let pCategoryId, categoryId
                if(categoryIds.length===1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.myRef.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}

                if(this.isUpdate){
                    product._id = this.product._id
                }

                //调用接口请求函数 添加/更新 
                const result = await reqAddOrUpdateProduct(product)

                //根据请求结果进行弹窗提示
                if(result.status===0){
                    message.success(`${this.isUpdate?'商品更新':'添加商品'}成功`)
                    this.props.history.goBack()
                }
                else{
                    message.error(`${this.isUpdate?'商品更新':'添加商品'}失败`)
                }

            }
        })
    }

    //用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        //得到选择的Option对象
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        //根据选中的分类，请求获取分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions = subCategorys.map((item)=>({
                value: item._id,
                label: item.name,
                isLeaf: true,             
            }))
            //关联到被选中的一级options上
            targetOption.children = childOptions
        }else{
            //当前选中的一级分类没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options:[...this.state.options]
        })
      }

      componentDidMount(){
          this.getCategorys('0')
      }

      componentWillMount(){
          const product = memoryUtils.product
          this.isUpdate = !!product._id//两个非强制转换布尔类型
          this.product = product || {}
      }

      componentWillUnmount(){
          memoryUtils.product = {}
      }
    
    render(){

        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = this.product

        const categoryIds = []
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const formItemLayout = {
            labelCol: { span: 2 },//左侧label的宽度
            wrapperCol: { span: 8 },//右侧包裹的宽度
          };

        const title = (
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type='arrow-left' style={{fontSize:'20px',marginRight:'10px'}}/>                 
                </LinkButton>
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        const {getFieldDecorator} = this.props.form
        return(
           <Card title = {title}>
               <Form {...formItemLayout}>
                   <Item label="商品名称">
                    {
                        getFieldDecorator('name',{
                            initialValue:product.name,
                            rules:[
                                {required:true,message:'必须输入商品名称'}
                            ]
                        })( <Input placeholder='请输入商品名称'/>)
                    }
                      
                   </Item>
                   <Item label="商品描述">
                   {
                        getFieldDecorator('desc',{
                            initialValue:product.desc,
                            rules:[
                                {required:true,message:'必须输入商品描述'}
                            ]
                        })( <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />)
                    }      
                   </Item>
                   <Item label="商品价格">
                   {
                        getFieldDecorator('price',{
                            initialValue:product.price,
                            rules:[
                                {required:true,message:'必须输入商品价格'},
                                {validator:this.validatePrice}
                            ]
                        })( <Input type='number' placeholder='请输入商品价格' addonAfter="元"/>)
                    }   
                   </Item>
                   <Item label="商品分类">
                   {
                        getFieldDecorator('categoryIds',{
                            initialValue:categoryIds,
                            rules:[
                                {required:true,message:'必须输入商品分类'},
                            ]
                        })(
                            <Cascader
                            placeholder='请输入商品分类'
                            options={this.state.options}//需要显示的列表数据
                            loadData={this.loadData}//指定当选择某个列表项加载下一级列表的监听回调
                            />
                        )
                    }                     
                   </Item>
                   <Item label="商品图片">
                       <PicturesWall ref={this.myRef} imgs={imgs}/>
                   </Item>
                   <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                       <RichTextEditor ref={this.editor} detail={detail}/>
                   </Item>
                   <Item>
                       <Button type='primary' onClick={this.submit}>提交</Button>
                   </Item>
               </Form>
           </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)