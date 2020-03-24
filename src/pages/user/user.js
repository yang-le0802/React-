import React,{Component} from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button/link-button'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'
import UserForm from './user-form'

/* 用户管理路由 */
export default class User extends Component{

    state = {
        users:[],
        roles:[],
        isShow:false
    }

    initColumns = ()=>{
        
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username',
            },
            {
                title:'邮箱',
                dataIndex:'email',
            },
            {
                title:'电话',
                dataIndex:'phone',
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render: formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) => this.roleNames[role_id]
            },
            {
                title:'操作',
                render:(user) => (
                    <span>
                        <LinkButton onClick={() =>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() =>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }

    initRoleName = (roles)=>{
        const roleNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
        console.log(roleNames)
    }

    getUsers = async () => {
        const result = await reqUsers()
        if(result.status===0){
            const {users,roles} = result.data
            this.initRoleName(roles)
            this.setState({
                users,
                roles
            })          
        }
    }

    addOrUpdateUser =  () => {
        this.form.validateFields( async (error,values)=>{
            if(!error){
                const user = values
                this.form.resetFields()

                if(this.user && this.user._id){
                    user._id = this.user._id
                }

                const result = await reqAddOrUpdateUser(user)
                if(result.status === 0){
                    message.success(`${this.user ? '修改':'添加'}用户成功`)
                    this.getUsers()
                }
                this.setState({isShow:false})
            }
        })
    }

    showAdd = () => {
        this.user = null
        this.setState({isShow:true})
    }

    showUpdate = (user) => {
        this.user = user
        this.setState({isShow:true})
    }

    deleteUser = (user) => {
         Modal.confirm(
            {
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
              const result = await reqDeleteUser(user._id)
              if(result.status===0){
                  message.success('删除成功！')
                  this.getUsers()
              }else{
                  message.error('删除失败！')
              }
            }
          })
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render(){

        const {users,isShow,roles} = this.state
        const user = this.user || {}

        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )

        return(
            <Card title={title}>
              <Table
              bordered 
              rowKey='_id'
              dataSource={users} 
              columns={this.columns} 
              pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
              />
              <Modal
                title={user._id?'修改用户':'创建用户'}
                visible ={isShow}
                onOk={this.addOrUpdateUser}
                onCancel={()=>{
                    this.setState({isShow:false})
                    this.form.resetFields()
                    }}
                >
                <UserForm setForm={form=>this.form=form} roles={roles} user={user}/>
            </Modal>
            </Card>
        )
    }
}