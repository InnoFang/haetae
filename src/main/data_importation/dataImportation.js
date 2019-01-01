import React from 'react'
import {
    Table,
    Input,
    Button,
    Icon,
    Row,
    Col
} from 'antd'
import Highlighter from 'react-highlight-words';

import './dataImportation.css'

const data = [{
    key: '1',
    type: 'John Brown',
    address: 'New York No. 1 Lake Park',
    description: 'Hello World',
  }, {
    key: '2',
    type: 'Joe Black',
    address: 'London No. 1 Lake Park',
    description: 'Hello World   ',
  }, {
    key: '3',
    type: 'Jim Green',
    address: 'Sidney No. 1 Lake Park',
    description: 'Hello World',
  }, {
    key: '4',
    type: 'Jim Red',
    address: 'London No. 2 Lake Park',
    description: 'Hello World',
  }];
  

class DataImortation extends React.Component {

    constructor() {
        super();
        this.state = {
            searchText : '',
        }
    }

    getColumnSearchProps(dataIndex) {
        return {
            filterDropdown: ({
                setSelectedKeys, selectedKeys, confirm, clearFilters,
            }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
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

        const columns = [{
            title: '问题类别',
            dataIndex: 'type',
            key: 'type',
            width: '30%',
            ...this.getColumnSearchProps('type'),
          }, {
            title: '问题属地',
            dataIndex: 'address',
            key: 'address',
            width: '20%',
            ...this.getColumnSearchProps('address'),
          }, {
            title: '问题描述',
            dataIndex: 'description',
            key: 'description',
            ...this.getColumnSearchProps('description'),
          }];

        return (
            <div>
                <Row>
                    <Col span={1}>
                        <Button type="primary" icon="cloud-upload">上传文件</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                       <Table columns={columns} dataSource={data} />;
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataImortation;