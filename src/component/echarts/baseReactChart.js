import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend'

export default class BaseReactChart extends React.Component {
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

 







