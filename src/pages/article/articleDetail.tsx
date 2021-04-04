import React, {useEffect, useRef, useState} from 'react';
import MarkDownEditor from "@/components/markDownEditor";
import {Button, Col, Row} from 'antd';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";

type Params = {
    id: string
}

const ArticleDetail: React.FC<RouteComponentProps> = (props) => {
    const markdown = useRef(null)
    const [content, setContent] = useState("")
    const {id} = (props.match.params as Params)
    const {history} = props

    useEffect(() => {
        new Promise(async () => {
            const result = await GoblogApiV1.GET(`/public/article/${id}`)
            result.status === 200 && setContent(result.data.content)
        }).then()
    }, [props.match.params])

    const onSubmit = async () => {
        const result = await GoblogApiV1.PUT(`/article/${id}`, {
            content: markdown.current.articleContent
        })
        if (result.status === 200) {
            showToast("修改成功", "success")
            history.push("/home/article")
        }
    }

    return (
        <div>
            <Row justify={"start"} style={{marginBottom: "1rem"}}>
                <Col span={4}>
                    <Button
                        onClick={()=>{
                            history.goBack()
                        }}
                        type="primary"
                        block
                    >
                        返回
                    </Button>
                </Col>
            </Row>
            <MarkDownEditor content={content} ref={markdown}/>
            <Row justify={"end"} style={{marginTop: "1rem"}}>
                <Col span={4}>
                    <Button
                        onClick={onSubmit}
                        type="primary"
                        size={"large"}
                        block
                    >
                        确认修改
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default withRouter(ArticleDetail);