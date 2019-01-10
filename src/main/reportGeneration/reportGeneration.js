import React from 'react'
// import { saveAs, Paragraph, TextRun, Packer } from 'file-saver';
import FileSaver from 'file-saver';
import { Button } from 'antd';

import { barOption, pieOption, lineOption } from './options';

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
        let content = "测试内容测试内容";
        let type = "text/html;charset=utf-8";

        let blob = new Blob([content], {type: type});


        let isFileSaverSupported = false;
        try {
          isFileSaverSupported = !!new Blob();
        } catch (e) {
          console.log(e);
        }
    
        if (isFileSaverSupported) {
          FileSaver.saveAs(blob,"report.doc");
        }else{
          FileSaver.open(encodeURI(type + "," + content));
        }
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.generate}>生成报告</Button>
                <BarChart option={barOption}/>
                <p>上面的是柱状图</p>
                <PieChart option={pieOption}/>
                <p>上面的是饼状图</p>
                <LineChart option={lineOption}/>
                <p>上面的是折线图</p>
            </div>
        );
    }
}

export default ReportGeneration;