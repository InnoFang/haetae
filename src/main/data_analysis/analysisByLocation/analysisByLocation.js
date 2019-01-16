import React from 'react'
import { 
    Row, 
    Col,
    DatePicker 
} from 'antd';
import echarts from 'echarts';

import Api from '../../../Api'
import './analysisByLocation.css';

import asyncComponenet from '../../../component/asyncComponent';

const BarChart = asyncComponenet(() => import('../../../component/echarts/barChart'));

const { RangePicker } = DatePicker;

class AnalysisByLocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            yAxisData: [], 
        }
    }

    updateData(response) {
        const { code, msg, data } = response;
        let xAxisData = [];
        let yAxisData = [];
        if (code === 0) {
            for (let key in data) {
                xAxisData.push(key);
                yAxisData.push(data[key]);
            }
            this.setState({ xAxisData, yAxisData });
        } else {
            console.log(msg);
        }
    }


    componentDidMount() {
        fetch(Api.getPlaceCount(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => this.updateData(response));
    }
   
    onHandleSelectDate(dates, dateString) {
        console.log(dateString); 

        fetch(Api.getPlaceCountByDate(dateString[0],  dateString[1]), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => this.updateData(response));

    }

    render() {

        const { xAxisData, yAxisData } = this.state;

        //柱状图数据
        const barOption = {
            title: {
                text: '山西省各市县举报次数',
                subtext: '根据举报地点的举报次数进行统计'
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            xAxis : [
                {
                    type : 'category',
                    data : xAxisData, // 指定横轴数据：标签
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'举报次数',
                    type:'bar',
                    barWidth: '60%',
                    itemStyle: {
                        normal: { 
                            color: echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: '#83bff6'},
                                    { offset: 0.5, color: '#188df0'},
                                    { offset: 1, color: '#188df0'},
                                ]
                            )
                        }
                    },
                    data: yAxisData, // 指定纵轴数据：数值
                    animationDelay: (idx) => idx * 10,
                }
            ],
            toolbox: {
            　　show: true,
            　　feature: {
            　　　　saveAsImage: {
                　　　　pixelRatio: 2
            　　　　}
            　　}
            },
            animationEasing: 'elasticOut',
            animationDelayUpdate: (idx) => idx * 5,
        };

       return <div>
           <Row>
                <Col>
                    <div className="rangePicker-div">
                        <RangePicker 
                            className="rangePicker" 
                            onChange={this.onHandleSelectDate.bind(this)} 
                            format="YYYY-MM-DD"/>
                    </div>
                </Col>
           </Row>
           <br />
           <br />
           <br />
           <Row>
                <Col>
                    <BarChart option={barOption} height="500px"/>
                </Col>
           </Row>
        </div>
    }
}

export default AnalysisByLocation;