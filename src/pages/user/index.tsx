import React, {useRef, useState} from 'react';
import {Col, Input, Row} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';

const {Search} = Input;

const User = () => {
    const [condition, setCondition] = useState({username: "", role: ""})
    const inputComData = {username: "", password: "", role: ""}
    const inputComLabelArr = ["用户名", "密码", "角色权限"]
    const tables = useRef(null)

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = (condition: any, pageSize: number, pageNum: number) => {
        const {username,role} = condition
        return Object.keys(condition).map(item => {
            return !!condition[item]
        }).filter(i => i).length ? GoblogApiV1.GET("/user/find", {
            pageSize, pageNum, username, role
        }) : GoblogApiV1.GET("/public/users", {
            pageSize, pageNum
        })
    }

    return (
        <React.Fragment>
            <Row style={{marginBottom: "1rem"}}>
                <Col>
                    <CreatePad
                        title={"创建新类型"}
                        buttonName={"创建新类型"}
                        createAddress={"/public/user/add"}
                        inputComData={inputComData}
                        inputComLabelArr={inputComLabelArr}
                        flushData={flushData}
                    />
                </Col>
                <Col span={4}>
                    <Search
                        placeholder="模糊查询用户名"
                        onChange={(event) => {
                            setCondition({...condition, username: event.target.value})
                        }}
                        onSearch={flushData}
                    />
                </Col>
                <Col span={4}>
                    <Search
                        placeholder="模糊查询用户权限"
                        onChange={(event) => {
                            setCondition({...condition, role: event.target.value})
                        }}
                        onSearch={flushData}
                    />
                </Col>
            </Row>
            <Row style={{width: "100%", height: "95%"}}>
                <Tables
                    urlPromise={urlPromise}
                    ref={tables}
                    condition={condition}
                    deleteAddress={"/user"}
                    putAddress={"/user"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="用户名" dataIndex="username" key="username"/>
                    <Column title="角色权限" dataIndex="role" key="role"/>
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default User;