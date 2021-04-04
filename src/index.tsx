import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from "react-router-dom";
import {createStore, combineReducers,applyMiddleware} from "redux"
import { createLogger } from 'redux-logger';
import {DispatchProp, Provider,} from "react-redux";

import App from "./App";
import {pageInfoReducer} from "@/reducers/pageInfoReducer";

const com = combineReducers(
    {pageInfo: pageInfoReducer}
)

const loggerMiddleware = createLogger()

const store = createStore(com,applyMiddleware(
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
))

export type RootState = ReturnType<typeof com>
export type reduxProps = RootState & DispatchProp

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
    , document.getElementById('root')
);