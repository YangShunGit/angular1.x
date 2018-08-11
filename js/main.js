require.config({
	paths:{
		'app':"app",
		"angular":'angular.min',
		"uiRouter":"angular-ui-router-0.4.2.min",
		"angularCSS":"angular-css1.0.8",
		"css":"css.min",
		"swiper":"swiper.min",
		"datePicker":"datePicker",
		"iscroll":"iscroll",
		"scroll_prode":"scroll_prode",
		"fly":"jquery.fly.min",
		"switchery":"switchery.min",
		"home":"home",
		"category":"category",
		"cart":"cart",
		"mine":"mine",
		"login":"login",
		"register":"register",
		"register1":"register1",
		"help_center":"help_center",
		"forget_password":"forget_password",
		"forget_password2":"forget_password2",
		"forget_password3":"forget_password3",
		"forget_password4":"forget_password4",
		"forget_password5":"forget_password5",
		"searchPage":"searchPage",
		"place":"place",
		"upload_license":"upload_license",
		"shop_list":"shop_list",
		"detail_page":"detail_page",
		"fill_order":"fill_order",
		"receiver_address":"receiver_address",
		"pay":"pay",
		"carry_info":"carry_info",
		"receipt_info":"receipt_info",
		"address_edit":"address_edit",
		"order_success":"order_success",
		"look_order":"look_order",
		"split":"split",
		"date":"date",
		"myCollect":"myCollect",
		"card":"card",
		"exam_center":"exam_center",
		"cost_center":"cost_center",
		"new_receiver":"new_receiver",
		"return_goods":"return_goods",
		"application_process":"application_process",
		"application_process2":"application_process2",
		"myOrder":"myOrder",
		"order_search":'order_search',
		"order_follow":"order_follow",
		"personal_info":"personal_info",
		"username":"username",
		"email":"email",
		"tel":"tel",
		"phone":"phone",
		"purchase_words":"purchase_words",
		"uniform_manage":"uniform_manage",
		"uniform_detail":"uniform_detail",
		"repair_cost":"repair_cost",
		"repair_fill":"repair_fill",
		"repair_item":"repair_item",
		"repair_place":"repair_place",
		"repair_urg":"repair_urg",
		"revise_order":"revise_order",
		"addressSearch":"addressSearch",
		"returnOrderDetail":"returnOrderDetail",
		"error":"error",
		"error_msg":"error_msg",
		"email_detail":"email_detail",
		"kac_exclusive":"kac_exclusive",
		"ocLazyLoad":"ocLazyLoad.min",
		"me-lazyload":"me-lazyload",
		"lazyload":"jquery.lazyload"
		
		
	},
	map: {
        '*': {
            'css': 'css.min'
        }
    },
	shim:{
		"uiRouter":{
			deps:["angular"]
		},
		"angularCSS":{
			deps:["angular"]
		},
		"ocLazyLoad":{
			deps:["angular"]
		},
		"me-lazyload":{
			deps:["angular"]
		},
		"app":{
			deps:["uiRouter","ocLazyLoad","me-lazyload","lazyload"]
		}
	}	
});
require(['app'],function(){
	console.log("main启动");
		angular.bootstrap(document, ['myModule']);
})