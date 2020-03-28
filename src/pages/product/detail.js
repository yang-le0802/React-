/* 
商品详情页面路由
*/
import React,{Component} from 'react' 
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from '../../components/link-button/link-button'
import {BASE_IMGURL} from '../../utils/constants'
import {reqCategory} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'

const Item = List.Item

export default class ProductDetail extends Component{

    state = {
        cName1:'',//一级分类名称
        cName2:'',//二级分类名称
    }

    async componentDidMount(){
        const {pCategoryId,categoryId} = memoryUtils.product
        if(pCategoryId==='0'){
            const result = await reqCategory(categoryId)
            const cName1=result.data.name
            this.setState({cName1})
        }else{
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1=results[0].data.name
            const cName2=results[1].data.name
            this.setState({cName1,cName2})
        }
    }

    componentWillUnmount(){
        memoryUtils.product = {}
    }


    render(){

        /* 读取携带过来的应用数据 */
        const {name,desc,price,detail,imgs} = memoryUtils.product
        const {cName1,cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                  <Icon 
                    type='arrow-left' 
                    style={{marginRight:10,fontSize:20 }} 
                    onClick={()=>this.props.history.goBack()}/>
                </LinkButton>              
                <span>商品详情</span>
            </span>
        )

        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span>
                            <span className="left">商品名称:</span>
                            <span>{name}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                            <span className="left">商品描述:</span>
                            <span>{desc}</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                        </span>
                    </Item>
                    <Item>
                        <span>
                        <span className="left">所属分类:</span>
                        <span>{cName1} {cName2 ? '-->'+cName2 : ''}</span>
                        </span>
                    </Item>
                    <Item>
                       <span>
                       <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img=>(
                                <img
                                key={img} 
                                src={BASE_IMGURL+img}
                                className="product-img"
                                alt="img"
                                />))
                            }                         
                        </span>
                       </span>
                    </Item>
                    <Item>
                        <span> 
                            <span style={{float:"left"}} className="left">商品详情：</span>                    
                            <span style={{float:"left"}} dangerouslySetInnerHTML={{__html:detail}}></span>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}