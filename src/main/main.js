import React from 'react';
import { Layout, Menu, Icon, notification } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Footer from '../footer/footer'
import './main.css';

import DataManager from './data_manager/dataManager';
import DataImportation from './data_importation/dataImportation';

import AnalysisByLocation from './data_analysis/analysis_by_location/analysisByLocation';
import AnalysisByKeyWord from './data_analysis/analysis_by_keyword/analysisByKeyWord';
import AnalysisByCategory from './data_analysis/analysis_by_category/analysisByCategory';

import ReportGeneration from './reportGeneration/reportGeneration';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Header, Sider, Content } = Layout;

class Main extends React.Component {
    state = {
      collapsed: false,
    };
  
    onCollapse = () => {
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
        <Router>
          <Layout>  
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}>

              <div className="logo" />
                <div>
                  <Menu 
                    theme="dark" 
                    mode="inline"
                     defaultSelectedKeys={['1']}
                     defaultOpenKeys={['sub']}>
                  <Menu.Item key="1">
                    <Icon type="book" />
                    <span>数据管理</span>
                    <Link to='/data-manager'/>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="cloud-upload" />
                    <span>数据导入</span>
                    <Link to="/data-importation"/>
                  </Menu.Item>
                  <SubMenu key="sub" title={<span><Icon type="line-chart" /><span>数据分析</span></span>}>
                    <Menu.Item key="3">
                      <Icon type="bar-chart" />
                      <span>按地名分析</span> 
                      <Link to="/analysis-by-location"/>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Icon type="pie-chart" />
                      <span>按类别分析</span> 
                      <Link to="/analysis-by-category"/>
                    </Menu.Item>
                    <Menu.Item key="5">
                      <Icon type="dot-chart" />
                      <span>关键字分析</span> 
                      <Link to="/analysis-by-keyword"/>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="6">
                    <Icon type="file-word" />
                    <span>报告生成</span>
                    <Link to="/report-generation"/>
                  </Menu.Item>
                </Menu>
              </div>
            
            </Sider>
            <Layout>
              <Header style={{ background: '#fff' }}>
                {/* TODO: ADD SOME CONTENT */}
              </Header>
              <Content style={{
                margin: '24px 16px', padding: 24, background: '#fff', minHeight: 800,
              }}>
              
              <div>
                <Route key={1} path="/"  component={DataManager} exact /> 
                <Route key={2} path="/data-manager"  component={DataManager} /> 
                <Route key={3} path="/data-importation"  component={DataImportation} /> 
                <Route key={4} path="/analysis-by-location"  component={AnalysisByLocation} /> 
                <Route key={5} path="/analysis-by-category"  component={AnalysisByCategory} /> 
                <Route key={6} path="/analysis-by-keyword"  component={AnalysisByKeyWord} /> 
                <Route key={7} path="/report-generation"  component={ReportGeneration} /> 
              </div>
             </Content>
              <Footer />
            </Layout>
          </Layout>
        </Router>
      );
    }
  }

export default Main;