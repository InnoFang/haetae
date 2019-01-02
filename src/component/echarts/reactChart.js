import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';

import 'echarts/lib/chart/bar';    // 引入柱状图
import 'echarts/lib/chart/pie'     // 引入饼状图 
import 'echarts/lib/chart/line'    // 引入线状图 
import 'echarts/lib/chart/scatter' // 引入散点图 
import 'echarts/lib/chart/radar'   // 引入雷达图
export class ReactChart extends React.Component {
    constructor(props) {
        super(props);
        this.initPie = this.initPie.bind(this);
    }

    initPie() {
        const { option={} } = this.props;
        let chart = echarts.init(this.ID);

        chart.setOption(option);
        window.onresize = () => chart.resize();
    }

    componentDidMount() {
        this.initPie();
    }

    componentDidUpdate() {
        this.initPie();
    }

    render() {
        const { width="100%", height="200px" } = this.props;
        return <div ref={ID => this.ID = ID} style={{width, height}}></div>
    }
}

// Bar Chart
export class BarChart extends ReactChart {}

// Pie Chart
export class PieChart extends ReactChart {}

// Line Chart
export class LineChart extends ReactChart {}

// Scatter Chart
export class ScatterChart extends ReactChart {}

// Radar Chart
export class RadarChart extends ReactChart {}