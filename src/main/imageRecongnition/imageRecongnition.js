import React from 'react';
import {
    Button,
    Upload, 
    Icon, 
    Modal,
    Input,
    Row,
    Col,
    Form,
    Divider,
    message,
    Spin,
    Tag,
    DatePicker
} from 'antd';
import Api from '../../Api';

const { TextArea } = Input;

class ImageRecongnition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            recongnitionResult: '',
            loading: false,
            uncheckable: true,
            categoryContent: '',
            descriptionContent: '',
            labels: []
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => this.setState({ fileList })

    handleSubmitMessage = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.addMessage(values);
            }
        });
    }

    addMessage(values) {
        const { category, location, description, date } = values;

        let formatDate = values['date'].format('YYYY-MM-DD');

        fetch(Api.addMessage(category, location, description, formatDate), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
            }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log(response);
                const { code, } = response;
                if (code === 0) {
                    message.success('数据添加成功');
                } else {
                    message.error('数据添加失败');
                }
            });
    }

    handleUpload(file) {
        this.setState({ loading: true });

        const  formData = new FormData();
        formData.append("picName", file);
        fetch(Api.imageRecongnition(), {
            method: 'POST',
            mode: 'cors',
            body: formData,
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            const { code, data } = response;
            console.log(response)
            if (code === 0) {
                message.success('上传成功！')
                this.setState({ recongnitionResult: data });
                console.log(data);
            } else {
                message.error("上传失败，请重试");
            }
            this.setState({ loading: false });
        });
    }

    onHandleCategoryChange(e) {
        console.log(e.target.value)
        this.setState({ categoryContent: e.target.value });
    }

    onHandleDescriptionChange(e) {
        let value = e.target.value;
        this.setState({ descriptionContent: value});
        if (value !== '') {
            this.setState({ uncheckable: false });
        } else {
            this.setState({ labels: [], uncheckable: true });
        }
    }

    onHandleRecommend() {
        const { descriptionContent } = this.state;
        fetch(Api.recommendLabel(descriptionContent), {
            method: 'POST',
            mode: 'cors',
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            const { code, data } = response;
            console.log(response)
            if (code === 0) {
                console.log(data);
                let sortLabels = Object.keys(data).sort((a, b) => data[b] - data[a]);
                this.setState({ labels: sortLabels.slice(0, 5) });
            } else {
                message.error("推荐失败，请重试");
            }
            this.setState({ loading: false });
        });
    }

    onHandleRecongnitionResult(e) {
        this.setState({ recongnitionResult: e.target.value });
    }

    onHandleClickTag(value) {
        this.setState({ categoryContent: value });
    }

    render() {

        const { previewVisible, previewImage, fileList, labels } = this.state;
        const { getFieldDecorator } = this.props.form;

        const formItemLayout =   {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const buttonItemLayout = {
            wrapperCol: { span: 14, offset: 4 },
        };

        const uploadButton = (
            <div>
                <Spin spinning={this.state.loading}>
                    <Icon type="plus" />
                    <div className="ant-upload-text">点击上传图片</div>
                </Spin>
            </div>
        );

        return <div>
            <Row>
                <Col span={12}>
                    <Form layout='horizontal'  onSubmit={this.handleSubmitMessage} >
                         <Form.Item
                            label="信访时间"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('date', {
                                type: 'object',
                                rules: [{ required: true, message: '请选择信访时间！' }],
                            })(
                                <DatePicker />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="问题类别"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('category', {
                                rules: [{ required: true, message: '请输入问题类别！' }],
                                initialValue: this.state.categoryContent
                            })(
                                <Input value={this.state.categoryContent} onChange={this.onHandleCategoryChange.bind(this)} allowClear/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="标签推荐"
                            {...formItemLayout}
                        >
                            <div>{labels.map((value, index) => 
                                    <Tag key={index} onClick={this.onHandleClickTag.bind(this, value)}>{value}</Tag>)}
                            </div>
                        </Form.Item>
                        <Form.Item
                            label="问题属地"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('location', {
                                rules: [{ required: true, message: '请输入问题属地！' }],
                            })(
                                <Input allowClear/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="问题描述"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('description', {
                                initialValue: this.state.descriptionContent,
                                rules: [{ required: true, message: '请输入问题描述！' }],
                            })(
                                <TextArea  autosize={{ minRows: 10 }} onChange={this.onHandleDescriptionChange.bind(this)}/>
                            )}
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Button type="danger" disabled={this.state.uncheckable} onClick={this.onHandleRecommend.bind(this)} style={{ width: '45%', marginRight: "15px" }}>推荐类别</Button>
                            <Button type="primary" htmlType="submit" style={{ width: '45%', marginLeft: "15px" }}>添加信息</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                <div className="clearfix">
                    <Upload
                        action={this.handleUpload.bind(this)}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                         {/* {fileList.length >= 3 ? null : uploadButton} */}
                        {uploadButton}
                    </Upload>
                    <Divider>识别内容如下</Divider>
                    <TextArea  autosize={{ minRows: 20 }} value={this.state.recongnitionResult} onChange={this.onHandleRecongnitionResult.bind(this)}></TextArea>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />  
                    </Modal>
                </div>
                </Col>
            </Row>
        </div>
    }
}

export default ImageRecongnition = Form.create({})(ImageRecongnition);