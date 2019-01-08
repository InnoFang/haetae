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
import Api from '../Api'

class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // 尝试登录
                this.login(values);
            }
        });
    }

    login(values) {
        const { userName, password } = values;
        const user = {
            username: userName,
            password: password
        };

        fetch(Api.userLogIn(userName, password), {
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
                const { code, msg } = response;
                if (code === 0) {
                    console.log("login succeed");
                    sessionStorage.setItem("userName", values.userName);
                    // 跳转至主界面
                    this.props.history.push('/'); 
                } else {
                    console.log(msg);
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