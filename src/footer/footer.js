import React from 'react'
import {
    Col,
    Row
} from 'antd';
import './footer.css'
 
class Footer extends React.Component {

    render() {
        return (
            <footer id="footer">
                <br/>
                <br/>
                <Row >
                    <Col span={4}/>
                    <Col span={16} id="copy">
                        &copy;&nbsp;2019 信访大数据智能管理系统开发小组. All Rights Reserved.
                    </Col>
                    <Col span={4}/>
                </Row>
            </footer>
        )
    }
}

export default Footer;

