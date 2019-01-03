import React from 'react'
import fs from 'fs';
import { render, Document, Text, Image } from 'redocx';
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

export default class DataAnalysis extends React.Component {

    onHandleExportFile() {
        render(<DataVisualization />).then((stream) => {
            fs.open('sample.docx', 'w+', stream.length, null, (err, fd) => {
              if (err) {
                console.log(err);
              }
          
              fs.write(fd, stream.toBuffer(), (writeErr) => {
                if (writeErr) {
                  console.log(writeErr);
                }
                console.log('Docx generated and saved to sample.docx');
              });
            });
          });
    }

    render() {
       return <div>
            <Button type="primary" icon="download" onClick={this.onHandleExportFile}>导出文件</Button>
            <DataVisualization />
        </div>
    }
}

class DataVisualization extends React.Component {

   

    render() {
        return (<div>
            <Document>
                <Image>
                    <BarChart option={barOption} width="60%" height="500px"/>
                    <PieChart option={pieOption} width="60%" height="500px"/>
                    <LineChart option={lineOption} width="60%" height="500px"/>
                    <ScatterChart option={scatterOption} width="60%" height="500px"/>
                    <RadarChart option={radarOption} width="60%" height="500px"/>
                    <MapChart option={mapOption} width="60%" height="500px"/>
                    <CandlestickChart option={candlestickOption} width="60%" height="500px"/>
                </Image>
                <Text style={{ fontSize: 30 }} align="center">
                    All of the charts shown above are the demonstration that use Echarts in the React.
                </Text>
            </Document>
        </div>)
    }
}
