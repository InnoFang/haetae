import React from 'react'
import { Button } from 'antd';
import './dataAnalysis.css';

// import asyncComponenet from '../../component/asyncComponent';
// const BarChart = asyncComponenet(() => import('../../component/echarts/reactChart'));
import { 
    BarChart, 
    PieChart,
    LineChart,
    ScatterChart,
    RadarChart,
    MapChart,
    CandlestickChart
} from '../../component/echarts/reactChart';

import { pieOption, barOption, lineOption, scatterOption, mapOption, radarOption, candlestickOption } from './options'

class DataAnalysis extends React.Component {
 
    render() {
       return <div>
            <BarChart option={barOption} width="60%" height="500px"/>
            <PieChart option={pieOption} width="60%" height="500px"/>
            <LineChart option={lineOption} width="60%" height="500px"/>
            <ScatterChart option={scatterOption} width="60%" height="500px"/>
            <RadarChart option={radarOption} width="60%" height="500px"/>
            <MapChart option={mapOption} width="60%" height="500px"/>
            <CandlestickChart option={candlestickOption} width="60%" height="500px"/>
        </div>
    }
}

export default DataAnalysis;