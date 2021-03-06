import React from 'react'
import {
    Table,
    Input,
    Button,
    Icon,
    Spin,
    Row,
    Col,
} from 'antd'
import Highlighter from 'react-highlight-words';
import './dataManager.css';
import Api from '../../Api';

class DataManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText : '',
            data : [],
            loading: true,
        }
    }

    componentDidMount(){
        fetch(Api.getDataList(), {
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
                let reverseData = data.reverse();
                if (code === 0) {
                    let i = 1;
                    for (let item of reverseData) {
                        item['key'] = `${i++}`;
                        item['date'] = `${item['date'].substring(0, 10)}`
                        delete item.id;
                    }
                    // console.log(data);
                    console.log("加载数据完成")
                } else {
                    console.log(msg);
                }
                this.setState({ data: reverseData, loading: false });
            });
    }

    getColumnSearchProps(dataIndex) {
        return {
            filterDropdown: ({
                setSelectedKeys, selectedKeys, confirm, clearFilters,
            }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ node => { this.searchInput = node; }}
                        placeholder={`输入关键字`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}>
                        搜索
                    </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}>
                        重置
                    </Button>
                </div>
            ), 
            filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
              if (visible) {
                setTimeout(() => this.searchInput.select());
              }
            },
            render: (text) => (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
              />
            ),
        }
    }

    handleSearch(selectedKeys, confirm) {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset(clearFilters) {
        clearFilters();
        this.setState({ searchText: '' });
    }

    render() {

        const { data } = this.state;


        const columns = [{
            title: '问题序号',
            dataIndex: 'key',
            key: 'key',
            width: '7%',
            ...this.getColumnSearchProps('key'),
          }, {
            title: '信访时间',
            dataIndex: 'date',
            key: 'date',
            width: '8%',
            ...this.getColumnSearchProps('date'),
          }, {
            title: '问题类别',
            dataIndex: 'category',
            key: 'category',
            width: '15%',
            ...this.getColumnSearchProps('category'),
          }, {
            title: '问题属地',
            dataIndex: 'location',
            key: 'location',
            width: '15%',
            ...this.getColumnSearchProps('location'),
          }, {
            title: '问题摘要',
            dataIndex: 'abstracts',
            key: 'abstracts',
            width: '15%',
            ...this.getColumnSearchProps('abstracts'),
          }, {
            title: '问题描述',
            dataIndex: 'describes',
            key: 'describes',
            ...this.getColumnSearchProps('describes'),
          }];

        return (
            <div> 
                <Row>
                    <Col>
                        <Spin spinning={this.state.loading}>
                            <Table columns={columns} dataSource={data} scroll={{ y: 600 }}/>
                        </Spin>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataManager;