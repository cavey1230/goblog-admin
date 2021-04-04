import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Drawer, Button, Input, Upload, Select} from 'antd';
import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";
import {UploadOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload/interface";
import {SelectValue} from "antd/lib/select";

type Props = {
    visibleParams: {
        visible: boolean
        id: number
        record: any
    }
    putAddress: string
    onClose: () => void
    getData: () => void
    inputComData: any
    inputComLabelArr: Array<string>
}

const DrawerPad = (props: Props, ref: React.Ref<unknown>) => {
    const {visibleParams, onClose, getData, putAddress, inputComData, inputComLabelArr} = props
    const {visible, id, record} = visibleParams
    const [data, setData] = useState({...record})
    const [fileList, setFileList] = React.useState([]);

    useEffect(() => {
        setData({...props.visibleParams.record})
    }, [props.visibleParams])

    useImperativeHandle(ref, () => ({
        init: () => {
            setData({...inputComData})
            setFileList([])
        }
    }));

    const edit = async () => {
        const url = `${putAddress}/${id}`
        const copyData = data
        data.hasOwnProperty("role") ? copyData.role = Number(copyData.role) : null
        data.hasOwnProperty("cid") ? copyData.cid = Number(copyData.cid) : null
        const result = await GoblogApiV1.PUT(url, copyData)
        if (result.status === 200) {
            showToast("修改成功", "success")
            getData()
        }
    }

    const uploadConfig = {
        name: 'file',
        action: GoblogApiV1.getBaseUrl() + "/upload",
        headers: {
            Accept: GoblogApiV1.initConfig().headers.Accept,
            Authorization: GoblogApiV1.initConfig().headers.Authorization
        }
    };

    const uploadOnChange = (info: UploadChangeParam, protoName: string) => {
        if (info.file.status !== 'uploading') {
            // 单文件 和 上传的文件列表信息
            console.log(info.file, info.fileList);
            const {url, status} = info.file.response
            if (status === 200) {
                setData({...data, [protoName]: url})
                setFileList([...info.fileList])
            }
        }
        if (info.file.status === 'done') {
            showToast("上传成功", "success")
        } else if (info.file.status === 'error') {
            showToast("上传失败", "error")
        }
    }

    const selectOnChange = (value: SelectValue, protoName: string) => {
        setData({...data, [protoName]: value})
    }

    const renderInput = Object.keys(inputComData).map((item, index) => {
        const objectItem = inputComData[item]

        if (typeof objectItem === "object" && objectItem.type === "upload") {
            return <div style={{margin: "1rem 0"}} key={`upload_${index}`}>
                <Upload
                    fileList={fileList} maxCount={1}
                    onChange={(info) => uploadOnChange(info, item)}
                    {...uploadConfig}
                >
                    <Button icon={<UploadOutlined/>}>上传{objectItem.value}</Button>
                </Upload>
            </div>
        }

        if (typeof objectItem === "object" && objectItem.type === "select") {
            return <Select
                key={`input_${index}`}
                style={{width: 120}}
                value={`${data[item]}`}
                options={objectItem.value}
                onChange={(value: SelectValue) => selectOnChange(value, item)}
                allowClear
            />
        }

        return <Input
            key={`input_${index}`}
            style={{margin: "1rem 0"}}
            value={data[item]}
            onChange={(event) => {
                setData({...data, [item]: event.target.value})
            }}
            addonBefore={inputComLabelArr[index]}
        />
    })

    return (
        <Drawer
            title={`修改${putAddress}`}
            placement="right"
            closable={false}
            width={400}
            onClose={onClose}
            visible={visible}
        >
            <p>当前ID为{id}</p>
            <div>
                {renderInput}
            </div>
            <Button
                style={{marginTop: "2rem"}}
                type={"primary"}
                onClick={() => {
                    edit().then(onClose)
                }}
                block
            >
                提交修改
            </Button>
        </Drawer>
    );
};

export default forwardRef(DrawerPad)