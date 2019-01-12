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
    message 
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
        const { category, location, description } = values;

        fetch(Api.addMessage(category, location, description), {
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

    render() {

        const { previewVisible, previewImage, fileList } = this.state;
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
                <Icon type="plus" />
                <div className="ant-upload-text">点击上传图片</div>
            </div>
        );

        return <div>
            <Row>
                <Col span={12}>
                    <Form layout='horizontal'  onSubmit={this.handleSubmitMessage} >
                        <Form.Item
                            label="问题类别"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('category', {
                                rules: [{ required: true, message: '请输入问题类别！' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="问题属地"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('location', {
                                rules: [{ required: true, message: '请输入问题属地！' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="问题描述"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '请输入问题描述！' }],
                            })(
                                <TextArea  autosize={{ minRows: 10 }} />
                            )}
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit">提   交</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                <div className="clearfix">
                    <Upload
                        action="//jsonplaceholder.typicode.com/posts/"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                         {/* {fileList.length >= 3 ? null : uploadButton} */}
                        {uploadButton}
                    </Upload>
                    <Divider>识别内容如下</Divider>
                    <TextArea  autosize={{ minRows: 20 }}/>
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