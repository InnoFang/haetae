import React from 'react'
import {
    List,
    Avatar,
    Button,
    Modal,
    Spin,
    Row,
    Col,
    message,
    Upload
} from 'antd'
import XLSX from 'xlsx';

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
        fetch(Api.getName(), {
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
                // console.log(data)
                if (code === 0) {
                    for (let item of data) {
                        dataList.push({
                            title: `${item['name']}`,
                            description: `信访提及次数：${item['count'] === undefined ? 0 : item['count']} 次`,
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

    onHandlePersonnelEntry(e) {

        this.setState({ loading: true });

        const fileReader = new FileReader();

        fileReader.onload = event => {
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: 'binary' });
                // 存储获取到的数据
                let tmpData = [];
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                // esline-disable-next-line
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        tmpData = tmpData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        // break; // 如果只取第一张表，就取消注释这行
                    }
                }
                
                
                if (tmpData[0]['姓名'] !== undefined) {
                    
                    const  formData = new FormData();
                    formData.append("fileName", e.file);
                    // 开始上传 excel 文件
                    fetch(Api.uploadPersonnelFile(), {
                        method: 'POST',
                        mode: 'cors',
                        body: formData,
                    }).then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        const { code } = response;
                        if (code === 0) {
                            message.success('上传成功！')
                            // console.log(data);
                        } else {
                            message.error("上传失败，请重试");
                        }
                        this.setState({ loading: false });
                    });
                } else {
                    message.error('文件内只需一列人名，第一行为\'姓名\'！');
                }
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                console.log(e);
                message.error('文件类型不正确！');
            }
        };
        // console.log(file);
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(e.file);
    }

    render() {

        const { dataList, name, messageList } = this.state;

        return ( 
            <Spin spinning={this.state.loading}>
                <Row>
                    <Col>
                        <Upload name="file" accept='.xlsx, .xls' showUploadList={false} customRequest={this.onHandlePersonnelEntry.bind(this)}>
                            <Button type="primary" icon="cloud-upload">
                                人 员 录 入
                            </Button>
                        </Upload>
                    </Col>
                </Row>
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