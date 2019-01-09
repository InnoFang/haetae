import React from 'react'
import { Button } from 'antd';

import { pieOption, barOption, lineOption, scatterOption, mapOption, radarOption, candlestickOption } from './options';

import asyncComponenet from '../../../component/asyncComponent';
const BarChart = asyncComponenet(() => import('../../../component/echarts/barChart'));
const PieChart = asyncComponenet(() => import('../../../component/echarts/pieChart'));
const LineChart = asyncComponenet(() => import('../../../component/echarts/lineChart'));
const ScatterChart = asyncComponenet(() => import('../../../component/echarts/scatterChart'));
const RadarChart = asyncComponenet(() => import('../../../component/echarts/radarChart'));
const MapChart = asyncComponenet(() => import('../../../component/echarts/mapChart'));
const CandlestickChart = asyncComponenet(() => import('../../../component/echarts/candlestickChart'));


class AnalysisByKeyWord extends React.Component {
  

    onHandleExportFile() {
       
    }

    render() {
       return <div>
           <Button type='primary' onClick={this.onHandleExportFile}>导出文件</Button>
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

export default AnalysisByKeyWord;