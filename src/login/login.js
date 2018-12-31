import React from 'react';
import { 
    Col, 
    Row,
    Form, 
    Icon, 
    Input, 
    Button, 
    Carousel
 } from 'antd';
import './login.css';

import Footer from '../footer/footer'

class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;
            
          }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
        <div>
            <Row type="flex" align="middle">
                <Col span={16}>
                    <Carousel autoplay vertical>
                        <div className="slide"> <img src={require('./img/img1.svg')}  alt="img1"/> </div>
                        <div className="slide"> <img src={require('./img/img2.svg')}  alt="img2"/> </div>
                        <div className="slide"> <img src={require('./img/img3.svg')}  alt="img3"/> </div>
                        <div className="slide"> <img src={require('./img/img4.svg')}  alt="img4"/> </div>
                    </Carousel>
                </Col> 
                <Col span={5} push={2}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            <h1 id="title">信访数据情报管理系统</h1>
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入你的用户名！' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入你的密码！' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密    码" />
                            )}
                        </Form.Item>
                        <Form.Item> 
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登    录
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Footer />
        </div>);
    }
}

export default Login = Form.create()(Login);