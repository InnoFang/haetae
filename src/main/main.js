import React from 'react';
import { Layout, Menu, Icon, notification } from 'antd';
import Footer from '../footer/footer'
import './main.css';

const { Header, Sider, Content } = Layout;

class Main extends React.Component {
    state = {
      collapsed: false,
    };
  
    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    }

    componentDidMount() {
        notification.open({
            message: '您好，' + window.sessionStorage.getItem("userName"),
            description: '欢迎使用信访数据情报管理系统',
            icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
          });
    }
  
    render() {
      return (
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}>

            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="home" />
                <span>网站首页</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="cloud-upload" />
                <span>数据导入</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="line-chart" />
                <span>数据分析</span>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="user" />
                <span>个人信息</span>
              </Menu.Item>
              <Menu.Item key="5">
                <Icon type="setting" />
                <span>基本设置</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff' }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{
              margin: '24px 16px', padding: 24, background: '#fff', minHeight: 800,
            }}
            >
              Content
            </Content>
            <Footer />
          </Layout>
        </Layout>
      );
    }
  }

export default Main;