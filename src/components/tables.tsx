import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef, useRef, PropsWithRef
} from 'react';

import {Table, Space, Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {RouteComponentProps, withRouter} from "react-router-dom";

import {GoblogApiV1} from "@/utils/fetchApi";
import {showToast} from "@/utils/lightToast";
import DrawerPad from "@/components/drawerPad";

import "./tables.less";

const {Column} = Table;
const {confirm} = Modal;

type SearchCondition = {
    condition?: any
    children: JSX.Element[]
    urlPromise: (condition: any, pageNum: number, pageSize: number) => Promise<any>
    deleteAddress: string
    putAddress?: string
    inputComData?: any
    inputComLabelArr?: Array<string>
    isGoTo?: string
}

type Props = SearchCondition & RouteComponentProps

const Tables = (props: Props, ref: React.Ref<unknown>) => {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [visibleParams, setVisibleParams] = useState({visible: false, id: 0, record: {}})
    const drawerPad = useRef(null)
    const {
        condition, children, urlPromise,
        deleteAddress, putAddress, inputComData,
        inputComLabelArr, isGoTo, history
    } = props

    useImperativeHandle(ref, () => ({
        getData: () => getData()
    }));

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        getData()
    }, [pageNum, pageSize])

    const getData = () => {
        // console.log(urlPromise(condition, pageSize, pageNum))
        const promise = urlPromise(condition, pageSize, pageNum)
        promise.then(res => {
            const data = res.data.hasOwnProperty("data") ? res.data.data : res.data
            const innerArr = data?.map(
                (item: any, index: number) => {
                    item["key"] = String(index + 1)
                    return item
                })
            setData(innerArr)
            res.data?.total ? setTotal(res.data.total) : null
        })
    }

    const deleteData = (id: number) => {
        const url = `${deleteAddress}/${id}`
        confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined/>,
            content: '软删除，不会删除数据库数据，仅仅是不展示',
            async onOk() {
                const result = await GoblogApiV1.DELETE(url)
                if (result.status === 200) {
                    showToast("删除成功", "success")
                    getData()
                }
            },
            onCancel() {
                console.log("用户已取消")
            },
        });
    }

    const showDrawer = (id: number, record: any) => {
        drawerPad.current.init()
        setVisibleParams({
            visible: true, id, record
        });
    };

    const onClose = () => {
        drawerPad.current.init()
        setVisibleParams({
            visible: false, id: 0, record: {}
        });
    };

    return (
        <React.Fragment>
            <Table
                dataSource={data}
                pagination={{
                    total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPageNum(page)
                        setPageSize(pageSize)
                    }
                }}
                className="tables"
                size={"middle"}
                style={{}}
            >
                {children}
                <Column
                    title="操作"
                    key="action"
                    render={(text, record: any) => (
                        <Space size="middle">
                            <a onClick={() => {
                                showDrawer(record.id, record)
                            }}>
                                编辑{record.name || record.title || record.username}
                            </a>
                            {
                                isGoTo ? <a onClick={() => {
                                    history.push(`${isGoTo}/${record.id}`)
                                }}>
                                    修改内容
                                </a> : ""
                            }
                            <a onClick={() => deleteData(record.id)}>
                                删除
                            </a>
                        </Space>
                    )}
                />
            </Table>
            <DrawerPad
                ref={drawerPad}
                inputComData={inputComData}
                inputComLabelArr={inputComLabelArr}
                visibleParams={visibleParams}
                putAddress={putAddress}
                onClose={onClose}
                getData={getData}
            />
        </React.Fragment>
    );
}

// const mapStateToProps = (state: RootState,ownProps:any) => {
//     return {pageInfo: state.pageInfo,...ownProps}
// }

// ref 转发
const withRouterForwardRef = (Component: React.FC) => {
    const WithRouter = withRouter(({forwardedRef, ...props}: any) => (
        <Component ref={forwardedRef} {...props} />
    ));

    return forwardRef((props: any, ref: any) => (
        <WithRouter {...props} forwardedRef={ref}/>
    ));
};

export default withRouterForwardRef(forwardRef(Tables));