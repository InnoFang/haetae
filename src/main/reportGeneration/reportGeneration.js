import React from 'react'
// import { saveAs, Paragraph, TextRun, Packer } from 'file-saver';
import { Button } from 'antd';

import { barOption, pieOption, lineOption } from './options';

import 'echarts/lib/chart/bar';    // 引入柱状图
import echarts from 'echarts/lib/echarts';

import { saveAs } from  'file-saver';
import './jquery.wordexport';
import $ from 'jquery';

import asyncComponenet from '../../component/asyncComponent';
const BarChart = asyncComponenet(() => import('../../component/echarts/barChart'));
const PieChart = asyncComponenet(() => import('../../component/echarts/pieChart'));
const LineChart = asyncComponenet(() => import('../../component/echarts/lineChart'));



class ReportGeneration extends React.Component {

    generate() {
        // const doc = new Document();
        // const paragraph =  Paragraph("Hello World");
        // const institutionText =  TextRun("Foo Bar").bold();
        // const dateText =  TextRun("Github is the best").tab().bold();

        // paragraph.addRun(institutionText);
        // paragraph.addRun(dateText);
        // doc.addParagraph(paragraph);
        
        // const packer = new Packer();
        // packer.toBlob(doc).then(blob => {
        //     console.log(blob);
        //     saveAs(blob, "example.docx");
        //     console.log("Document created successfully");
        // });
        // let content = "测试内容测试内容";
        // let type = "text/html;charset=utf-8";

        // let blob = new Blob([content], {type: type});


        // let isFileSaverSupported = false;
        // try {
        //   isFileSaverSupported = !!new Blob();
        // } catch (e) {
        //   console.log(e);
        // }
    
        // if (isFileSaverSupported) {
        //   FileSaver.saveAs(blob,"report.doc");
        // }else{
        //   FileSaver.open(encodeURI(type + "," + content));
        // }

        let myChart = echarts.init(document.getElementById("test"));
        myChart.setOption(barOption);
        // console.log(myChart.getDataURL());

        // let blob = new Blob(["<h1>Hello world</h1>"], {type: "text/plain;charset=utf-8"});
        // saveAs(blob, "example.doc");

        
        $(".word").wordExport('word文档');


    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.generate}>生成报告</Button>
                <div class="word">
                    <h1>我们的梦想来自内心深处的孤独</h1>>
                    <p align="center" style="font-size:20pt;font-weight:bold;">JS导出Word文档</p>
                    <div>我们来自同一个世界</div>
                    <div id="test" style={{width: "600px", height:"400px"}}></div>
                </div>
                {/* <BarChart option={barOption}/>
                <p>上面的是柱状图</p>
                <PieChart option={pieOption}/>
                <p>上面的是饼状图</p>
                <LineChart option={lineOption}/>
                <p>上面的是折线图</p> */}
            </div>
        );
    }
}

export default ReportGeneration;