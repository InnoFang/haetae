import React from 'react'
import { Button } from 'antd';

import Api from '../../../Api'

import asyncComponenet from '../../../component/asyncComponent';
import WordCount from '../../../component/echarts/wordCloud';

class AnalysisByKeyWord extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            xAxisData: [],
            yAxisData: [],
            wordCloudData: []
        }
    }

    componentDidMount() {
        fetch(Api.getWordCount(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            const { code, msg, data } = response;
            let { xAxisData, yAxisData, wordCloudData } = this.state;
            if (code === 0) {
                for (let key in data) {
                    xAxisData.push(key);
                    yAxisData.push(data[key]);
                    wordCloudData.push({
                        name: key,
                        value: data[key]
                    })
                }
                this.setState({ xAxisData, yAxisData });
                console.log("显示数据")
            } else {
                console.log(msg);
            }
        });
    }
   
    render() {

        const { wordCloudData } = this.state;
        const wordCloudOption = {
            title: {
                text: '信访数据关键词词云',
                subtext: '根据信访数据关键词分词统计'
            },
            toolbox: {
            　　show: true,
            　　feature: {
                    dataView: {},
            　　　　saveAsImage: {
                　　　　pixelRatio: 2
            　　　　}
            　　}
            },
            series: [{
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '70%',
                height: '80%',
                right: null,
                bottom: null,
                sizeRange: [12, 60],
                rotationRange: [-90, 90],
                rotationStep: 45,
                gridSize: 8,
                drawOutOfBound: false,
        
                textStyle: {
                    normal: {
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        color: function () {
                            return 'rgb(' + [
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160),
                                Math.round(Math.random() * 160)
                            ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
        
                data: wordCloudData
            }]
        };

       return <div>
            <WordCount option={wordCloudOption} height="500px"/>
        </div>
    }
}

export default AnalysisByKeyWord;