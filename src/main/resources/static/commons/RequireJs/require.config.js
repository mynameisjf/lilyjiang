require.config({
	baseUrl:"resources/commons/",
	paths:{
		"jquery" :"jquery/jquery-1.11.3.min",
		'Grid':'RapidUI/js/Grid',
        'echart':'RapidUI/js/gallery/echarts/3.1.7/echarts.min',
		/* Tip Begin */
		"BasicTip":'RapidUI/js/arale/tip/1.2.0/basic-tip-debug',
		"tip":'RapidUI/js/arale/tip/1.2.0/tip-debug',
		/* Tip End */
		"iframe-shim":"RapidUI/js/arale/iframe-shim/1.0.2/iframe-shim-debug",
		/* widget begin */
		"widget":"RapidUI/js/arale/widget/1.2.0/widget-debug",
		"DAParser":"RapidUI/js/arale/widget/1.2.0/daparser-debug",
		"AutoRender":"RapidUI/js/arale/widget/1.2.0/auto-render-debug",
		/* widget end */
		"class":"RapidUI/js/arale/class/1.2.0/class-debug",
		"events":'RapidUI/js/arale/events/1.2.0/events-debug',
		"popup":"RapidUI/js/arale/popup/1.1.5/popup-debug",
		/* Base Begin */
		"Attribute":"RapidUI/js/arale/base/1.2.0/attribute-debug",
		"Aspect":"RapidUI/js/arale/base/1.2.0/aspect-debug",
		"base":"RapidUI/js/arale/base/1.2.0/base-debug",
		/* Base end */
		/*autocomplete Begin*/
		"autocomplete":"RapidUI/js/arale/autocomplete/1.3.0/autocomplete-debug",
		"autoDataSource":"RapidUI/js/arale/autocomplete/1.3.0/autoDataSource-debug",
		"autoFilter":"RapidUI/js/arale/autocomplete/1.3.0/autoFilter-debug",
		"autoInput":"RapidUI/js/arale/autocomplete/1.3.0/autoInput-debug",
		"autotemplate":"RapidUI/js/arale/autocomplete/1.3.0/autotemplate-debug",
		/*autocomplete end*/
		/*calendar Begin*/
		"calendarEn":"RapidUI/js/arale/calendar/1.1.2/i18n/en-debug",
		"calenderZh-cn":"RapidUI/js/arale/calendar/1.1.2/i18n/zh-cn-debug",
		"calendar":"RapidUI/js/arale/calendar/1.1.2/calendar-debug",
		"calendarBaseCalendar":"RapidUI/js/arale/calendar/1.1.2/calendarBaseCalendar-debug",
		"calendarDateColumn":"RapidUI/js/arale/calendar/1.1.2/calendarDateColumn-debug",
		"calendarMonthColumn":"RapidUI/js/arale/calendar/1.1.2/calendarMonthColumn-debug",
		"calendarYearColumn":"RapidUI/js/arale/calendar/1.1.2/calendarYearColumn-debug",
		"calendarBaseColumn":"RapidUI/js/arale/calendar/1.1.2/calendarBaseColumn-debug",
		/*calendar end*/
		/*cookie Begin*/
		"cookie":"RapidUI/js/arale/cookie/1.0.2/cookie-debug",
		/*cookie end*/
		/*detector Begin*/
		"detector":"RapidUI/js/arale/detector/1.2.1/detector-debug",
		/*detector end*/
		/*dialog Begin*/
		"confirmbox":"RapidUI/js/arale/dialog/1.2.1/confirmbox-debug",
		"dialog":"RapidUI/js/arale/dialog/1.2.1/dialog-debug",
		"dialogHandlebars":"RapidUI/js/arale/dialog/1.2.1/dialogHandlebars-debuge",
		"confirmboxHandlebars":"RapidUI/js/arale/dialog/1.2.1/confirmboxHandlebars-debug",
		/*dialog end*/
		/*dnd Begin*/
		"dnd":"RapidUI/js/arale/dnd/1.0.0/dnd-debug",
		/*dnd end*/
		/*easing Begin*/
		"easing":"RapidUI/js/arale/easing/1.0.0/easing-debug",
		/*easing end*/
		/*events Begin*/
		"events":"RapidUI/js/arale/events/1.2.0/events-debug",
		/*events end*/
		/*messenger Begin*/
		"messenger":"RapidUI/js/arale/messenger/1.0.2/messenger-debug",
		/*messenger end*/
		/*overlay Begin*/
		"overlay":"RapidUI/js/arale/overlay/1.1.2/overlay-debug",
		"mask":"RapidUI/js/arale/overlay/1.1.2/mask-debug",
		/*overlay end*/
		/*placeholder Begin*/
		"placeholder":"RapidUI/js/arale/placeholder/1.1.0/placeholder-debug",
		/*placeholder end	*/
		/*popup Begin*/
		"popup":"RapidUI/js/arale/popup/1.1.5/popup-debug",
		/*popup end*/
		/*position Begin*/
		"position":"RapidUI/js/arale/position/1.0.1/position-debug",
		/*position end*/
		/*select Begin*/
		"select":"RapidUI/js/arale/select/0.9.6/select-debug",
		"selectHandlebars":"RapidUI/js/arale/select/0.9.6/selectHandlebars-debug",
		/*select end*/
		/*sticky Begin*/
		"sticky":"RapidUI/js/arale/sticky/1.2.1/sticky-debug",
		/*sticky end*/
		/*switchable Begin*/
		"switchable":"RapidUI/js/arale/switchable/1.0.0/switchable-debug",
		"const":"RapidUI/js/arale/switchable/1.0.0/const-debug",
		"circular":"RapidUI/js/arale/switchable/1.0.0/circular-debug",
		"autoplay":"RapidUI/js/arale/switchable/1.0.0/autoplay-debug",
		"effects":"RapidUI/js/arale/switchable/1.0.0/effects-debug",
		"accordion":"RapidUI/js/arale/switchable/1.0.0/accordion-debug",
		"carousel":"RapidUI/js/arale/switchable/1.0.0/carousel-debug",
		"tabs":"RapidUI/js/arale/switchable/1.0.0/tabs-debug",
		/*switchable end*/
		/*templatable Begin*/
		"templatable":"RapidUI/js/arale/templatable/0.9.2/templatable-debug",
		/*templatable end*/
		/*upload Begin*/
		"upload":"RapidUI/js/arale/upload/1.0.1/upload-debug",
		/*upload end*/
		/*validator Begin*/
		"validator":"RapidUI/js/arale/validator/0.9.7/validator-debug",
		"item":"RapidUI/js/arale/validator/0.9.7/item-debug",
		"rule":"RapidUI/js/arale/validator/0.9.7/rule-debug",
		"utils":"RapidUI/js/arale/validator/0.9.7/utils-debug",
		"core":"RapidUI/js/arale/validator/0.9.7/core-debug",
		'async':'RapidUI/js/arale/validator/0.9.7/async-debug',
		/*validator end*/

		/*--------------gallery Begin-----------*/
		/*appmenu Begin*/
		"appmenu":"RapidUI/js/gallery/appmenu/1.0.0/appmenu-debug",
		/*appmenu end*/
		/*d3 Begin*/
		"d3":"RapidUI/js/gallery/d3/3.4.3/d3-debug",
		/*d3 end*/
		/*handlebars Begin*/
		"handlebars":"RapidUI/js/gallery/handlebars/1.0.2/handlebars-debug",
		"handlebars-runtime":"RapidUI/js/gallery/handlebars/1.0.2/runtime-debug",
		/*handlebars end*/
		/*menu Begin*/
		"menu":"RapidUI/js/gallery/menu/1.0.0/menu-debug",
		/*menu end*/
		/*metro Begin*/
		"metro":"RapidUI/js/gallery/metro/1.0.0/metro-debug",
		/*metro end*/
		/*moment Begin*/
		"moment":"RapidUI/js/gallery/moment/2.0.0/moment-debug",
		/*moment end*/
		/*range Begin*/
		"range":"RapidUI/js/gallery/range/1.0.1/range-debug",
		/*range end*/
		/*schedule Begin*/
		"schedule":"RapidUI/js/gallery/schedule/1.0.1/schedule-debug",
		"lunar":"RapidUI/js/gallery/schedule/1.0.1/lunar-debug",
		"i18n":"RapidUI/js/gallery/schedule/1.0.1/i18n-debug",
		/*schedule end*/
		"schedule1":"RapidUI/js/gallery/schedule1/1.0.0/schedule-debug",
		'sch1lunar':'RapidUI/js/gallery/schedule1/1.0.0/sch1lunar',
		'sch1i18n':'RapidUI/js/gallery/schedule1/1.0.0/sch1i18n',
		/*scroll Begin */
		"scroll":"RapidUI/js/gallery/scroll/1.0.0/scroll-debug",
		/*scroll end*/
		/*selection Begin*/
		"selection":"RapidUI/js/gallery/selection/0.9.0/selection-debug",
		/*selection end*/
		/*-----------gallery ------end*/

		/*-----------beau Bgin-----*/
		/*autoForm Begin*/
		"autoForm":"RapidUI/js/beau/autoForm/1.0.0/autoForm-debug",
		/*autoForm end*/
		/*browserStorage Begin*/
		"browserStorage":"RapidUI/js/beau/browser-storage/1.0.0/storage-debug",
		/*browserStorage end*/
		/*calendar Begin*/
		"whcdsCalendar":"RapidUI/js/beau/calendar/1.1.2/calendar-debug",
		/*calendar end*/
		/*dialog Begin*/
		"whcds-confirmboxHandlebars":"RapidUI/js/beau/dialog/1.0.0/confirmbox-handlebars-debug",
		"whcds-confirmbox":"RapidUI/js/beau/dialog/1.0.0/confirmbox-debug",
		"whcds-dialog":"RapidUI/js/beau/dialog/1.0.0/dialog-debug",
		"whcds-dialogHandlebars":"RapidUI/js/beau/dialog/1.0.0/dialog-handlebars-debug",
		/*dialog end*/
		/*dnd Begin*/
		"dnd":"RapidUI/js/beau/dnd/0.0.1/dnd-debug",
		/*dnd end*/
		/*echarts Begin*/
		"echarts":"RapidUI/js/beau/echarts/3.6.2/echarts.min",
		/*echarts end*/
		/*form Begin*/
		"form":"RapidUI/js/beau/form/1.0.0/form-debug",
		/*form end*/
		/*lazyload Begin*/
		"lazyload":"RapidUI/js/beau/lazyload/0.0.1/lazyload",
		/*lazyload end*/
		/*menu Begin*/
		"menu":"RapidUI/js/beau/menu/1.0.0/menu-debug",
		/*menu end*/
		/*offlineStorage Begin*/
		"offlineStorage":"RapidUI/js/beau/offline-storage/1.0.0/offline-storage-debug",
		/*offlineStorage end*/
		/*pagination Begin*/
		"pagination":"RapidUI/js/beau/pagination/1.0.0/pagination-debug",
		/*pagination end*/
		/*schedule Begin	---------------------------------------
		"schedule":"RapidUI/js/beau/schedule/1.0.0/schedule-debug",
		"i18n":"RapidUI/js/beau/schedule/1.0.0/i18n-debug",
		"lunar":"RapidUI/js/beau/schedule/1.0.0/lunar-debug",*/
		/*schedule end*/
		/*scroll Begin*/
		"scroll":"RapidUI/js/beau/scroll/1.0.0/scroll-debug",
		/*scroll end*/
		/*select  Begin*/
		"selects":"RapidUI/js/beau/select/1.0.0/select-debug",
		"selecTpl":"RapidUI/js/beau/select/1.0.0/selecTpl-debug",
		/*select end*/
		/*selectTree Begin*/
		"selectTree":"RapidUI/js/beau/select-tree/1.0.0/select-tree-debug",
		"selectHandlebars":"RapidUI/js/beau/select-tree/1.0.0/selectHandlebars-debug",
		/*selectTree end*/
		/*sticky Begin*/
		"sticky":"RapidUI/js/beau/sticky/1.0.0/sticky-debug",
		/*sticky end*/
		/*switchable Begin*/
		"whcdsAccordion":"RapidUI/js/beau/switchable/1.0.0/accordion-debug",
		"whcdsCarousel":"RapidUI/js/beau/switchable/1.0.0/carousel-debug",
		"whcdsConst":"RapidUI/js/beau/switchable/1.0.0/const-debug",
		"whcdsSlide":"RapidUI/js/beau/switchable/1.0.0/slide-debug",
		"whcdsTabs":"RapidUI/js/beau/switchable/1.0.0/tabs-debug",
		/*switchable end*/
		/*time Begin*/
		"time":"RapidUI/js/beau/time/1.0.0/time-debug",
		/*time end*/
		/*util Bedgin*/
		"util":"RapidUI/js/beau/util/1.0.0/util-debug",
		/*util end*/
		/*validator Begin*/
		"whcdsValidator":"RapidUI/js/beau/validator/1.0.0/validator-debug",
		"whcdsRules":"RapidUI/js/beau/validator/1.0.0/rules-debug",
		"whcdsComboRules":"RapidUI/js/beau/validator/1.0.0/combo-rules-debug",
		"whcdsZhcn":"RapidUI/js/beau/validator/1.0.0/i18n/zh-cn-debug",
		"whcdsEnus":"RapidUI/js/beau/validator/1.0.0/i18n/en-us-debug",
		/*validator end*/
		/*viewBinder Begin*/
		"computeDeps":"RapidUI/js/beau/viewBinder/1.0.0/compute-deps",
		"filter":"RapidUI/js/beau/viewBinder/1.0.0/filter-debug",
		"observableModel":"RapidUI/js/beau/viewBinder/1.0.0/observable-model-debug",
		"parseElement":"RapidUI/js/beau/viewBinder/1.0.0/parse-element-debug",
		"parseExpression":"RapidUI/js/beau/viewBinder/1.0.0/parse-expression-debug",
		/*viewBinder end*/
		/*-------------beau end-----*/
		/*-------------Bootstrap Strat-----*/
		'select2': 'bootstrap/select2/4.0.3/js/select2.full',
        'selectAction':'RapidUI/js/PlugSelect2',

        /*上传插件*/
		'uploadFile':'bootstrap/BootstrapFileInput/4.3.2/js/fileinput.min',	
		/*滚动条插件*/
        'nicescroll' : 'jquery/jquery.nicescroll-master/3.6.8/jquery.nicescroll.min',
        /*提示插件*/
        'alertify' : 'plus/alert/1.7.1/alertify.min',
        /*modalShow*/
        "modalShow": "RapidUI/js/rapid.ui.modal",
        /*ztree*/
		'Ztree': 'jquery/Ztree/V3/js/jquery.ztree.all.min'

		/*-------------Bootstrap End-----*/

	},
	waitSeconds: 10,
	urlArgs: "alpha=1.0.0",
    map: {
        '*': {
            'css': 'RequireJs/css.min'
        }
    },
    shim: {
    	tip: {
            deps: [ 'css!../../resources/commons/RapidUI/css/widget.css','css!../../resources/commons/RapidUI/js/arale/tip/1.2.0/tip-debug.css']
        },
        'whcds-dialog':{
        	deps:['css!../../resources/commons/RapidUI/js/beau/dialog/1.0.0/dialog-debug.css']
        },
		'whcdsTabs':{
			deps:['css!../../resources/commons/RapidUI/js/beau/switchable/1.0.0/tabs-debug.css']
		},
        'whcdsCalendar':{
    		deps:['css!../../resources/commons/RapidUI/js/beau/calendar/1.1.2/calendar-debug.css']
    	},
    	'selectTree':{
    		deps:['css!../../resources/commons/RapidUI/js/beau/select-tree/1.0.0/select-tree-debug.css']
    	},
    	'schedule':{
    		deps:['css!../../resources/commons/RapidUI/js/gallery/schedule/1.0.1/schedule-debug.css']
    	},
    	'schedule1':{
    		deps:['css!../../resources/commons/RapidUI/js/gallery/schedule1/1.0.0/schedule-debug.css']
    	},
    	'select2': {
			deps: ['jquery',
				'css!../../resources/commons/bootstrap/select2/4.0.3/css/select2.css',
				'css!../../resources/commons/bootstrap/select2/4.0.3/css/select2-bootstrap.min.css'
			]
		},
        'uploadFile': {
            deps: ['jquery','css!../../resources/commons/bootstrap/BootstrapFileInput/4.3.2/css/fileinput.min.css']
        },
        'nicescroll': {
            deps: ['jquery','css!../../resources/commons/jquery/jquery.nicescroll-master/3.6.8/jquery.nicescroll.min.css']
        },
        'alertify': {
            deps: ['jquery',
                   'css!../../resources/commons/plus/alert/1.7.1/css/alertify.min.css',
                   'css!../../resources/commons/plus/alert/1.7.1/css/themes/bootstrap.min.css'
                   ]
        },
		'Ztree': {
			deps: ['jquery',
				/* 				      'css!../../resources/commons/plus/Ztree/V3/css/outlook.css' , 
				 */
				'css!../../resources/commons/jquery/Ztree/V3/css/metroStyle/metroStyle.css'
			]
		}
    }
});