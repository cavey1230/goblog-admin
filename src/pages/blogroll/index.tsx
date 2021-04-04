import React, {useRef} from 'react';
import {Col, Row} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';

const Blogroll = () => {
    const tables = useRef(null)
    const inputComData={title:"",link:""}
    const inputComLabelArr=["标题","链接地址"]

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = () => {
        return GoblogApiV1.GET("/public/blogroll")
    }

    return (
        <React.Fragment>
            <Row style={{marginBottom: "1rem"}}>
                <Col>
                    <CreatePad
                        title={"创建新友情链接"}
                        buttonName={"创建新友情链接"}
                        createAddress={"/blogroll/add"}
                        inputComData={inputComData}
                        inputComLabelArr={inputComLabelArr}
                        flushData={flushData}
                    />
                </Col>
            </Row>
            <Row style={{width: "100%", height: "95%"}}>
                <Tables
                        urlPromise={urlPromise}
                        ref={tables}
                        deleteAddress={"/blogroll"}
                        putAddress={"/blogroll"}
                        inputComData={inputComData}
                        inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="标题" dataIndex="title" key="title"/>
                    <Column title="地址" dataIndex="link" key="link"/>
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default Blogroll;