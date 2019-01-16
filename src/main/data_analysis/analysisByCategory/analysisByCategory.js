import React from 'react'
import Api from '../../../Api'
import { 
    Row, 
    Col,
    DatePicker 
} from 'antd';
import asyncComponenet from '../../../component/asyncComponent';
const PieChart = asyncComponenet(() => import('../../../component/echarts/pieChart'));

const { RangePicker } = DatePicker;

class AnalysisByCategory extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            yAxisData: [],
            pieData: []
        }
    }


    updateData(response) { 

        const { code, msg, data } = response;
        console.log(data)
        let xAxisData = [];
        let yAxisData = [];
        let pieData   = [];
        if (code === 0) {
            for (let key in data) {
                xAxisData.push(key);
                yAxisData.push(data[key]);
                pieData.push({
                    value: data[key],
                    name: key,
                });
            }
            this.setState({ xAxisData, yAxisData, pieData });
        } else {
            console.log(msg);
        }
    }


    componentDidMount() {
        fetch(Api.getCategoryCount(), {
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

        fetch(Api.getCategoryCountByDate(dateString[0],  dateString[1]), {
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

        const { xAxisData, pieData } = this.state;

        //饼状图数据
        const pieOption = {
            title: {
                text: '信访数据举报类别分析',
                subtext: '根据信访数据的类别统计'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: xAxisData,
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    saveAsImage: { show: true }
                }
            },
            series: [
              {
                name: '问题类别',
                type: 'pie',
                radius: [0, '40%'],
                label: {
                    normal: {
                        position: 'inner',
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: pieData.slice(0, pieData.length / 2),
              }, {
                name: '问题类别',
                type: 'pie',
                radius: ['50%', '70%'],
                labels: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}}: }{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data: pieData.slice(pieData.length / 2, pieData.length),
              }
            ]
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
                        <PieChart option={pieOption} height="1100px"/>
                    </Col>
            </Row>
        </div>
    }
}

export default AnalysisByCategory;