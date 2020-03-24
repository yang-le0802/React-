import React,{Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
}from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from "../../utils/storageUtils"

/* 权限管理路由 */
export default class Role extends Component{

    state = {
        roles:[],
        role:{},//选中的role
        isShowAdd:false,//是否显示添加界面
        isShowAuth:false
    }

    constructor(props){
        super(props)
        this.auth = React.createRef()
    }

    initColumns = ()=>{
        
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
            },
        ]
    }

    onRow=(role)=>{
        return {
            onClick: event => {
                this.setState({role})
            }
        }
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status===0) {
          const roles = result.data
          this.setState({
            roles
          })
        }
      }

    
    /* 添加角色 */
    addRole=()=>{
        this.form.validateFields(async (error,values)=>{
            if(!error){
                this.setState({isShowAdd:false})
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)  
                if(result.status===0){
                    message.success('添加成功')
                    const role = result.data
                    this.setState(state=>({
                        roles : [...state.roles,role]
                    }))
                }else{ message.error('添加失败')}
            }
        })     
    }

    updateRole=async ()=>{
        this.setState({isShowAuth:false})
        const role = this.state.role
        //得到最新的mune
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if(result.status===0){
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限已修改，请重新登录')
              }else{
                message.success('设置权限成功')
                // this.getRoles()
                this.setState({
                    roles:[...this.state.roles]
                })
              }  
        }
        }
    

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getRoles()
    }

    render(){

        const {roles,role,isShowAdd,isShowAuth} = this.state

        const title=(
            <span>
                <Button 
                type='primary' 
                onClick={()=>this.setState({isShowAdd:true})}
                >
                创建角色
                </Button>
                &nbsp;
                <Button 
                type='primary' 
                disabled={!role._id} 
                onClick={()=>this.setState({isShowAuth:true})}
                >
                设置角色权限
                </Button>
            </span>
        )
        
        return(
            <Card title={title}>
            <Table
            bordered 
            rowKey='_id'
            dataSource={roles} 
            columns={this.columns} 
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowSelection={{
                type:'radio',
                selectedRowKeys:[role._id],
                onSelect:(role)=>{
                    this.setState({role})
                }
                }}
            onRow={this.onRow}
            />

            <Modal
            title="添加角色"
            visible ={isShowAdd}
            onOk={this.addRole}
            onCancel={()=>{
                this.setState({isShowAdd:false})
                this.form.resetFields()
                }}
            >
              <AddForm setForm={(form) => this.form = form}/>
            </Modal>

            <Modal
            title="设置角色权限"
            visible ={isShowAuth}
            onOk={this.updateRole}
            onCancel={()=>{
                this.setState({isShowAuth:false})
                }}
            >
              <AuthForm role={role} ref={this.auth}/>
            </Modal>
            </Card>
        )
    }
}