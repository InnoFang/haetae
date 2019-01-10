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


function MessageItem(props) {
    return (
        <div>
            <p><strong>类别：</strong> {props.category}</p>
            <p><strong>地点：</strong> {props.location}</p>
            <p><strong>摘要：</strong> {props.abstracts}</p>
            <p><strong>介绍：</strong> {props.describes}</p>
        </div>
    )
}

class PersonStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            name: '',
            loading: true,
            modalVisible: false,
            messageList: []
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
                    }
                } else {
                    console.log(msg);
                }
                this.setState({ dataList, loading: false });
            });
        // let { dataList } = this.state;
        // for (let i = 1; i <= 100; i++) {
        //     dataList.push({
        //         title: `张${i}`,
        //         description: `信访提及次数：${i} 次`,
        //         avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        //     })
        // }
        // this.setState({ dataList, loading: false });
    }

    handleButtonClick(e) {
        this.setModalVisible(false);
    }
    
     /* 设置 modal 框是否可见 */
     setModalVisible(value) {
        this.setState({ modalVisible: value });
    };
    
    onHandleSeeDetail = (name) => {
        this.setModalVisible(true);
        this.setState({ name });

        fetch(Api.getDetailByName(name), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                const { code, msg, data } = response;
                let { messageList } = this.state;
                if (code === 0) {
                    for (let item of data) {

                        messageList.push({
                            description: <MessageItem {...item}/>
                        });
                    }
                } else {
                    console.log(msg);
                }
                this.setState({ messageList });
            });
    }

    render() {

        const { dataList, name, messageList } = this.state;

        return ( 
            <Spin spinning={this.state.loading}>
                <Row>
                    <Col>
                        <List
                                itemLayout="horizontal"
                                pagination={{ pageSize: 10, position: 'both'}}
                                dataSource={ dataList }
                                renderItem={ item => (
                                    <List.Item
                                        actions={[<Button type="primary" onClick={this.onHandleSeeDetail.bind(this, item.title)}>信访数据列表</Button>]}>
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
                <Modal 
                        centered
                        destroyOnClose="true"
                        visible={this.state.modalVisible}
                        title={<p>{name}</p>}  
                        onCancel={() => this.setModalVisible(false)}
                        onOk={() => this.setModalVisible(false)}
                        okText="确认"
                        cancelText="取消"
                        afterClose={() => this.setState({ messageList: [] })}>
                    <List
                        itemLayout="vertical"
                        pagination={{ pageSize: 1, position: 'bottom'}}
                        dataSource={ messageList }
                        renderItem={ item => (
                            <List.Item>
                                <List.Item.Meta
                                    description={item.description}/>
                            </List.Item>
                        )}
                        ></List>
                </Modal>
            </Spin>
        );
    }
}

export default PersonStatistics;