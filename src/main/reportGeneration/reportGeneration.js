import React from 'react'
import { Button } from 'antd';

import { barOption, pieOption } from './options';

import 'echarts/lib/chart/bar';    // 引入柱状图
import 'echarts/lib/chart/pie'     // 引入饼状图 
import echarts from 'echarts/lib/echarts';
import $ from 'jquery';
import FileSaver from 'file-saver';

// import asyncComponenet from '../../component/asyncComponent';
// const PieChart = asyncComponenet(() => import('../../component/echarts/pieChart'));
// const BarChart = asyncComponenet(() => import('../../component/echarts/barChart'));

class ReportGeneration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '信访数据分析报告',
            time: '2019-1-1',
            content: []
        }
    }

    componentDidMount() {
        let barChart = echarts.init(document.getElementById("barChart"));
        barChart.setOption(barOption);

        let pieChart = echarts.init(document.getElementById("pieChart"));
    
        pieChart.setOption(pieOption);
        this.setState({ content: [
            {
                image: barChart.getDataURL(),
                description: '贪污问题十分严重',
            },
            {
                image: pieChart.getDataURL(),
                description: '太原市问题十分突出',
            }
        ]});
    }

    generateDocument() {
        let staticVar = {
            mhtml: {
                top: "Mime-Version: 1.0\nContent-Base: " + window.location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + window.location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                body: "<body>_body_</body>"
            }
        };
        let options = {
            maxWidth: 624
        };
        let markup = $('#pageContent').clone();
        
        // Embed all images using Data URLs
        let images = [];
        let img = new Image();
        img = markup.find('img');
        // if (isbase64){
            const { content } = this.state;
            // for (let i = 0; i < content.length; i++) {
            //     console.log(content[i]["image"])
            // }
            for (let i = 0; i < img.length; i++) {
                let uri = content[i]["image"];
                // let uri = img[i].src;
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: uri,
                    data: uri.substring(uri.indexOf(",") + 1)
                };
            }
        // } else{
            // get image data url
            
            // for (let i = 0; i < img.length; i++) {
            //     console.log(content[i]["image"])
            //     // Calculate dimensions of output image
            //     let w = Math.min(img[i].width, options.maxWidth);
            //     let h = img[i].height * (w / img[i].width);
            //     // Create canvas for converting image to data URL
            //     let canvas = document.createElement("CANVAS");
            //     canvas.width = w;
            //     canvas.height = h;
            //     // Draw image to canvas
            //     let context = canvas.getContext('2d');
            //     context.drawImage(img[i], 0, 0, w, h);
            //     // Get data URL encoding of image
            //     let uri = canvas.toDataURL("image/png");
            //     $(img[i]).attr("src", img[i].src);
            //     img[i].width = w;
            //     img[i].height = h;
            //     // Save encoded image to array
            //     images[i] = {
            //         type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
            //         encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
            //         location: $(img[i]).attr("src"),
            //         data: uri.substring(uri.indexOf(",") + 1)
            //     };
            // }

        // }

        // Prepare bottom of mhtml file with image data
        let mhtmlBottom = "\n";
        for (let i = 0; i < images.length; i++) {
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
            mhtmlBottom += "Content-Location: " + images[i].location + "\n";
            mhtmlBottom += "Content-Type: " + images[i].type + "\n";
            mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
            mhtmlBottom += images[i].data + "\n\n";
        }
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

        //TODO: load css from included stylesheet
        let styles = ".table-product{position: absolute;top: 18px; left: 565px;width: 400px; height: 195px; border: #aaa solid 1px; overflow-y: auto; max-height:195px; font-size:13px;}" +
            ".table-header{position:relative;top:0px;left:0px;width:100%;background-color: #40AFFE;border: 0px;}" +
            ".table-header th{width: 150px;height: 15px;border: #fff thin;border-style: double dashed;}" +
            ".table-content{position:relative;top:0px;left:0px;width:100%;background-color: #cce0fe;border: 0px;color: rgba(71, 71, 71, 0.74);}" +
            ".table-content td{width: 150px;height: 15px;border: #fff thin;border-style: double dashed;}";

        // Aggregate parts of the file together
        let fileContent = staticVar.mhtml.top.replace("_html_", staticVar.mhtml.head.replace("_styles_", styles) + staticVar.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

        // Create a Blob with the file contents
        let blob = new Blob([fileContent], {
            type: "application/msword;charset=utf-8"
        });
        // console.log(fileContent)
        // console.log('hello')
        FileSaver.saveAs(blob, "信访数据分析报告.doc");

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
    }

    render() {
        const { content } = this.state;
        const desc1 = content.length === 0 ? '' : `${content[0]['description']}`;
        const desc2 = content.length === 0 ? '' : `${content[1]['description']}`;
        const img1 =  content.length === 0 ? '' : `${content[0]['image']}`;
        const img2 =  content.length === 0 ? '' : `${content[1]['image']}`;
        return (
            <div>
                <Button type="primary" onClick={this.generateDocument.bind(this)}>生成报告</Button>
                <br />
                <br />
                <div id="pageContent">
                    <h1 align="center">{this.state.title}</h1>
                    <hr />
                    <p align="center">{this.state.time}</p>
                    <br />
                    <br />
                    <div id="barChart" style={{width: "600px", height:"400px", display: "none"}}></div>
                    <img src={img1}/>
                    {/* <BarChart option={barOption} /> */}
                    <br />
                    <p>{desc1}</p>
                    <br />
                    <br />
                    <div id="pieChart" style={{width: "600px", height:"400px", display: "none"}}></div>
                    <img src={img2}/>
                    {/* <PieChart option={pieOption} /> */}
                    <br />
                    <p>{desc2}</p>
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