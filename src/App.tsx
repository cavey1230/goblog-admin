import React from "react";

import {bindEffect, RouterRender} from "./utils/routerRender";
import {withRouter} from "react-router-dom";

// import 'antd/dist/antd.css';
import "./App.less";
import "@/assets/reset.css";

const App = () => {
    return (
        <div className="app-pad">
            <RouterRender type="root"/>
        </div>
    );
}

export default withRouter(bindEffect(App))
