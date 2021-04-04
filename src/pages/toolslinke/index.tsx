import React, {useRef, useState} from 'react';
import {Col, Input, Row} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';

const {Search} = Input;

const ToolsLink = () => {
    const [condition, setCondition] = useState({icon_img: "", link: "", title: "", introduce: ""})
    const inputComData = {icon_img: {type: "upload", value: "图片地址"}, link: "", title: "", introduce: ""}
    const inputComLabelArr = ["图标地址", "链接地址", "标题", "介绍"]
    const tables = useRef(null)

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = (condition: any, pageSize: number, pageNum: number) => {
        const {icon_img, link, title, introduce} = condition
        return Object.keys(condition).map(item => {
            return !!condition[item]
        }).filter(i => i).length ? GoblogApiV1.GET("/tools_link/find", {
            pageSize, pageNum, icon_img, link, title, introduce
        }) : GoblogApiV1.GET("/public/tools_link", {
            pageSize, pageNum
        })
    }

    const renderInput = Object.keys(condition).map((item, index) => {
        return <Col key={`tools_link_${index}`} span={3}>
            <Search
                placeholder={`查询${inputComLabelArr[index]}`}
                onChange={(event) => {
                    setCondition({...condition, [item]: event.target.value})
                }}
                onSearch={flushData}
            />
        </Col>
    })

    return (
        <React.Fragment>
            <Row style={{marginBottom: "1rem"}}>
                <Col>
                    <CreatePad
                        title={"创建新工具链接"}
                        buttonName={"创建新工具链接"}
                        createAddress={"/tools_link/add"}
                        inputComData={inputComData}
                        inputComLabelArr={inputComLabelArr}
                        flushData={flushData}
                    />
                </Col>
                {renderInput}
            </Row>
            <Row style={{width: "100%", height: "95%"}}>
                <Tables
                    urlPromise={urlPromise}
                    ref={tables}
                    condition={condition}
                    deleteAddress={"/tools_link"}
                    putAddress={"/tools_link"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="图片地址" dataIndex="icon_img" key="icon_img"/>
                    <Column title="网站地址" dataIndex="link" key="link"/>
                    <Column title="标题" dataIndex="title" key="title"/>
                    <Column title="介绍" dataIndex="introduce" key="introduce"/>
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default ToolsLink;