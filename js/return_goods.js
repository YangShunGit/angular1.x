
		app.controller("return_goodsCtlr", ["$scope", "$timeout", "$state", "ReturnsService", "OrdersService", "ReturnfororderService", "CancelorderService","CancelreturnService","ReturnorderService","AppagainService", function($scope, $timeout, $state, ReturnsService, OrdersService, ReturnfororderService, CancelorderService,CancelreturnService,ReturnorderService,AppagainService) {
			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}

			/*--youshangjiao--*/
			$scope.d = false;
			$scope.change_nav = function() {
				$scope.d = !$scope.d;
			}
			$scope.searchFlag = function() {
				SearchFlag = true;
			}
			$(".is_load").css("display","block");
			//售后列表状态参数；
			var returnStatus = sessionStorage.getItem("returnStatus");
			var page = MyOrderPage;
		
			var myReturnScroll;
			function myReturnLoaded() {
				myReturnScroll = new IScroll(".return_wrapper", {
					preventDefault: false,
					probeType: 3
				});
				myReturnScroll.on("scroll", function() {
					//console.log(is_require, myReturnScroll.maxScrollY, myReturnScroll.y);
					if(parseInt(AllPage) > page&&is_require && myReturnScroll.maxScrollY > myReturnScroll.y) {
						is_require = false;
						page++;
						console.log("调用");
						if(returnStatus == "order") {
							var myOrdersData = OrdersData("", "", "5", page, 10);
							OrdersService.listData(myOrdersData).then(function(res) {
								console.log(res);
								if(parseInt(AllPage) > page){
									$(".loadingmore").css("display","flex");
								}else{
									$(".loadingmore").css("display","none");
								}
								All_orders = All_orders.concat(res.data.resources[0].orders);
								renderOrder(res);
							})
						} else {
							var myReturnsData = ReturnsData("", page, 10);
							ReturnsService.listData(myReturnsData).then(function(res) {
								console.log(res);
								if(parseInt(AllPage) > page){
									$(".loadingmore").css("display","flex");
								}else{
									$(".loadingmore").css("display","none");
								}
								All_orders = All_orders.concat(res.data.resources[0].orders);
								renderReturn(res);
							})
						}
					}
				})
			}


			var myOrderTimer = $timeout(function() {
				myReturnLoaded();
				$(".return")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 200);
			//is_require确保每次获取到数据之后再进行第二次获取
			var is_require = true;
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
			if(returnStatus==null){
				returnStatus = "order";
				var myOrdersData = OrdersData("", "", "5", page, 10);
				OrdersService.listData(myOrdersData).then(function(res) {
					console.log(res);
					AllPage = res.data.resources[0].pages;
					All_orders = All_orders.concat(res.data.resources[0].orders);
					if(parseInt(AllPage) > page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					$(".is_load").css("display","none");
					if(res.data.resources[0].orders.length == 0) {
						$(".if_empty p").html("未找到相关订单！");
						$(".bottom").css("display", "none");
						$(".if_empty").css("display", "block");
					}
					renderOrder(res);
				});
			}else if(returnStatus == "order"){
				returnStatus = "order";
				var res = {
					data:{
						resources:[
							{
								orders:All_orders
							}
						]
					}
				}
				
				renderOrder(res);
				$timeout(function(){
					if(parseInt(AllPage) > page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					myReturnScroll.scrollTo(0,parseInt(MyOrderScrollTop));
				},200);
			}else{
				$(".return_nav span.nav1").css({
					"color": "#0d0d0f",
					"border": "none"
				});
				$(".return_nav span.nav2").css({
					"color": "#f62f2a",
					"border-bottom": "2px solid #f62f2a"
				});
				$(".return_order_list").css("display","none");
				$(".return_progress_list").css("display","block");
				returnStatus = "return";
				var res = {
					data:{
						resources:[
							{
								orders:All_orders
							}
						]
					}
				}
				console.log(res);
				renderReturn(res);
				$timeout(function(){
					if(parseInt(AllPage) > page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					myReturnScroll.scrollTo(0,parseInt(MyOrderScrollTop));
				},200);
			}
			
			

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

			//售后申请列表渲染函数
			function renderOrder(res) {
				$scope.goods1 = res.data.resources[0].orders;
				console.log("查看===",$scope.goods1);
				for(var i = 0; i < $scope.goods1.length; i++) {
					console.log("渲染成功");
					var myLi = $(".return_order_list #return_order_li").clone(true);
					$(myLi).removeAttr("id");
					$(myLi).attr("class", "return_order_li");
					$(myLi).find(".order_number_box").html($scope.goods1[i].billno);
					$(myLi).find(".order_number").attr("orderno", $scope.goods1[i].orderno);
					$(myLi).find(".shop_list").attr("orderno", $scope.goods1[i].orderno);
					$(myLi).find(".status").html($scope.goods1[i].statename);
					$(myLi).find(".order_time").html($scope.goods1[i].shipdate);
					$(myLi).find(".order_hour").html($scope.goods1[i].shop_time);
					$(myLi).find(".apply_service").attr("orderno", $scope.goods1[i].orderno);
					$(myLi).find(".apply_service").attr("billno", $scope.goods1[i].billno);
					
					if($scope.goods1[i].details == 1) {
						$(myLi).find(".shop_info_box2").css("display", "none");
						$(myLi).find(".shop_info_box").css("display", "block");
						$(myLi).find(".shop_info_box .pic img").attr("data-original", $scope.goods1[i].details[0].smallurl);
						$(myLi).find(".shop_info_box .pic_info .title").html($scope.goods1[i].details[0].itemname);
						$(myLi).find(".shop_info_box .pic_info .count span").html($scope.goods1[i].details[0].orderqty);
					} else {
						$(myLi).find(".shop_info_box2").css("display", "block");
						$(myLi).find(".shop_info_box").css("display", "none");
						$.each($scope.goods1[i].details, function(index, obj) {
							var mySwiperSlide = $("#swiper-slide").clone(true);
							$(mySwiperSlide).removeAttr("id");
							$(mySwiperSlide).attr("class", "swiper-slide");
							$(mySwiperSlide).find("img").attr("data-original", obj.middleurl);
							$(mySwiperSlide).appendTo($(myLi).find(".swiper-wrapper"));
						})
					}
					
					$(myLi).appendTo(".return_order_list");

				}
				$("img.lazy").lazyload({effect: "fadeIn"});
				$timeout(function() {
					myReturnScroll.refresh();
					is_require = true;
				}, 200);
			}

			//售后记录渲染列表
			function renderReturn(res) {
				$scope.goods2 = res.data.resources[0].orders;
				for(var i = 0; i < $scope.goods2.length; i++) {
					var myLi = $(".return_progress_list #return_progress_li").clone(true);
					$(myLi).removeAttr("id");
					$(myLi).attr("class", "return_progress_li");
					$(myLi).find(".order_number_box").html($scope.goods2[i].billno);
					$(myLi).find(".status").html($scope.goods2[i].statename);
					$(myLi).find(".cancel_apply").attr("returnno", $scope.goods2[i].returnno);
					$(myLi).find(".order_time").html($scope.goods2[i].createtime);
					$(myLi).find(".order_number").attr("returnno",$scope.goods2[i].returnno);
					$(myLi).find(".shop_list").attr("returnno",$scope.goods2[i].returnno);
					$(myLi).find(".apply_service").attr("orderno", $scope.goods2[i].returnno);
					$(myLi).find(".apply_service").attr("billno", $scope.goods2[i].billno);
					
					
					if($scope.goods2[i].detail.length == 1) {
						$(myLi).find(".shop_info_box2").css("display", "none");
						$(myLi).find(".shop_info_box").css("display", "block");
						$(myLi).find(".order_time").html($scope.goods2[i].detail[0].shop_date);
						$(myLi).find(".order_hour").html($scope.goods2[i].detail[0].shop_time);
						$(myLi).find(".shop_info_box .pic img").attr("data-original", $scope.goods2[i].detail[0].littleurl);
						$(myLi).find(".shop_info_box .pic_info .title").html($scope.goods2[i].detail[0].itemname);
					} else {
						$(myLi).find(".shop_info_box2").css("display", "block");
						$(myLi).find(".shop_info_box").css("display", "none");
						$.each($scope.goods2[i].detail, function(index, obj) {
							var mySwiperSlide = $("#swiper-slide").clone(true);
							$(mySwiperSlide).removeAttr("id");
							$(mySwiperSlide).attr("class", "swiper-slide");
							$(mySwiperSlide).find("img").attr("data-original", obj.littleurl);
							$(mySwiperSlide).appendTo($(myLi).find(".swiper-wrapper"));
						})
					}
					if($scope.goods2[i].canappagain =="0"){
						$(myLi).find(".apply_service").css("display","none");
					}
					if($scope.goods2[i].cancancel =="0"){
						$(myLi).find(".cancel_apply").css("display","none");
					}
					if($scope.goods2[i].canappagain =="0"&&$scope.goods2[i].cancancel =="0"){
						$(myLi).find(".some_function").css("display","none");
					}
					$(myLi).appendTo(".return_progress_list");
				}
				$("img.lazy").lazyload({effect: "fadeIn"});
				$timeout(function() {
					myReturnScroll.refresh();
					is_require = true;
				}, 200);
			}

			
			$(".return_record").on("click", function() {
				if(returnStatus == "order"){
					All_orders = [];
					$(".return_progress_li").detach();
					$(".is_load").css("display","block");
					$("span.nav1").css({
						"color": "#0d0d0f",
					    "border": "none"
					})
					$('span.nav2').css({
						"color": "#f62f2a",
					    "border-bottom": "2px solid #f62f2a"
					})
					$(".return_order_list").css({
						"display": "none"
					});
					$(".return_progress_list").css({
						"display": "block"
					});
					returnStatus = "return";
					page = 1;
					var myReturnsData = ReturnsData("", page, 10);
					ReturnsService.listData(myReturnsData).then(function(res) {
						console.log(res);
						All_orders = All_orders.concat(res.data.resources[0].orders);
						$(".is_load").css("display","none");
						if(res.data.resources[0].orders.length == 0) {
							$(".if_empty p").html("未找到相关订单！");
							$(".bottom").css("display", "none");
							$(".if_empty").css("display", "block");
						}
						renderReturn(res);
						myReturnScroll.refresh();
					})
				}
			})
			$(".return_apply").on("click", function() {
				if(returnStatus == "return"){
					All_orders = [];
					$(".return_order_li").detach();
					$(".is_load").css("display","block");
					$("span.nav2").css({
						"color": "#0d0d0f",
					    "border": "none"
					})
					$('span.nav1').css({
						"color": "#f62f2a",
					    "border-bottom": "2px solid #f62f2a"
					})
					$(".return_order_list").css({
						"display": "block"
					});
					$(".return_progress_list").css({
						"display": "none"
					});
					returnStatus = "order";
					page = 1;
					var myOrdersData = OrdersData("", "", "5", page, 10);
					OrdersService.listData(myOrdersData).then(function(res) {
						console.log(res);
						AllPage = res.data.resources[0].pages;
						All_orders = All_orders.concat(res.data.resources[0].orders);
						$(".is_load").css("display","none");
						if(res.data.resources[0].orders.length == 0) {
							$(".if_empty p").html("未找到相关订单！");
							$(".bottom").css("display", "none");
							$(".if_empty").css("display", "block");
						}
						renderOrder(res);
						myReturnScroll.refresh();
					});
				}
				
			})
			
			
			
			/*--点击申请售后--*/
			$(".return_order_list").on("click", ".apply_service", function() {
				MyOrderPage = page;
				MyOrderScrollTop = myReturnScroll.y;
				sessionStorage.setItem("returnStatus",returnStatus);
				$(".is_load").css("display", "block");
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myReturnfororderData = ReturnfororderData(orderno);
				ReturnfororderService.listData(myReturnfororderData).then(function(res) {
					console.log(res);
					AllPage = res.data.resources[0].pages;
					if(res.data.error == 0) {
						$(".is_load").css("display", "none");
						AppreturnsResources = res.data.resources[0];
						//console.log("AppreturnsResources",AppreturnsResources);
						$state.go("application_process");
					} else {
						alert(res.data.msg);
					}
				})
			})

			/*--再次申请弹出框--*/
			$(".return_progress_list").on("click", ".apply_service", function() {
				$(".is_load").css("display","block");
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myAppagainData = CancelorderData(orderno,billno);
				AppagainService.listData(myAppagainData).then(function(res){
					console.log(res);
					$(".is_load").css("display","none");
					if(res.data.error == 0){
						$(".is_load").css("display","none");
						$(".prompt_success .txt").html("已提醒审批");
						$(".prompt_success").fadeIn(200);
							setTimeout(function(){
								$(".prompt_success").fadeOut(200);
						},1500);
					}else{
						$(".prompt_fail .txt").html(res.data.msg);
						$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
						},1500);
					}
				})
				
			});

			var returnno, _that;
			/*--取消售后--*/
			$(".return_progress_list").on("click", ".cancel_apply", function() {
				$(".mask_confirm .txt").html("确定要取消此订单的售后吗？");
				//存储数据修改
				returnno = $(this).attr("returnno");
				
				_that = this;
				$(".mask_confirm").css("display", "block");
			});
			$timeout(function() {
				$(".mask_confirm .yes").on("click", function() {
					$(".mask_confirm").css("display", "none");
					$(".is_load").css("display", "block");
					var myCancelreturnData = CancelreturnData(returnno);
					CancelreturnService.listData(myCancelreturnData).then(function(res) {
						console.log(res);
						if(res.data.error == 0) {
							$(".is_load").css("display", "none");
							$(_that).parent().parent().siblings(".order_number_b").find(".status").html("已作废");
							$(_that).parent().parent().detach();
							myReturnScroll.refresh();
							$(".prompt_success .txt").html("订单取消成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
							}, 1000);
						} else {
							alert(res.data.msg);
							$(".is_load").css("display", "none");
						}
					})
				});
				$(".mask_confirm .no").on("click", function() {
					$(".is_load").css("display", "none");
					$(".mask_confirm").css("display", "none");
				});
			}, 200);
			
			/*--点击查看退单详情--*/
			$(".return_progress_list").on("click",".order_number",function(){
				//Order_index = $(this).attr("order-index");
				//Package_index = $(this).attr("package-index");
				//MyOrderScrollTop = myOrderScroll.y;
				MyOrderPage = page;
				MyOrderScrollTop = myReturnScroll.y;
				sessionStorage.setItem("returnStatus",returnStatus);
				$(".is_load").css("display","block");
				var returnno = $(this).attr("returnno");
				var myCancelreturnData = CancelreturnData(returnno);
				ReturnorderService.listData(myCancelreturnData).then(function(res) {
					console.log(res);
					if(res.data.error==0){
						ReturnDetail = res.data.resources[0];
						$(".is_load").css("display","none");
						$state.go("returnOrderDetail");
					}else{
						alert(res.data.msg);
					}
				})
			});
			$(".return_progress_list").on("click",".shop_list",function(){
				//Order_index = $(this).attr("order-index");
				//Package_index = $(this).attr("package-index");
				//MyOrderScrollTop = myOrderScroll.y;
				MyOrderPage = page;
				MyOrderScrollTop = myReturnScroll.y;
				sessionStorage.setItem("returnStatus",returnStatus);
				var returnno = $(this).attr("returnno");
				
				var myCancelreturnData = CancelreturnData(returnno);
				ReturnorderService.listData(myCancelreturnData).then(function(res) {
					console.log(res);
					if(res.data.error==0){
						ReturnDetail = res.data.resources[0];
						$(".is_load").css("display","none");
						$state.go("returnOrderDetail");
					}else{
						alert(res.data.msg);
					}
				})
			});
			
			/*--点击查看订单详情--*/
			$(".return_order_list").on("click",".order_number",function(){
				/*Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				MyOrderScrollTop = myOrderScroll.y;*/
				MyOrderPage = page;
				MyOrderScrollTop = myReturnScroll.y;
				sessionStorage.setItem("returnStatus",returnStatus);
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
			$(".return_order_list").on("click",".shop_list",function(){
				/*Order_index = $(this).attr("order-index");
				Package_index = $(this).attr("package-index");
				MyOrderScrollTop = myOrderScroll.y;*/
				MyOrderPage = page;
				MyOrderScrollTop = myReturnScroll.y;
				sessionStorage.setItem("returnStatus",returnStatus);
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
			
			
			

		}])
