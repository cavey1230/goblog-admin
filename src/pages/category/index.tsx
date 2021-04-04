import React, {useRef, useState} from 'react';
import {Col, Input, Row} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';

const {Search} = Input;

const Category = () => {
    const [condition, setCondition] = useState("")
    const tables = useRef(null)
    const inputComData = {name: ""}
    const inputComLabelArr = ["类型名称"]

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = (condition: string, pageSize: number, pageNum: number) => {
        return condition ? GoblogApiV1.GET("/category/find", {
            pageSize, pageNum, name: condition
        }) : GoblogApiV1.GET("/public/category", {
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
                        createAddress={"/category/add"}
                        inputComData={inputComData}
                        inputComLabelArr={inputComLabelArr}
                        flushData={flushData}
                    />
                </Col>
                <Col span={4}>
                    <Search
                        placeholder="模糊查询类型"
                        onChange={(event) => {
                            setCondition(event.target.value)
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
                    deleteAddress={"/category"}
                    putAddress={"/category"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="类型" dataIndex="name" key="name"/>
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default Category;