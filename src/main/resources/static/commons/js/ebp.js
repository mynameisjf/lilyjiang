/*
  Created by IntelliJ IDEA.
  User: Beau
  Date: 2018/9/4
  Time: 9:12
 */
"use strict";
require.config({
    baseUrl: "commons/",
    paths: {
        'jquery': 'jquery/jquery-1.12.4.min',
        'bootstrap' : 'bootstrap/Bootstrap/3.3.5/js/bootstrap.min',
        'easyui':'easyui/easyui.sample.min',
        'setting': 'js/setting',
        'all': 'js/all',
        'zTree':'zTree/js/jquery.ztree.all-3.5.min'
    },
    map : {
        '*' : {
            'css' : 'RequireJs/css.min'
        }
    },
    shim: {
        bootstrap: {
            deps: ['jquery', 'css!../commons/bootstrap/Bootstrap/3.3.5/css/bootstrap.css','css!../commons/bootstrap/Bootstrap/3.3.5/css/bootstrap-theme.css']
        },
        easyui: {
            deps: ['jquery','css!../commons/easyui/themes/easyui.sample.css']
        },
        all: {
            deps: ['jquery', 'easyui','css!../commons/css/form.min.css'],
            exports: 'EJS'
        },
        zTree:{
            deps: ['jquery','easyui','css!../commons/zTree/css/zTreeStyle.css']
        }
    }
});
define(['jquery','all','bootstrap','zTree'],function($,all,bootstrap,zTree) {
});