import React, {useEffect} from 'react';
import {Modal, Button, Input, Upload, Select} from 'antd';
import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";
import {UploadChangeParam} from "antd/es/upload/interface";
import {UploadOutlined} from "@ant-design/icons";
import {SelectValue} from 'antd/lib/select';

type Props = {
    flushData?: () => void
    createAddress: string
    inputComData: any
    inputComLabelArr: Array<string>
    buttonName: string
    title: string
}

const CreatePad = (props: Props) => {
    const {createAddress, inputComData, inputComLabelArr, buttonName, title} = props

    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [data, setData] = React.useState({...inputComData});
    const [fileList, setFileList] = React.useState([]);

    useEffect(() => {
        setData(inputComData)
    }, [inputComData])

    const showModal = () => {
        setVisible(true);
    };

    const init = () => {
        setData({...inputComData})
        setFileList([])
    }

    const handleOk = async () => {
        setConfirmLoading(true);
        const result = await GoblogApiV1.POST(createAddress, data)
        if (result.status === 200) {
            props.flushData()
            showToast("新建成功", "success")
        }
        setVisible(false);
        setConfirmLoading(false);
        init()
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
        setData({...inputComData})
        setFileList([])
        init()
    };

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
            return <Upload
                fileList={fileList} maxCount={1}
                onChange={(info) => uploadOnChange(info, item)}
                key={`upload_${index}`} {...uploadConfig}
            >
                <Button icon={<UploadOutlined/>}>上传{objectItem.value}</Button>
            </Upload>
        }

        if (typeof objectItem === "object" && objectItem.type === "select") {
            return <Select
                key={`input_${index}`}
                style={{width: 120}}
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
                // console.log({...data, [item]: event.target.value})
                setData({...data, [item]: event.target.value})
            }}
            addonBefore={inputComLabelArr[index]}
        />
    })

    return (
        <>
            <Button type="primary" onClick={showModal}>
                {buttonName}
            </Button>
            <Modal
                title={title}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                {renderInput}
            </Modal>
        </>
    );
};

export default CreatePad;