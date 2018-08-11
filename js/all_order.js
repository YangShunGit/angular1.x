
		app.controller("all_orderCtlr",["$scope", "$timeout", "swiper","$state","OrdersService","CancelorderService","ReturnfororderService","AppagainService","BugagainService","OrdersignService","StatesService",function($scope, $timeout,swiper,$state,OrdersService,CancelorderService,ReturnfororderService,AppagainService,BugagainService,OrdersignService,StatesService) {
			$scope.myBack = function() {
				sessionStorage.removeItem("sdstate");
				window.history.go(-1);
			}
			
			//搜索key
			var key = "";
			//退换货提交参数
			Returnsubmit = {
				"taketime": "",
				"contactname": "",
				"phone": "",
				"operatetype": "",
				"memo": "",
				"logisticstype": "",
				"reason": "",
				"orderno": "",
				"details": [],
				"images": []
			}
			//当我的订单页面没有历史记录时page为1
			if(MyOrderPage == 1){
				var page = 1;
			}else{
				page = MyOrderPage;
			}
			$scope.page = 1;
			
			$scope.sdstate = sessionStorage.getItem("sdstate");
			if($scope.sdstate == null){
				$scope.sdstate = "";
			}
			
			var all_orders;
			
			var myOrderScroll;
			$scope.order_index=0;
			var is_require = true;
			function resReduce(res){
				$scope.goods = res.data.resources[0].orders;
				MyOrderPage = res.data.resources[0].page;
				AllPage = res.data.resources[0].pages;
				All_orders = All_orders.concat($scope.goods);
				if(parseInt(res.data.resources[0].pages)==page){
					$(".loadingmore").css("display","none");
					$(".nomore").css("display","block");
				}else{
					$(".nomore").css("display","none");
					$(".loadingmore").css("display","flex");
				}
				if(All_orders.length==0){
					$(".loadingmore").css("display","none");
				}
				console.log($scope.goods,All_orders);
			}
			
			function reduce(){
				if(All_orders.length==0){
					$(".if_empty p").html("您还没有相关订单！");
					$(".myOrder_ul").css("display","none");
					$(".if_empty").css("display","block");
				}else{
					$(".myOrder_ul").css("display","block");
					$(".if_empty").css("display","none");
					for(var j = 0; j < $scope.goods.length; j++) {
						var myLi = $(".myOrder_ul #myOrder_li").clone(true);
						$(myLi).removeAttr("id");
						$(myLi).attr("class","myOrder_li");
						$(myLi).find(".head_number").html($scope.goods[j].billno);
						$(myLi).find(".head_status").html($scope.goods[j].statename);
						$(myLi).find(".cancel_order").attr("orderno",$scope.goods[j].orderno);
						$(myLi).find(".cancel_order").attr("billno",$scope.goods[j].billno);
						$(myLi).find(".cancel_order").attr("order-index",$scope.order_index);
						$(myLi).find(".head_number").attr("orderno",$scope.goods[j].orderno);
						$(myLi).find(".head_number").attr("order-index",$scope.order_index);
						
						for(var k = 0;k<$scope.goods[j].packages.length;k++){
							//console.log($(".myOrder_ul #li_package"));
							var myPackage = $($(".myOrder_ul #li_package")[0]).clone(true);
							$(myPackage).removeAttr("id");
							$(myPackage).attr("class","li_package");
							
							$(myPackage).find(".package_name").html("包裹"+(k+1));
							$(myPackage).find(".package_number").html($scope.goods[j].packages[k].billno);
							
							
							if($scope.goods[j].packages.length<=1){
								$(myPackage).find(".package_head").css("display","none");
								$(myPackage).find(".package_body").attr("orderno",$scope.goods[j].orderno);
								$(myPackage).find(".package_body").attr("packageid","");
								$(myPackage).find(".package_body").attr("order-index",$scope.order_index);
							}else{
								$(myPackage).find(".package_head").attr("orderno",$scope.goods[j].orderno);
								$(myPackage).find(".package_head").attr("order-index",$scope.order_index);
								$(myPackage).find(".package_head").attr("package-index",k);
								$(myPackage).find(".package_head").attr("packageid",$scope.goods[j].packages[k].packageid);
								$(myPackage).find(".package_body").attr("orderno",$scope.goods[j].orderno);
								$(myPackage).find(".package_body").attr("order-index",$scope.order_index);
								$(myPackage).find(".package_body").attr("package-index",k);
								$(myPackage).find(".package_body").attr("packageid",$scope.goods[j].packages[k].packageid);
								
							}
							
							$(myPackage).find(".new_info").html($scope.goods[j].packages[k].logistics[0].actiondesc);
							$(myPackage).find(".day").html($scope.goods[j].packages[k].logistics[0].actiontime);
							$(myPackage).find(".true_money .counts").html($scope.goods[j].packages[k].itemcount);
							$(myPackage).find(".view_logistics").attr("order-index",$scope.order_index);
							$(myPackage).find(".view_logistics").attr("package-index",k);
							
							$(myPackage).find(".shop_price").html($scope.goods[j].totalfee);
							
							$(myPackage).find(".apply_service").attr("orderno",$scope.goods[j].orderno);
							$(myPackage).find(".apply_service").attr("billno",$scope.goods[j].billno);
							//确认收货按钮
							$(myPackage).find(".confirm_receipt").attr("orderno",$scope.goods[j].orderno);
							$(myPackage).find(".confirm_receipt").attr("billno",$scope.goods[j].billno);
							$(myPackage).find(".confirm_receipt").attr("packageid",$scope.goods[j].packages[k].packageid);
							$(myPackage).find(".confirm_receipt").attr("order-index",$scope.order_index);
							$(myPackage).find(".confirm_receipt").attr("package-index",k);
							//再次申请按钮
							$(myPackage).find(".again_apply").attr("orderno",$scope.goods[j].orderno);
							$(myPackage).find(".again_apply").attr("billno",$scope.goods[j].billno);
							$(myPackage).find(".again_buy").attr("orderno",$scope.goods[j].orderno);
							$(myPackage).find(".again_buy").attr("billno",$scope.goods[j].billno);
							$(myPackage).find(".again_buy").attr("packageid",$scope.goods[j].packages[k].packageid);
							
							if($scope.goods[j].packages[k].items.length == 1) {
								$(myPackage).find(".shop_box1").css("display", "none");
								$(myPackage).find(".shop_box").css("display", "block");
								$(myPackage).find(".shop_box .shop_pic img").attr("src", $scope.goods[j].packages[k].items[0].middleurl);
								$(myPackage).find(".shop_box .shop_title div").html($scope.goods[j].packages[k].items[0].itemname);
							} else {
								$(myPackage).find(".shop_box1").css("display","block");
								$(myPackage).find(".shop_box").css("display", "none");
								//console.log($scope.goods[j].packages[k].items);
								$.each($scope.goods[j].packages[k].items,function(index, obj) {
									var mySwiperSlide = $("#swiper-slide").clone(true);
									$(mySwiperSlide).removeAttr("id");
									$(mySwiperSlide).attr("class","swiper-slide");
									$(mySwiperSlide).find("img").attr("src",obj.middleurl);
									
									$(mySwiperSlide).appendTo($(myPackage).find(".swiper-wrapper"));
								})
							}
							
							$(myPackage).find(".shop_counts").html($scope.goods[j].packages[k].totalqty);
							$(myPackage).find(".shop_price").html($scope.goods[j].packages[k].totalfee);
						
							/*--取消订单--*/
							if($scope.goods[j].cancancel=="1"){
								$(myLi).find(".cancel_order_box").css("display","block");
							}else{
								$(myLi).find(".cancel_order_box").css("display","none");
							}
							
							/*--申请售后--*/
							if($scope.goods[j].canreturn=="1"){
								$(myPackage).find(".apply_service").css("display","block");
							}else{
								$(myPackage).find(".apply_service").css("display","none");
							}
							
							/*--确认收货--*/
							if($scope.goods[j].packages[k].cansign=="1"){
								$(myPackage).find(".confirm_receipt").css("display","block");
							}else{
								$(myPackage).find(".confirm_receipt").css("display","none");
							}
							
							/*--再次申请--*/
							if($scope.goods[j].canappagain=="1"){
								$(myPackage).find(".again_apply").css("display","block");
							}else{
								$(myPackage).find(".again_apply").css("display","none");
							}
							$(myPackage).appendTo($(myLi).find(".myOrder_li_a"));
						}
						$scope.order_index++;
						$(myLi).appendTo(".myOrder_ul");
					}
					}
					//$("img.lazy").lazyload({effect: "fadeIn"});
					$timeout(function(){
						myOrderScroll.refresh();
					},200);
			}
			
			function myOrderLoaded() {
				myOrderScroll = new IScroll(".myOrder_wrapper",{
					probeType:3,
					vScrollbar: false,
					preventDefault: false,
					checkDOMChanges:true,
					bounce:false
				});
				myOrderScroll.on("scrollStart",function(e){
					//console.log("开启");
					is_require = true;
				});
				myOrderScroll.on("scroll",function(e){
					
					$(".myOrder_wrapper").trigger('scroll');
					//console.log($(".myOrder_ul").position());
					//is_require确保每次获取到数据之后再进行第二次获取
					if(parseInt(AllPage) > page&&is_require&&myOrderScroll.maxScrollY > myOrderScroll.y-200){
						is_require = false;
						console.log("124",is_require);
						page++;
						var myOrdersData = OrdersData("","",$scope.sdstate,page,10,key);
						console.log("数据=======",myOrdersData);
						OrdersService.listData(myOrdersData).then(function(res){
							resReduce(res);
							reduce();
				        })
					}
				});
				
				
				$(".to_top").on("click",function(){
					myOrderScroll.scrollTo(0,0);
					$(".to_top").css("display","none");
				});
			}

			function isPassive() {
				var supportsPassiveOption = false;
				try {
					addEventListener("test", null, ObjectProperty({}, 'passive', {
						get: function() {
							supportsPassiveOption = true;
						}
					}));
				} catch(e) {}
				return supportsPassiveOption;
			}
			var myOrderTimer = $timeout(function() {
				myOrderLoaded();
				document.removeEventListener("touchmove",prevent,false);
			}, 200);
			
			//判断手指左右滑动,左右滑动时允许浏览器默认事件，上下滑动时禁用浏览器默认事件；
			$timeout(function(){
				var startX, startY, moveEndX, moveEndY, X, Y;
			    $(".myOrder_wrapper").on("touchstart", function(e) {
			        startX = e.originalEvent.changedTouches[0].pageX,
			        startY = e.originalEvent.changedTouches[0].pageY;
			        touchflag = true;
			    });
			    $(".myOrder_wrapper").on("touchmove", function(e) {
			    	if(touchflag){
			    		touchflag = false;
			        moveEndX = e.originalEvent.changedTouches[0].pageX,
			        moveEndY = e.originalEvent.changedTouches[0].pageY,
			        X = moveEndX - startX,
			        Y = moveEndY - startY;
			 		console.log(X,Y);
			        if ( Math.abs(X) > Math.abs(Y) && X > 0||Math.abs(X) > Math.abs(Y) && X < 0 ) {
			            
						console.log("开");
						document.removeEventListener("touchmove",prevent,false);
						
			        }else if(Math.abs(X) <= Math.abs(Y) && X > 0||Math.abs(X) <= Math.abs(Y) && X < 0){
			        	
						document.addEventListener('touchmove',
							prevent
							, isPassive() ? {
								capture: false,
								passive: false
							} : false);
						
						
					}
			       }
			    });
			    $("myOrder_wrapper").on("touchend", function(e) {
			    	
					document.addEventListener('touchmove',
							prevent
							, isPassive() ? {
								capture: false,
								passive: false
							} : false);
			    });
			},300);
			
			
			
			//返回到我的订单myOrder页面时，滚动到历史记录的位置，判断All_orders是否有值，mine页面进行清空；
			if(All_orders.length>0){
				console.log(All_orders);
				$scope.goods = All_orders;
				reduce();
				$timeout(function(){
					if(AllPage == MyOrderPage){
						$(".loadingmore").css("display","none");
						$(".nomore").css("display","block");
					}else{
						$(".nomore").css("display","none");
						$(".loadingmore").css("display","flex");
					}
					myOrderScroll.scrollTo(0,parseInt(MyOrderScrollTop));
					myOrderScroll.refresh();
				},200);
				
			}else{
				var myOrdersData = OrdersData("","",$scope.sdstate,1,10,"");
				OrdersService.listData(myOrdersData).then(function(res) {
					//console.log(res.data.orders);
					console.log(res);
					resReduce(res);
					reduce();
				})
			}
			
			
			if(Sdstates == ""){
				var myStatesData = StatesData("1");
				StatesService.listData(myStatesData).then(function(res){
					console.log(res);
					$scope.sdstates = res.data.resources[0].sdstates;
					Sdstates = $scope.sdstates;
					$(".myOrder_title").html($scope.sdstates[0].statename);
					$timeout(function(){
						//statesScroll.refresh();
						//console.log($(".status_nav_list ul li"));
						$(".status_nav_list ul li").find("div").css("background","rgba(0,0,0,0)");
						$($(".status_nav_list ul li")[0]).find("div").css("background","rgba(0,0,0,0.6)");
					},300);
				})
			}else{
				$scope.sdstates = Sdstates;
				for(var a=0;a<$scope.sdstates.length;a++){
					if($scope.sdstates[a].billstate==$scope.sdstate){
						console.log($scope.sdstates[a].statename);
						$(".myOrder_title").html($scope.sdstates[a].statename);
					}
				}
				//console.log(State_index,$(".status_nav_list"));
				$timeout(function(){
					$(".status_nav_list ul li").find("div").css("background","rgba(0,0,0,0)");
					$($(".status_nav_list ul li")[State_index]).find("div").css("background","rgba(0,0,0,0.6)");
				
				},300);
			}
			
			/*--点击状态切换--*/
			$timeout(function(){
				$scope.stateFn = function($event){
					nav_hide();
					var that = $event.target;
					var billstate = $($event.target).attr("billstate");
					if(State_index!=$($event.target).attr("data-index")){
						$(".is_load").css("display","block");
						State_index = $($event.target).attr("data-index");
						$scope.sdstate = billstate;
						//console.log(State_index);
						sessionStorage.setItem("sdstate",billstate);
						page = 1;
						var myOrdersData2 = OrdersData("","",billstate,page,10,"");
						OrdersService.listData(myOrdersData2).then(function(res) {
							myOrderScroll.scrollTo(0,0);
							$(".myOrder_li").remove();
							console.log(res);
							$(".is_load").css("display","none");
							$(".status_nav_list li div").css("background", "rgba(0,0,0,0)");
							$(that).css("background","rgba(0,0,0,0.6)");
							
							$(".myOrder_title").html($(that).html());
							All_orders = [];
							$scope.order_index = 0;
							
							resReduce(res);
							console.log(All_orders);
							reduce();
						})
					}
				};
			},300);
			
			
			
			
			
			/*--订单nav显示隐藏--*/
			$scope.hide_show = false;
			$scope.order_nav = function() {
				if(!$scope.hide_show) {
					nav_show();
					
				} else if($scope.hide_show) {
					nav_hide();
				}
			}


			function nav_hide() {
				$(".myOrder_title").attr("class", "myOrder_title myOrder_title_noActive m_m");
				$(".status_box").css("display", "none");
				$(".mask").css("display", "none");
				$(".arr_up").css("display","none");
				$scope.hide_show = false;
			}

			function nav_show(){
				$(".myOrder_title").attr("class", "myOrder_title myOrder_title_active m_m");
				$(".status_box").css("display", "block");
				$(".mask").css("display", "block");
				$(".arr_up").css("display","block");
				$scope.hide_show = true;
			}
			$scope.mask_fn = function() {
				nav_hide();
			}
			
			
			/*--确认收货--*/
			$(".myOrder_ul").on("click",".confirm_receipt",function(){
				$(".is_load").css("display","block");
				Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var packageid = $(this).attr("packageid");
				var _that = this;
				var myOrdersignData = OrdersignData(orderno,billno,packageid);
				OrdersignService.listData(myOrdersignData).then(function(res){
					console.log(res);
					if(res.data.error == 0){
						$(".is_load").css("display","none");
						All_orders[Order_index].packages[Package_index].cansign = "0";
				
						//判断所有的包裹是否全部都确认签收，如果全部签收，则状态变为已签收；
						var cansignFlag = true;
						for(var k=0;k<All_orders[Order_index].packages.length;k++){
							if(All_orders[Order_index].packages[k].cansign=="1"){
								cansignFlag = false;
							}
						}
						if(cansignFlag){
							All_orders[Order_index].statename = "已签收";
							$(_that).parent().parent().parent().siblings(".li_head").find(".head_status").html("已签收");
						}
						
						$(_that).css("display","none");
						$(_that).siblings(".view_logistics").css("display","none");
						$(_that).siblings(".again_buy").css("display","none");
						$(_that).siblings(".apply_service").css("display","block");
						$(_that).siblings(".again_buy").css("display","block");
						$(_that).siblings(".again_buy").children("a").css({"border":"1px solid #f52d2d","color":"#f52d2d"});
					}else{
						$(".prompt_fail .txt").html("确认收货失败");
						$(".prompt_fail").fadeIn(200);
						setTimeout(function(){
							$(".prompt_fail").fadeOut(200);
						},1000);
					}
				})
			});
			
			/*--再次购买--*/
			$(".myOrder_ul").on("click",".again_buy",function(){
				$(".is_load").css("display","block");
				MyOrderScrollTop = myOrderScroll.y;
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myBugagainData = CancelorderData(orderno,billno);
				BugagainService.listData(myBugagainData).then(function(res){
					console.log(res);
					if(res.data.error == 0){
						$(".is_load").css("display","none");
						$state.go("cart");
					}else{
						$(".prompt_fail .txt").html("再次购买失败");
						$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
						},1000);
					}
				})
			});
			
			var orderno,billno,_that;
			/*--取消订单--*/
			$(".myOrder_ul").on("click",".cancel_order",function(){
				$(".mask_confirm .txt").html("确定要取消此订单？");
				
				//存储数据修改
				Order_index = $(this).attr("order-index");
				All_orders[Order_index].statename = "交易关闭";
				All_orders[Order_index].cancancel = null;
				
				orderno = $(this).attr("orderno");
				billno = $(this).attr("billno");
				_that = this;
				$(".mask_confirm").css("display","block");
			});
			$timeout(function(){
				$(".mask_confirm .yes").on("click",function(){
					$(".mask_confirm").css("display", "none");
					$(".is_load").css("display","block");
					var myCancelorderData = CancelorderData(orderno,billno);
					CancelorderService.listData(myCancelorderData).then(function(res){
						console.log(res);
						if(res.data.error == 0){
							$(".is_load").css("display","none");
							$(_that).parent().siblings(".head_status").html("交易关闭");
							$(_that).parent().css("display","none");
							$(_that).parent().parent().siblings(".li_package").find(".some_function").find("li").css("display","none");
							$(_that).parent().parent().siblings(".li_package").find(".some_function").find("li.view_logistics").css("display","block");
							$(_that).parent().parent().siblings(".li_package").find(".some_function").find("li.again_buy").css("display","block");
							$(".prompt_success .txt").html("订单取消成功");
							$(".prompt_success").fadeIn(200);
								setTimeout(function(){
									$(".prompt_success").fadeOut(200);
							},1000);
						}else{
							alert(res.data.msg);
						}
					})
				});
				$(".mask_confirm .no").on("click",function(){
					$(".is_load").css("display","none");
					$(".mask_confirm").css("display", "none");
				});
			},200);
			
			
			
			
			
			/*--再次申请弹出框--*/
			$(".myOrder_ul").on("click",".again_apply",function(){
				$(".is_load").css("display","block");
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myAppagainData = AppagainData(orderno,billno,"0");
				AppagainService.listData(myAppagainData).then(function(res){
					console.log(res);
					if(res.data.error == 1){
						$(".is_load").css("display","none");
						$(_that).css("display","none");
						$(".prompt_success .txt").html("已提醒审批");
						$(".prompt_success").fadeIn(200);
							setTimeout(function(){
								$(".prompt_success").fadeOut(200);
						},1000);
					}else{
						alert(res.data.msg);
					}
				})
			});
			
			/*--申请售后--*/
			$(".myOrder_ul").on("click",".apply_service",function(){
				$(".is_load").css("display","block");
				MyOrderScrollTop = myOrderScroll.y;
				var orderno = $(this).attr("orderno");
				var myReturnfororderData = ReturnfororderData(orderno);
				ReturnfororderService.listData(myReturnfororderData).then(function(res){
					console.log(res);
					if(res.data.error==0){
						$(".is_load").css("display","none");
						AppreturnsResources = res.data.resources[0];
						console.log("AppreturnsResources",AppreturnsResources);
						$state.go("application_process");
					}else{
						alert(res.data.msg);
					}
				})
			});
			
			/*--查看物流--*/
			$(".myOrder_ul").on("click",".view_logistics",function(){
				MyOrderScrollTop = myOrderScroll.y;
				console.log(myOrderScroll.y,MyOrderScrollTop);
				Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				$state.go("order_follow");
			});
			
			/*--点击查看订单详情--*/
			$(".myOrder_ul").on("click",".head_number",function(){
				Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				MyOrderScrollTop = myOrderScroll.y;
				var orderno = $(this).attr("orderno");
				var obj = {
					"orderno":orderno,
					"packageid":"",
					"isOrder":"1"
				};
				console.log(obj);
				sessionStorage.setItem("orderDetailData",JSON.stringify(obj));
				$state.go("look_order");
			});
			//点击查看包裹详情
			$(".myOrder_ul").on("click",".package_head",function(){
				MyOrderScrollTop = myOrderScroll.y;
				Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				var orderno = $(this).attr("orderno");
				var packageid = $(this).attr("packageid");
				var obj = {
					"orderno":orderno,
					"packageid":packageid,
					"isOrder":"0"
				};
				console.log(obj);
				sessionStorage.setItem("orderDetailData",JSON.stringify(obj));
				$state.go("look_order");
			});
			$(".myOrder_ul").on("click",".package_body",function(){
				MyOrderScrollTop = myOrderScroll.y;
				Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				var orderno = $(this).attr("orderno");
				var packageid = $(this).attr("packageid");
				var obj = {
					"orderno":orderno,
					"packageid":packageid,
					"isOrder":"0"
				};
				console.log(obj);
				sessionStorage.setItem("orderDetailData",JSON.stringify(obj));
				$state.go("look_order");
			});
			
			$(".searchMask").on("click",function(){
				$(".search_it").val("");
				$(".searchMask").css("display","none");
				$(".search_go").css("display","none");
				$(".search_input input").attr("placeholder","");
				$(".myOrder_right").css({
					'width':'20%',
					'transition':'all 300ms'
				});
			})
		
			$scope.is_search = function(){
				$(".searchMask").css("display","block");
				$(".myOrder_right").css({
					'width':'97%',
					'transition':'all 300ms'
				});
				$timeout(function(){
					$(".search_input input").attr("placeholder","商品名称/商品编号/订单号");
					$(".search_go").css("display","block");
					$(".search_it").val(key);
				},300);
			}
			
			$scope.sou = function(){
				key = $(".search_it").val();
				if(key.length>0){
					$(".is_load").css("display","block");
					All_orders = [];
					page = 1;
					var myOrdersData = OrdersData("","",$scope.sdstate,page,10,key);
					OrdersService.listData(myOrdersData).then(function(res){
						myOrderScroll.scrollTo(0,0);
						$(".myOrder_li").remove();
						$(".search_it").val("");
						$(".searchMask").css("display","none");
						$(".search_go").css("display","none");
						$(".search_input input").attr("placeholder","");
						$(".myOrder_right").css({
							'width':'20%',
							'transition':'all 300ms'
						});
						console.log(res);
						//订单列表初始化
						All_orders = [];
						//订单序号初始化
						$scope.order_index = 0;
						
						resReduce(res);
						reduce();
						$(".is_load").css("display","none");
			        })
				}
			}
		}])
