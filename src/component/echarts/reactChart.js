import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/scatter'

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