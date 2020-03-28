import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/*
后台管理的折线图路由组件
*/
export default class Line extends Component {

    state = {
        sales:[5, 20, 36, 10, 10, 20],
        stores:[10, 52, 13, 5, 20, 15]
    }

    update = ()=> {
        this.setState(state => ({
            sales:state.sales.map((item) => item+1),
            stores:state.stores.map((item) => item-1)
        }))
    }

    getOption = (sales,stores) => {
        return {
            title: {
                text: '销量与库存示意图'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: sales
            },{
                name: '库存',
                type: 'line',
                data: stores
            }]
        }
    }

    render() {
        const {sales,stores} = this.state
        return (
        <div>
        <Card>
        <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title=' 折线图一'>
        <ReactEcharts option={this.getOption(sales,stores)}/>
        </Card>
        </div>
)
}
}