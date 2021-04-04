import React from "react";

import {listItem} from "@/utils/routerRender";
import Home from "../pages/home";
import Page404 from "../pages/page404";
import Login from "@/pages/login";
import Category from "@/pages/category";
import Blogroll from "@/pages/blogroll";
import User from "@/pages/user";
import ToolsLink from "@/pages/toolslinke";
import Info from "@/pages/info";
import Copyright from "@/pages/copyright";
import ArticleManagement from "@/pages/article/articleManagement";
import CreateArticle from "@/pages/article/createArticle";
import ArticleDetail from "@/pages/article/articleDetail";
import Timeline from "@/pages/timeline";

export const routers: listItem[] = [
    {
        path: "/",
        exact: true,
        component: Login,
    },
    // {
    //     path: "/article",
    //     component: Article,
    //     routes: [
    //         {
    //             path: "/article/myarticle",
    //             component: Myarticle,
    //             routes: [
    //                 {
    //                     path: "/article/myarticle/:id",
    //                     component: Test01,
    //                 }
    //             ]
    //         },
    //         {
    //             path: "/article/myarticle1",
    //             component: Myarticle,
    //         },
    //         {
    //             path: "/article/myarticle2",
    //             component: Myarticle,
    //         }
    //     ]
    // },
    {
        path: "/home",
        render: () => {
            return localStorage.getItem("token") ? <Home/> : <Login/>
        },
        routes: [
            {
                path: "/home/category",
                component: Category,
            },
            {
                path: "/home/blogroll",
                component: Blogroll,
            },
            {
                path: "/home/user",
                component: User,
            },
            {
                path: "/home/tools_link",
                component: ToolsLink,
            },
            {
                path: "/home/info",
                component: Info,
            },
            {
                path: "/home/copyright",
                component: Copyright,
            },
            {
                path: "/home/article",
                component: ArticleManagement,
            },
            {
                path: "/home/create/article",
                component: CreateArticle,
            },
            {
                path: "/home/detail/article/:id",
                component: ArticleDetail,
            },
            {
                path: "/home/timeline",
                component: Timeline,
            },
            {
                component: Page404
            }
        ]
    },
    {
        path: "/replace",
        redirect: "/",
    },
    {
        component: Page404
    }
]