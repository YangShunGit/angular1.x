
		app.controller("look_orderCtlr", ["$scope", "$timeout","$state","OrderService","AddCartService","AppagainService","OrdersignService","BugagainService","CancelorderService","AppagainService","ReturnfororderService",function($scope, $timeout,$state,OrderService,AddCartService,AppagainService,OrdersignService,BugagainService,CancelorderService,AppagainService,ReturnfororderService) {
			var lookScroll;
			function lookLoaded() {
				lookScroll = new IScroll(".look_wrapper", {
					preventDefault: false
				});
			}

			var lookTimer = $timeout(function() {
				lookLoaded();
				$(".look_box")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 200);
			
			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}	
			OrderFollowFlag = true;
			var myData = JSON.parse(sessionStorage.getItem("orderDetailData"));
			var myOrderData = OrderData(myData.packageid,myData.orderno);
			OrderService.listData(myOrderData).then(function(res){
				console.log(res);
				$scope.exams = res.data.resources[0];
				
				/*--显示物流--*/
				/*for(var i=0;i<$scope.exams.logisticss.length;i++){
					var logis_index = $scope.exams.logisticss.length-1;
					$scope.exams.logisticss_last[i] = $scope.exams.logisticss[logis_index];
				}
				var logis_index = $scope.exams.logisticss.length-1;*/
				$scope.exams.logisticss_last = "待填写";
				/*--实付款--*/
				$scope.lastFee =parseFloat($scope.exams.postfee) + parseFloat($scope.exams.servicefee) + parseFloat($scope.exams.totalfee);  
				$scope.lastFee = $scope.lastFee.toFixed(2);
				/*--包裹显示隐藏--*/
				//console.log($scope.exams.packages.length);
				if($scope.exams.packages.length<=1){
					$timeout(function(){
						$(".shop_list1").css("display","block");
						$(".shop_list2").css("display","none");
						lookScroll.refresh();
					},200);
				}else{
					$timeout(function(){
						$(".shop_list2").css("display","block");
						$(".shop_list1").css("display","none");
						lookScroll.refresh();
					},200);
				}
				
				//==================按钮设置===================
				//取消订单
				if($scope.exams.cancancel=="1"){
					$(".some_function").find(".cancel_order").css("display","block");
				}else{
					$(".some_function").find(".cancel_order").css("display","none");
				}
				//申请售后
				if($scope.exams.canreturn=="1"){
					$(".some_function").find(".apply_service").css("display","block");
				}else{
					$(".some_function").find(".apply_service").css("display","none");
				}
				//再次申请
				if($scope.exams.canappagain=="1"){
					$(".some_function").find(".again_apply").css("display","block");
				}else{
					$(".some_function").find(".again_apply").css("display","none");
				}
				//确认收货
				if($scope.exams.cansign=="1"){
					$(".some_function").find(".confirm_receipt").css("display","block");
				}else{
					$(".some_function").find(".confirm_receipt").css("display","none");
				}
				//再次购买
				$(".some_function").find(".again_buy").css("display","block");
				
				
				/*--发票信息设置--*/
				if($scope.exams.invoice.invoiceflag=="2"){
					$(".add_receipt").html("增值税发票");
					$(".fold_box1").css("display","block");
					$(".fold_box2").css("display","none");
					$(".fold_box3").css("display","none");
				}else if($scope.exams.invoice.invoiceflag=="1"){
					$(".add_receipt").html("普通发票");
					$(".fold_box2").css("display","block");
					$(".fold_box1").css("display","none");
					$(".fold_box3").css("display","none");
				}else{
					$(".add_receipt").html("无需发票");
					$(".fold_box3").css("display","block");
					$(".fold_box1").css("display","none");
					$(".fold_box2").css("display","none");
				}
			})
			
			/*--确认收货--*/
			$(".some_function").on("click",".confirm_receipt",function(){
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var _that = this;
				var packageid = "";
				var myOrdersignData = OrdersignData(orderno,billno,packageid);
				OrdersignService.listData(myOrdersignData).then(function(res){
					console.log(res);
					if(res.data.error == 0){
						if(myData.isOrder=="1"){
							for(var k=0;k<All_orders[Order_index].packages;k++){
								All_orders[Order_index].packages[k].cansign ="0";
							}
						}else{
							All_orders[Order_index].packages[Package_index].cansign ="0";
						}
						$(_that).parent().parent().parent().siblings(".li_head").find(".head_status").html("已签收");
						$(_that).css("display","none");
						$(_that).siblings(".apply_service").css("display","block");
					}else{
						alert(res.data.msg);
					}
				})
			});
			
			
			
		
			/*--再次购买--*/
			$(".some_function").on("click",".again_buy",function(){
				$(".is_load").css("display","block");
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myBugagainData = BugagainData(orderno,"",billno);
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
			$(".some_function").on("click",".cancel_order",function(){
				$(".mask_confirm .txt").html("确定要取消此订单？");
				orderno = $(this).attr("orderno");
				billno = $(this).attr("billno");
				_that = this;
				$(".mask_confirm").css("display","block");
			});
			$timeout(function(){
				$(".mask_confirm .yes").on("click",function(){
					$(".mask_confirm").css("display", "none");
					var myCancelorderData = CancelorderData(orderno,billno);
					CancelorderService.listData(myCancelorderData).then(function(res){
						console.log(res);
						if(res.data.error == 0){
							if(All_orders.length>0){
								console.log(All_orders,Order_index);
								All_orders[Order_index].cancancel="0";
								All_orders[Order_index].statename ="交易关闭";
							}
							$(".status").html("交易关闭");
							$(".some_function").find("li").css("display","none");
							$(".some_function").find("li.again_buy").css("display","block");
							$(".prompt_success .txt").html("订单取消成功");
							$(".prompt_success").fadeIn(200);
								setTimeout(function(){
									$(".prompt_success").fadeOut(200);
							},1000);
						}else{
							$(".prompt_fail .txt").html("订单取消失败");
							$(".prompt_fail").fadeIn(200);
								setTimeout(function(){
									$(".prompt_fail").fadeOut(200);
							},1000);
						}
					})
				});
				$(".mask_confirm .no").on("click",function(){
					console.log("111");
					$(".mask_confirm").css("display", "none");
				});
			},200);
		
			
			/*--再次申请弹出框--*/
			$(".some_function").on("click",".again_apply",function(){
				var orderno = $(this).attr("orderno");
				var billno = $(this).attr("billno");
				var myAppagainData = AppagainData(orderno,billno,0);
				AppagainService.listData(myAppagainData).then(function(res){
					console.log(res);
					if(res.data.error == 1){
						$(_that).css("display","none");
						$(".prompt_success .txt").html("已提醒审批");
						$(".prompt_success").fadeIn(200);
							setTimeout(function(){
								$(".prompt_success").fadeOut(200);
						},1000);
					}else{
						$(".prompt_fail .txt").html(res.data.msg);
						$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
						},1000);
					}
				})
			});
			
			
			/*--申请售后--*/
			$(".some_function").on("click",".apply_service",function(){
				var orderno = $(this).attr("orderno");
				var myReturnfororderData = ReturnfororderData(orderno);
				ReturnfororderService.listData(myReturnfororderData).then(function(res){
					console.log(res);
					if(res.data.error==0){
						AppreturnsResources = res.data.resources[0];
						$state.go("application_process");
					}else{
						$(".prompt_fail .txt").html("售后申请失败");
						$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
						},1000);
					}
				})
			});
			
			/*--查看物流--*/
			$(".look_body_box").on("click",".think",function(){
				
				TheOrder = $scope.exams;
				Package_index = $(this).attr("package_index");
				OrderFollowFlag = false;
				$state.go("order_follow");
			})
			
			
			
			
			
			/*--添加购物车--*/
			
			$scope.add = function($event){	
				var eid = $($event.target).attr("eid");
				var itemid = $($event.target).attr("itemid");
				var orderqty = $($event.target).attr("orderqty");
				var price = $($event.target).attr("price");
				var act = "add";
				var cartid ="";
				var myAddCartData = AddCartData(eid,itemid,orderqty,price,act,cartid);
				console.log(myAddCartData);
				AddCartService.listData(myAddCartData).then(function(res){
					console.log("111",res);
					/*加入购物车成功提示框*/
					$(".prompt2").fadeIn(200);
						setTimeout(function(){
							$(".prompt2").fadeOut(200);
					},1000);
				})
				
			};
			
			
			/*--点击商品跳转至详情页--*/
			
			$scope.go_detail = function($event){
				var shopData = {};
				shopData.itemid =  $($event.target).attr("itemid");
				shopData.eid = $($event.target).attr("eid");
				shopData.colorid = "";
				shopData.sizeid= "";
				shopData = JSON.stringify(shopData);
				sessionStorage.setItem("detail_data",shopData);
				$state.go("detail_page");
			};
			
			
			
			
			
			
			/*--商品栏高度设置--*/
			/*if($scope.goods.shop_count==1){
				$(".list_ul").css("height","100px");
				$(".remainder").css("display","none");
			}else if($scope.goods.shop_count==2){
				$(".list_ul").css("height","210px");
				$(".remainder").css("display","none");
			}*/
			
			
			
			
			
			
			/*--审批流程展开隐藏--*/
			$(".exam .change").on("click",function(){
				if($(this).find(".arrow").css("background-position")=="-410px -180px"){
					$(".exam .arrow").css({
						"background-position":"-410px -170px",
					});
					$(".progress").css("display","none");
					$(".exam .change .txt").html("显示全部");
					
						lookScroll.refresh();
						
				
					
				}else{
					$(".exam .arrow").css({
						"background-position":"-410px -180px",
					});
					$(".progress").css("display","block");
					$(".exam .change .txt").html("隐藏全部");
					lookScroll.refresh();
				}
			})
			
			
			/*--展开商品--*/
			$(".remainder").on("click",function(){
				$(".list_ul").css("height","auto");
				$(".list_ul .list_li:last-child .space").css("display","none");
				$(this).css("display","none");
				lookScroll.refresh();
			});
			
			
			
			
			
			/*--发票显示隐藏--*/
			$scope.f_fold = false;
			$scope.change_fold = function(){
				$scope.f_fold = !$scope.f_fold;
				if($scope.f_fold == true){
					$(".fold").css("background-position","-406px -180px");
				}else{
					$(".fold").css("background-position","-406px -170px");
				}
				var time = setTimeout(function(){
					lookScroll.refresh();
					clearTimeout(time);
				},100);
				
				
			};
			
			
			
		
		}])
