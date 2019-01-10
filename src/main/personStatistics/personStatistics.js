import React from 'react'
import {
    List,
    Avatar,
    Button,
    Modal,
    Spin,
    Row,
    Col
} from 'antd'

import Api from '../../Api';

class PersonStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            name: '',
            loading: true
        }
    }

    componentDidMount() {
        fetch(Api.getNameCount(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                const { code, msg, data } = response;
                let { dataList } = this.state;
                if (code === 0) {
                    for (let key in data) {
                        dataList.push({
                            title: `${key}`,
                            description: `信访提及次数：${data[key]} 次`,
                            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                        })
                        this.setState({ dataList, loading: false });
                    }
                } else {
                    console.log(msg);
                }
            });
        
    }
    
    onHandleSeeDetail = (e, name) => {

        this.setState({ name });
    }

    render() {

        const { dataList, name } = this.state;

        return ( 
            <Spin spinning={this.state.loading}>
                <Row gutter={48}>
                    <Col span={12}>
                        <List
                                itemLayout="horizontal"
                                pagination={{ pageSize: 10, position: 'both'}}
                                dataSource={ dataList }
                                renderItem={ item => (
                                    <List.Item
                                        actions={[<Button type="primary" onClick={this.onHandleSeeDetail.bind(this, item.title)}>详情预览</Button>]}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar}/>}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                                >
                            </List>
                    </Col>
                    <Col span={12}>
                        <List
                                itemLayout="horizontal"
                                pagination={{ pageSize: 10, position: 'both'}}
                                dataSource={ dataList }
                                renderItem={ item => (
                                    <List.Item
                                        actions={[<Button type="primary" onClick={this.onHandleSeeDetail.bind(this, item.title)}>详情预览</Button>]}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar}/>}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                                >
                            </List>
                    </Col>
                </Row>
            </Spin>
        );
    }
}

export default PersonStatistics;