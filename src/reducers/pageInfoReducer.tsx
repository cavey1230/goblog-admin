const UPDATE = "UPDATE"
const INIT = "INIT"

export type PageInfo = {
    pageSize: number
    pageNum: number
}

export const pageInfoReducer = (state = {
    pageSize: 10,
    pageNum: 1
}, action: { type: string; data: PageInfo }) => {
    switch (action.type) {
        case UPDATE:
            return action.data
        case INIT:
            return action.data
        default:
            return state
    }
}

export const updatePageInfoAction = (data: PageInfo) => {
    return {
        type: UPDATE,
        data: data,
    }
}

export const initPageInfoAction = () => {
    return {
        type: INIT,
        data: {
            pageSize: 10,
            pageNum: 1
        },
    }
}