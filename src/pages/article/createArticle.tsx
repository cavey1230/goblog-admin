import React, {useEffect, useRef, useState} from 'react';
import MarkDownEditor from "@/components/markDownEditor";
import {Button, Col, Input, Row, Select} from 'antd';
import {SelectValue} from "antd/lib/select";
import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";

interface SubmitData {
    [key: string]: any
}

const CreateArticle = () => {
    const [submitData, setSubmitData] = useState({
        title: "", cid: "", synopsis: "", img: "", boutique: ""
    } as SubmitData)
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
    const markdown = useRef(null)

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

    const OnChange = (value: SelectValue, protoName: string) => {
        setSubmitData({...submitData, [protoName]: value})
    }

    const renderInput = Object.keys(inputComData).map((item, index) => {
        const label = inputComLabelArr[index]
        if (item === "boutique" || item === "cid") {
            return <Col key={`input_${index}`} span={3} style={{marginRight: "1rem"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div style={{marginRight: "0.5rem"}}>{label}:</div>
                    <Select
                        style={{flex: 1}}
                        value={`${submitData[item] ? submitData[item] : ""}`}
                        options={item === "cid" ? category : inputComData.boutique.value}
                        onChange={(value: SelectValue) => OnChange(value, item)}
                        placeholder={`请输入${inputComLabelArr[index]}`}
                        allowClear
                    />
                </div>
            </Col>

        }
        return <Col key={`input_${index}`} span={3} style={{marginRight: "1rem"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{marginRight: "0.5rem"}}>{label}:</div>
                <Input
                    style={{flex: 1}}
                    value={submitData[item]}
                    placeholder={`请输入${inputComLabelArr[index]}`}
                    onChange={(event) => {
                        OnChange(event.target.value, item)
                    }}
                />
            </div>
        </Col>
    })

    const onSubmit = async () => {
        const dataLabelArr = Object.keys(submitData).map(item => (!!submitData[item]))
        const dataLabelArrLength = dataLabelArr.length
        if (dataLabelArr.filter(i => i).length !== dataLabelArrLength) {
            showToast("数据未填写完整", "info")
            return
        }
        const {articleContent, setArticleContent} = markdown.current
        const inner_object = {...submitData, content: articleContent, cid: Number(submitData.cid)}
        const result = await GoblogApiV1.POST("/article/add", inner_object)
        result.status === 200 && showToast("创建成功", "success")
        setArticleContent("")
        setSubmitData({
            title: "", cid: "", synopsis: "", img: "", boutique: ""
        })
    }

    return (
        <div>
            <Row style={{marginBottom: "1rem"}}>
                {renderInput}
            </Row>
            <MarkDownEditor ref={markdown}/>
            <Row justify={"end"} style={{marginTop:"1rem"}}>
                <Button
                    onClick={() => {
                        const {setArticleContent} = markdown.current
                        setArticleContent("")
                        setSubmitData({
                            title: "", cid: "", synopsis: "", img: "", boutique: ""
                        })
                    }}
                    type="primary"
                    size={"large"}
                    style={{margin: "0 1rem"}}
                >
                    新建文章
                </Button>
                <Button
                    onClick={onSubmit}
                    type="primary"
                    size={"large"}
                >
                    创建文章
                </Button>
            </Row>
        </div>
    );
};

export default CreateArticle;