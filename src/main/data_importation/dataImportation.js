import React from 'react'
import {
    Table,
    Input,
    Button,
    Icon,
    Row,
    Col,
    message,
    Upload
} from 'antd'
import Highlighter from 'react-highlight-words';
import XLSX from 'xlsx';
import './dataImportation.css';
import Api from '../../Api';

class DataImortation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText : '',
            data : [],
        }

        this.onHandleImportExcel = this.onHandleImportExcel.bind(this);
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
                console.log(response);
                const { code, msg, data } = response;
                if (code === 0) {
                    this.setState({ data });
                    console.log("加载数据完成")
                } else {
                    console.log(msg);
                }
            });
    }

    onHandleImportExcel(file) {
        // 获取上传的文件对象
        // const { files } = file.target;
        // 通过FileReader对象读取文件
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
                // 最终获取到并且格式化后的 json 数据
                let { data } = this.state;
                const baseKey = data.length;
                for (let i = 0; i < tmpData.length; i++) {
                    data.push({
                        key: `${baseKey + i + 1}`,
                        type: tmpData[i]['问题类别'],
                        address: tmpData[i]['问题属地'],
                        description: tmpData[i]['问题描述'],
                    });
                }
 
                if (data[0]['type'] !== undefined  
                 && data[0]['address'] !== undefined 
                 && data[0]['description'] !== undefined) {
                    message.success('上传成功！')
                    this.setState({ data });    
                    console.log(data);
                } else {
                    message.error('文件内容需包含，\'问题类别\'、\'问题属地\' 、\'问题描述\'字段且不能为空！');
                }
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                console.log(e);
                message.error('文件类型不正确！');
            }
        };
        // console.log(file);
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file.file);
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

        const { data } = this.state;

        const columns = [{
            title: '问题序号',
            dataIndex: 'key',
            key: 'key',
            width: '10%',
            ...this.getColumnSearchProps('key'),
          }, {
            title: '问题类别',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
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
                    <Col span={2}>
                        <Upload name="file" accept='.xlsx, .xls' showUploadList={false} customRequest={this.onHandleImportExcel}>
                            <Button type="primary" icon="cloud-upload">
                                上传文件
                            </Button>
                        </Upload>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="tips">支持 .xlsx、.xls 格式的文件</p>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                       <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DataImortation;