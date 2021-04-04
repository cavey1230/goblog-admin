import React, {useEffect, useState} from 'react';

import {Menu} from 'antd';
import {
    AppstoreOutlined,
    CopyrightOutlined,
    FieldTimeOutlined,
    InfoCircleOutlined,
    MailOutlined,
    SearchOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons';

import {withRouter} from 'react-router-dom';
import {SLink} from "@/utils/routerRender";
import { MenuInfo } from 'rc-menu/lib/interface';

const {SubMenu} = Menu;

const Navbar = () => {
    const [keyPath,setKeyPath] = useState([])

    const handleClick = (e: MenuInfo)=>{
        sessionStorage.setItem("keyPath",JSON.stringify(e.keyPath))
        setKeyPath(e.keyPath)
    }

    useEffect(()=>{
        setKeyPath(JSON.parse(sessionStorage.getItem("keyPath")))
    },[])

    return (
        <Menu onClick={handleClick} selectedKeys={keyPath} mode="inline">
            <SubMenu key="sub1" icon={<MailOutlined/>} title="文章管理">
                <Menu.Item key="sub1_1">
                    <SLink to="/home/create/article">创建文章</SLink>
                </Menu.Item>
                <Menu.Item key="sub1_2">
                    <SLink to="/home/article">文章管理</SLink>
                </Menu.Item>
            </SubMenu>
            <Menu.Item key="sub2" icon={<AppstoreOutlined/>}>
                <SLink to="/home/category">类型管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub3" icon={<UserOutlined/>}>
                <SLink to="/home/blogroll">友情链接管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub4" icon={<SearchOutlined/>}>
                <SLink to="/home/user">用户管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub5" icon={<ToolOutlined/>}>
                <SLink to="/home/tools_link">工具地址管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub6" icon={<InfoCircleOutlined/>}>
                <SLink to="/home/info">个人信息管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub7" icon={<CopyrightOutlined/>}>
                <SLink to="/home/copyright">版权信息管理</SLink>
            </Menu.Item>
            <Menu.Item key="sub8" icon={<FieldTimeOutlined />}>
                <SLink to="/home/timeline">时间轴管理</SLink>
            </Menu.Item>
        </Menu>
    );
};

export default withRouter(Navbar);