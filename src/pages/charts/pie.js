import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'
/*
后台管理的饼图路由组件
*/
export default class Pie extends Component {

    getOption = () => {
        return {
            title : {
                text: '销量示意图',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋','袜子']
            },
            series : [
                {
                name: ' 销量',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'衬衫'},
                    {value:310, name:'羊毛衫'},
                    {value:274, name:'雪纺衫'},
                    {value:235, name:'裤子'},
                    {value:400, name:'高跟鞋'},
                    {value:400, name:'袜子'},
                ],
                itemStyle: {
                    emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
            ]
        };
    }
    getOption2 = () => {
        return {
            backgroundColor: '#2c343c',
            title: {
                text: '库存示意图',
                left: 'center',
                top: 20,
                textStyle: {
                color: '#ccc'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                colorLightness: [0, 1]
                }
            },
            series : [
                {
                name:'库存',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[
                    {value:335, name:' 衬衫'},
                    {value:310, name:' 羊毛衫'},
                    {value:274, name:' 雪纺衫'},
                    {value:235, name:' 裤子'},
                    {value:400, name:' 高跟鞋'},
                    {value:400, name:'袜子'},
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                    }
                },
                labelLine: {
                    normal: {
                    lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
                }
            ]
        };
    }
    render() {
        return (
            <div>
            <Card title=' 饼图一'>
            <ReactEcharts option={this.getOption()} style={{height: 300}}/>
            </Card>
            <Card title=' 饼图二'>
            <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
            </Card>
            </div>
        )
        }
    }