import React from 'react'
import { Button } from 'antd';

// import Object from 'core-js/core/object';

import 'echarts/lib/chart/bar';    // 引入柱状图
import 'echarts/lib/chart/pie'     // 引入饼状图 
import echarts from 'echarts/lib/echarts';
import $ from 'jquery';
import FileSaver from 'file-saver';
import Api from '../../Api'; 

class ReportGeneration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pieXAxisData: [],
            pieYAxisData: [],
            barXAxisData: [],
            barYAxisData: [],
            title: '信访数据分析报告',
            date: `日期：${new Date().toLocaleDateString()}`,
            pieContent: {
                image: '',
                description: '',
            },
            barContent: {
                image: '',
                description: '',
            }
        }
    }

    componentDidMount() {
        // 获取顺序：Location -> Category 
        // 为了防止异步操作出现问题，使用了 Promise 的方式
        this.fetchLocationCount()
        .then(() => this.fetchCategoryCount())
    }
 
    fetchLocationCount() {
        return new Promise((resolve, reject) => { 
            // 获取问题归属情况
            fetch(Api.getPlaceCount(), {
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
                let barXAxisData = [];
                let barYAxisData = [];
                if (code === 0) { 
                    let sortX = Object.keys(data).sort((a,b) => data[b] - data[a]);
                    let sortData = {}
                    for (let i = 0; i < sortX.length; i++) {
                        sortData[sortX[i]] = data[sortX[i]];
                    }
                    for (let key in sortData) {
                        barXAxisData.push(key);
                        barYAxisData.push(sortData[key]);
                    }

                    // 如果长度大于 size，那么显示前面，其他的值求和且以‘其他’展示
                    const size = 4;
                    if (barXAxisData.length >= size) {
                        barXAxisData = barXAxisData.slice(0, size);
                        // barXAxisData.push("其他");
                        // let otherSum = barYAxisData.slice(size, sortData.length).reduce((prev, curr, idx, arr) => prev + curr);
                        barYAxisData = barYAxisData.slice(0, size);
                        // barYAxisData.push(otherSum);
                    } 
                    this.setState({ barXAxisData, barYAxisData }); 
                    this.initBarChart();
                    resolve();
                } else {
                    console.log(msg);
                    reject();
                }
            });
            resolve();
        });
    }

    fetchCategoryCount() {
        return new Promise((resolve, reject) => {
            // 获取问题类别数据
            fetch(Api.getCategoryCount(), {
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
                let pieXAxisData = [];
                let pieYAxisData = [];
                if (code === 0) {
                    let sortX = Object.keys(data).sort((a,b) => data[b] - data[a]);
                    let sortData = {}
                    for (let i = 0; i < sortX.length; i++) {
                        sortData[sortX[i]] = data[sortX[i]];
                    }
                    for (let key in sortData) {
                        pieXAxisData.push(key);
                        pieYAxisData.push(sortData[key]);
                    }

                   // 如果长度大于 size，那么显示前面，其他的值求和且以‘其他’展示
                   const size = 5;
                    if (pieXAxisData.length >= size) {
                        pieXAxisData = pieXAxisData.slice(0, size);
                        pieXAxisData.push("其他");
                        let otherSum = pieYAxisData.slice(size, sortData.length).reduce((prev, curr, idx, arr) => prev + curr);
                        pieYAxisData = pieYAxisData.slice(0, size);
                        pieYAxisData.push(otherSum);
                    } 
                    this.setState({ pieXAxisData, pieYAxisData }); 
                    this.initPieChart();
                    resolve();
                } else {
                    console.log(msg);
                    reject();
                }
            });
      
        });
    }

    /**
     * 初始化饼图
     */
    initPieChart(){
        const { pieXAxisData, pieYAxisData, pieContent } = this.state;

        let pieData = [];

        for (let i = 0; i < pieXAxisData.length; i++) {
            pieData.push({
                value: pieYAxisData[i],
                name: pieXAxisData[i],
            })
        }
        // console.log(pieData)

        const pieOption = {		
            tooltip: {		
              trigger: 'item',		
              formatter: "{a} <br/>{b}: {c} ({d}%)"		
            },		
            legend: {		
              orient: 'vertical',		
              x: 'left',		
              data: pieXAxisData	
            },		
            series: [		
              {		
                name:'问题类别',		
                type:'pie',		
                radius: ['100%', '70%'],		
                avoidLabelOverlap: false,		
                label: {		
                  normal: {		
                    show: false,		
                    position: 'center'		
                  },		
                  emphasis: {		
                    show: true,		
                    textStyle: {		
                      fontSize: '30',		
                      fontWeight: 'bold'		
                    }		
                  }		
                },		
                labelLine: {		
                  normal: {		
                    show: false		
                  }		
                },		
                data: pieData,
              }		
            ],
            animation: false,
          };
 
        let pieChart = echarts.init(document.getElementById("pieChart"));
        pieChart.setOption(pieOption);

        let descriptionTemplate = `根据信访数据情报，${pieXAxisData[0]} 是目前信访提及最多的问题，需要引起广泛关注与重视`;

        pieContent['image'] = pieChart.getDataURL();
        pieContent['description'] = descriptionTemplate;
        console.log(pieContent)
        this.setState({ pieContent });
        console.log("fetchCategoryCount")
    }

    /**
     * 初始化柱状图
     */
    initBarChart() {

        const { barXAxisData, barYAxisData, barContent } = this.state;

        const barOption = {		
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
            xAxis : [		
              {		
                type : 'category',		
                data : barXAxisData,		
                axisTick: {		
                  alignWithLabel: true		
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
                name:'问题类别',		
                type:'bar',		
                barWidth: '60%',		
                data: barYAxisData,	
              }		
            ],
            animation: false,		
          };	
        
        let barChart = echarts.init(document.getElementById("barChart"));
        barChart.setOption(barOption);
        
        let descriptionTemplate = `根据信访数据情报，${barXAxisData[0]} 是目前接到信访举报次数最多的地方，需要引起广泛关注与重视`;

        barContent['image'] = barChart.getDataURL();
        barContent['description'] = descriptionTemplate;
        console.log(barContent)
        this.setState({ barContent }); 
        console.log("fetchLocationCount")
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
        const { pieContent, barContent } = this.state;
        
        return (
            <div>
                <div style={{ width: "1000px", margin:"0 auto"}}>
                    <div id="pageContent">
                        <h1 align="center">{this.state.title}</h1>
                        <hr />
                        <p align="center">{this.state.date}</p>
                        <br />
                        <div id="barChart" style={{ width: "800px", height:"500px", display: "none" }}></div>
                        <img src={barContent['image']} alt="barChart"/>
                        <br />
                        <p>{barContent['description']}</p>
                        <br />
                        <br />
                        <div id="pieChart" style={{ width: "800px", height:"500px", display: "none" }}></div>
                        <img src={pieContent['image']} alt="pieChart"/>
                        <br />
                        <p>{pieContent['description']}</p>
                    </div> 
                </div>
                <br/>
                <br/>
                <br/>
                <hr/>
                <br/>
                <Button type="primary" icon="download" size="large" onClick={this.generateDocument.bind(this)}>下载报告</Button>
                <br />
            </div>
        );
    }
}

export default ReportGeneration;