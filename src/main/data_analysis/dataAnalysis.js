import React from 'react'
// import asyncComponenet from '../../component/asyncComponent';
// const BarChart = asyncComponenet(() => import('../../component/echarts/reactChart'));
import { 
    BarChart, 
    PieChart,
    LineChart,
    ScatterChart
} from '../../component/echarts/reactChart';

import { pieOption, barOption, lineOption, scatterOption, mapOption, radarOption, candlestickOption } from './options'

class DataAnalysis extends React.Component {
    render() {
        return (<div>
            <BarChart option={barOption} width="1000px"/>
            <PieChart option={pieOption} width="1000px"/>
            <LineChart option={lineOption} width="1000px"/>
            <ScatterChart option={scatterOption} width="1000px"/>
        </div>)
    }
}

export default DataAnalysis;