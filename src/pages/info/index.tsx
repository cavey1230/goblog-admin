import React, {useRef, useState} from 'react';
import {Col, Input, Row, Select, Tag} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';
import {SelectValue} from "antd/lib/select";

const {Search} = Input;

const Info = () => {
    const [condition, setCondition] = useState(
        {fill_string: "", image: "", name: "", wechat: "", address: "", checked: ""}
    )
    const inputComData = {
        fill_string: "",
        image: {type: "upload", value: "头像地址"},
        name: "",
        wechat: "",
        address: "",
        checked: {
            type: "select",
            value: [
                {label: "展示", value: "1"},
                {label: "不展示", value: "0"}
            ]
        }
    }
    const inputComLabelArr = ["填充字符", "图片地址", "名称", "微信", "地址", "选中"]
    const tables = useRef(null)

    const flushData = () => {
        tables.current.getData()
    };

    const urlPromise = (condition: any, pageSize: number, pageNum: number) => {
        const {fill_string, image, name, wechat, address, checked} = condition
        return Object.keys(condition).map(item => {
            return !!condition[item]
        }).filter(i => i).length ? GoblogApiV1.GET("/info/find", {
            pageSize, pageNum, fill_string, image, name, wechat, address, checked
        }) : GoblogApiV1.GET("/public/info", {
            pageSize, pageNum
        })
    }

    const selectOnChange = (value: SelectValue, protoName: string) => {
        setCondition({...condition, [protoName]: value})
    }

    const renderInput = Object.keys(condition).map((item, index) => {
        return item === "checked" ? <Col key={`input_${index}`} span={3}>
            <Select
                style={{width: "90%"}}
                options={inputComData.checked.value}
                onChange={(value: SelectValue) => selectOnChange(value, item)}
                placeholder={`查询${inputComLabelArr[index]}`}
                allowClear
            />
        </Col> : <Col key={`info_${index}`} span={3}>
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
                        title={"创建新个人信息"}
                        buttonName={"创建新个人信息"}
                        createAddress={"/info/add"}
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
                    deleteAddress={"/info"}
                    putAddress={"/info"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="文本填充" dataIndex="fill_string" key="fill_string"/>
                    <Column title="图片地址" dataIndex="image" key="image"/>
                    <Column title="名称" dataIndex="name" key="name"/>
                    <Column title="微信" dataIndex="wechat" key="wechat"/>
                    <Column title="地址" dataIndex="address" key="address"/>
                    <Column title="是否展示" dataIndex="checked" key="checked"
                            render={checked => (
                                <>{checked === "1" ?
                                    <Tag color="#87d068">展示</Tag> :
                                    <Tag color="#f50">不展示</Tag>}
                                </>
                            )}
                    />
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime"/>
                    <Column title="创建时间" dataIndex="createTime" key="createTime"/>
                </Tables>
            </Row>
        </React.Fragment>
    );
};

export default Info;