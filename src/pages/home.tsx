import React, {useState} from 'react';
import {Layout} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import Navbar from "@/components/navbar";

import "./home.less";
import {RouterRender, SLink} from "@/utils/routerRender";

const {Header, Sider, Content} = Layout;

const Home = () => {
    const [collapsed, setCollapsed] = useState(false)

    const toggle = () => {
        setCollapsed(!collapsed)
    };

    return (
        <Layout hasSider={true} style={{height:"100vh",boxSizing:"border-box"}}>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{backgroundColor:"white"}}>
                <div className="logo" style={collapsed?{display:"none"}:null}>踩坑日报后台</div>
                <Navbar/>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background">
                    <SLink fill_address={true}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggle,
                        })}
                    </SLink>
                </Header>
                <Content
                    style={{
                        margin:"2rem 1rem",
                        padding:"2rem",
                        minHeight: 280,
                        backgroundColor:"white",
                    }}
                >
                    <RouterRender type={"children"}/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;