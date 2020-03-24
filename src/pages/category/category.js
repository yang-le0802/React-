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
        //在发请求前，显示loading
        this.setState({loading:true})
        parentId = parentId || this.state.parentId 
        const result = await reqCategorys(parentId)
        //请求完成之后，隐藏loading
        this.setState({loading:false})

        if(result.status===0){
            //取出分类数组，可能是一级，可能是二级
            const categorys = result.data 
            if(parentId==='0'){
                //更新一级分类状态
                this.setState({categorys})
            }else{
                //更新二级分类列表
                this.setState({subCategorys:categorys})
            } 
        }else{
            message.error('获取分类列表失败')
        }
    }

    /* 显示指定一级分类对象的二级列表 */
    showSubCategorys = (category)=>{
        //先更新状态
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{ 
            //此回调函数在状态更新且重新render后执行
            //获取二级分类列表显示
            this.getCategorys()
        })
        //setState()不能立即获取最新的状态，因为setState()是异步更新状态的
    }


     /* 显示指定一级分类列表 */
    showCategorys=()=>{
        //更新为显示一级列表的状态
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }


   /* 点击取消确认框 */
    handleCancel=()=>{
        this.form.resetFields()
        this.setState({showStatus:0})
        
    }


    /* 显示添加的确认框 */
    showAdd=()=>{
        this.setState({showStatus:1})
    }

    
    /* 显示修改名称的弹框 */
    showUpdate=(category)=>{
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({showStatus:2})
    }

    

    /* 添加分类 */
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


    /* 修改名称 */
    updateCategorys= ()=>{

        //进行表单验证，只有通过了才能处理
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //点击确定后隐藏弹框
                this.setState({showStatus:0})

                const categoryId = this.category._id
                const {categoryName} =values

                //清楚输入数据
                this.form.resetFields()

                //发请求更新分类
                const result = await reqUpdateCategorys({categoryId,categoryName})
                if(result.status===0){
                //重新更新页面
                this.getCategorys()
                }
            }
        })        
    }

    
    //初始化table的表头
    componentWillMount(){
        this.initColums()
    }

    //发送异步ajax请求,这里获取一级分类列表，因为state初始值是一级的ID
    componentDidMount(){
        this.getCategorys()
    }


    render(){

        const {categorys,loading,subCategorys,parentId,parentName,showStatus} = this.state
        const category = this.category || {} //如果还没有category，指定一个空对象

        //定义card左、右侧的标题
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