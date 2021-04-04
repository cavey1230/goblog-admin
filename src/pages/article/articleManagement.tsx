import React, {useEffect, useRef, useState} from 'react';
import {Col, Input, Row, Select, Tag} from 'antd';

import {GoblogApiV1} from "@/utils/fetchApi";
import Tables from "@/components/tables";
import CreatePad from "@/components/createPad";
import Column from 'antd/lib/table/Column';
import {SelectValue} from "antd/lib/select";

const {Search} = Input;

const ArticleManagement = () => {
    const [condition, setCondition] = useState(
        {title: "", cid: "", synopsis: "", content: "", img: "", boutique: ""}
    )
    const [category, setCategory] = useState([{label: "", value: ""}])
    const [inputComData, setInputConData] = useState({
        title: "",
        cid: {
            type: "select", value: []
        },
        synopsis: "",
        img: {type: "upload", value: "封面图片"},
        boutique: {
            type: "select",
            value: [
                {label: "精品", value: "1"},
                {label: "普通", value: "0"}
            ]
        }
    })
    const inputComLabelArr = ["标题", "文章分类", "简述", "图片地址", "文章状态"]
    const tables = useRef(null)

    const flushData = () => {
        tables.current.getData()
    };

    useEffect(() => {
        GoblogApiV1.GET("/public/all_category").then(res => {
            setCategory(res.data)
            setInputConData({
                ...inputComData, cid: {
                    type: "select", value: res.data
                }
            })
        })
    }, [])

    const urlPromise = (condition: any, pageSize: number, pageNum: number) => {
        const {title, cid, synopsis, content, img, boutique} = condition
        return Object.keys(condition).map(item => {
            return !!condition[item]
        }).filter(i => i).length ? GoblogApiV1.GET("/public/articleCategory/find", {
            pageSize, pageNum, title, cid, synopsis, content, img, boutique
        }) : GoblogApiV1.GET("/public/article", {
            pageSize, pageNum
        })
    }

    const selectOnChange = (value: SelectValue, protoName: string) => {
        setCondition({...condition, [protoName]: value})
    }

    const renderInput = Object.keys(condition).map((item, index) => {
        if (item === "boutique") {
            return <Col key={`input_${index}`} span={3}>
                <Select
                    style={{width: "90%"}}
                    options={inputComData.boutique.value}
                    onChange={(value: SelectValue) => selectOnChange(value, item)}
                    placeholder={`查询${inputComLabelArr[index]}`}
                    allowClear
                />
            </Col>
        }
        if (item === "cid") {
            return <Col key={`input_${index}`} span={3}>
                <Select
                    style={{width: "90%"}}
                    options={category}
                    onChange={(value: SelectValue) => selectOnChange(value, item)}
                    placeholder={`查询${inputComLabelArr[index]}`}
                    allowClear
                />
            </Col>
        }
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
                {renderInput}
            </Row>
            <Row style={{width: "100%", height: "95%"}}>
                <Tables
                    urlPromise={urlPromise}
                    ref={tables}
                    condition={condition}
                    deleteAddress={"/article"}
                    isGoTo={"/home/detail/article"}
                    putAddress={"/article"}
                    inputComData={inputComData}
                    inputComLabelArr={inputComLabelArr}
                >
                    <Column title="序号" dataIndex="key" key="key"/>
                    <Column title="ID" dataIndex="id" key="id"/>
                    <Column title="类型" dataIndex="name" key="name"/>
                    <Column title="标题" dataIndex="title" key="title"/>
                    <Column title="简述" dataIndex="synopsis" key="synopsis"/>
                    <Column title="图片地址" dataIndex="img" key="img"/>
                    <Column title="状态" dataIndex="boutique" key="boutique"
                            render={boutique => (
                                <>{boutique === "1" ?
                                    <Tag color="#87d068">精品</Tag> :
                                    <Tag color="#2db7f5">普通</Tag>}
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

export default ArticleManagement;