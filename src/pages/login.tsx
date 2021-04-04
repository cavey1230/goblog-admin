import {Button, Checkbox, Col, Form, Input, Row} from 'antd';
import React from 'react';

import "./login.less";
import {showToast} from "@/utils/lightToast";
import {GoblogApiV1} from "@/utils/fetchApi";
import {RouteComponentProps, withRouter} from "react-router-dom";

const Login:React.FC<RouteComponentProps> = ({history}) => {
    const layout = {
        labelCol: {span: 6},
        wrapperCol: {span: 17, offset: 1},
    }
    const tailLayout = {
        wrapperCol: {push: 7, span: 17},
    }

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const {username,password} = values
        const result = await GoblogApiV1.POST("/public/admin_login", {username,password})
        const {status,token} = result
        if (status===200){
            localStorage.setItem("token",token)
            history.push("/home")
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        showToast("登录失败", "error")
    }

    return (
        <Row className="cover-row" align={"middle"}>
            <Col span={8} offset={8}>
                <div className="title"><span>欢迎登</span>录</div>
                <Form
                    className="form-pad"
                    {...layout}
                    name="basic"
                    labelAlign="left"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button style={{fontWeight: 600}} type="primary" htmlType="submit" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default withRouter(Login);