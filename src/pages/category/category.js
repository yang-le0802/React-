import React,{Component} from 'react'
import {Card,Table,Icon,Button, message,Modal} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {reqCategorys,reqUpdateCategorys,reqAddCategorys} from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'


/* 品类管理路由 */
export default class Category extends Component{

    state = {
        loading:false,//是否正在获取数据中
        categorys:[], //一级分类列表
        subCategorys:[],//二级分类列表
        parentId:'0',//当前需要显示的分类列表的父分类id
        parentName:'',//当前需要显示的分类列表的父分类名称
        showStatus:0,//标识添加、更新的确认框是否显示，0都不显示，1显示添加，2显示更新
    }
    
    //初始化table的表头
    initColums=()=>{
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width:300,
                dataIndex: '',
                render: (category) => (
                    <span>
                        <LinkButton onClick={()=>{this.showUpdate(category)}}>修改名称</LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个回调函数，在回调函数中调用监听函数，并传入数据 */}
                        {
                            this.state.parentId==='0' ? <LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看分类详情</LinkButton> : null
                        }
                        
                    </span>
                )
            }      
          ]
    }

    /*
    异步获取一级/二级分类列表显示
    parentId:如果没有给参数赋值，就按照状态里的parentId请求，如果给参数赋值了，就根据指定的parentId请求
      */
    getCategorys = async (parentId)=>{
        this.setState({loading:true})
        parentId = parentId || this.state.parentId 
        const result = await reqCategorys(parentId)
        this.setState({loading:false})

        if(result.status===0){
            const categorys = result.data 
            if(parentId==='0'){
                this.setState({categorys})
            }else{
                this.setState({subCategorys:categorys})
            } 
        }else{
            message.error('获取分类列表失败')
        }
    }

    showSubCategorys = (category)=>{
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{ 
            this.getCategorys()
        })
    }


    showCategorys=()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }


    handleCancel=()=>{
        this.form.resetFields()
        this.setState({showStatus:0})
        
    }


    showAdd=()=>{
        this.setState({showStatus:1})
    }

    
    showUpdate=(category)=>{
        this.category = category
        this.setState({showStatus:2})
    }

    
    addCategorys= ()=>{
        this.form.validateFields( async (err,values)=>{
            if(!err){
                this.setState({showStatus:0})

                const {parentId,categoryName} = values
                this.form.resetFields()
        
                const result = await reqAddCategorys(categoryName,parentId)
                if(result.status===0){
                    if(parentId===this.state.parentId){
                        this.getCategorys()
                    }else if(parentId==='0'){
                        this.getCategorys('0')
                    }
                }
            }        
        })
    }


    updateCategorys= ()=>{

        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({showStatus:0})

                const categoryId = this.category._id
                const {categoryName} =values

                this.form.resetFields()

                const result = await reqUpdateCategorys({categoryId,categoryName})
                if(result.status===0){

                this.getCategorys()
                }
            }
        })        
    }

    
    componentWillMount(){
        this.initColums()
    }

    componentDidMount(){
        this.getCategorys()
    }


    render(){

        const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
        const category = this.category || {} 
        const title = parentId==='0' ? '一级分类列表': (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{margin:'0 20px 0 10px'}}></Icon>
                <span>{parentName}</span>
            </span>
        )

        const extra = (
            <Button type = 'primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        );

        return(
          <Card title={title} extra={extra}>
          <Table 
            bordered 
            rowKey='_id'
            dataSource={parentId === '0' ? categorys : subCategorys} 
            columns={this.columns} 
            loading={loading}
            pagination={{defaultPageSize:5,showQuickJumper:true}}
          />
          <Modal
            title="添加分类"
            visible ={showStatus===1}
            onOk={this.addCategorys}
            onCancel={this.handleCancel}
          >
              <AddForm 
              categorys={categorys} 
              parentId={parentId}
              setForm={(form)=>{this.form=form}}
              />
          </Modal>
          <Modal
            title="更新分类"
            visible ={showStatus===2}
            onOk={this.updateCategorys}
            onCancel={this.handleCancel}
          >
              <UpdateForm 
              categoryName={category.name} 
              setForm={(form)=>{this.form=form}}/>
          </Modal>
          </Card>
        )
    }
}