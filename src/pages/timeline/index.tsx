import React, {useRef, useState} from 'react';
import {Col, Input, Row, Select, Tag} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';
import {SelectValue} from "antd/lib/select";

const {Search} = Input;

const Timeline = () => {
    const [condition, setCondition] = useState(
        {title: "", color: "", com: ""}
    )
    const inputComData = {title: "", color: "", com: ""}
    const inputComLabelArr = ["文字内容", "图标颜色", "组件名"]
    const tables = useRef(null)

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = (condition: any, pageSize: number, pageNum: number) => {
        const {title, color, com} = condition
        return GoblogApiV1.GET("/public/timeline/find", {
            pageSize, pageNum, title, color, com
        })
    }

    const renderInput = Object.keys(condition).map((item, index) => {
        return <Col key={`info_${index}`} span={3}>
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
                        title={"创建新时间轴"}
                        buttonName={"创建新时间轴"}
                        createAddress={"/timeline/add"}
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
                    deleteAddress={"/timeline"}
                    putAddress={"/timeline"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="文字内容" dataIndex="title" key="title"/>
                    <Column title="图标颜色" dataIndex="color" key="color"/>
                    <Column title="组件名" dataIndex="com" key="com"/>
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default Timeline;