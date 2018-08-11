
		app.controller("revise_orderCtlr", ["$scope","$timeout","$filter", "$state","CartDataService","CartEditService","AddCartService","CollectService","EditorderService", function($scope, $timeout,$filter, $state,CartDataService,CartEditService,AddCartService,CollectService,EditorderService) {
			
			$scope.myBack = function(){
				ReviseDetails = "";
				window.history.go(-1);
			}
			
			/*--惯性滑动iscroll--*/
			var cartScroll;

			function cartLoaded() {
				var refresh_flag = false;
				var y,touchend_falg=false,start_y;
				cartScroll = new IScroll(".cart_wrapper", {
					preventDefault: false,
					probeType:2,
					bounce:true
				});
			}

			var cartTimer = $timeout(function() {
				cartLoaded();
				$(".revise_order_box")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 200);
			
			
			if(ReviseDetails==""){
				window.history.go(-1);
			}else{
				console.log(ReviseDetails);
				$scope.order = ReviseDetails;
				$scope.orderno = ReviseDetails.orderno;
				$scope.details = $scope.order.details;
				for(var i=0;i<$scope.details.length;i++){
					$scope.details[i].isdeleted = "0";
					$scope.details[i].inx = i;
				}
			}
			//console.log(ReviseDetails);
			
			
			/*--商品与删除商品数据分离--*/
			function part(arr){
				var arr1 = [];
				var arr2 = [];
				for(var i=0;i<arr.length;i++){
					if(arr[i].isdeleted=="0"){
						arr1.push(arr[i]);
					}else{
						arr2.push(arr[i])
					}
				}
				$scope.goods = priceSplit(arr1);
				$scope.del_goods = priceSplit(arr2);
				if($scope.del_goods.length==0){
					$(".del_title_box").css("display","none");
					$(".del_list_ul").css("display","none");
				}else{
					$(".del_title_box").css("display","block");
					$(".del_list_ul").css("display","block");
				}
				$timeout(function(){
					$.apply();
					cartScroll.refresh();
				},200);
				
				//合计
				$scope.totalfee = 0;
				for(var k=0;k<$scope.goods.length;k++){
					$scope.totalfee += parseFloat($scope.goods[k].price)*parseFloat($scope.goods[k].orderqty);
					console.log($scope.totalfee);
					$scope.totalfee = parseFloat($scope.totalfee);
				}
				$scope.totalfee = changeTwoDecimal_f($scope.totalfee); 
				
				
			}
			
			part($scope.details);
			
			
			
			/*--价格整数小数分割函数--*/
			function priceSplit(arr) {
				for(var i = 0; i < arr.length; i++) {
					//价格整数、小数部分
					arr[i].itprice = {
						"big_price": "",
						"small_price": ""
					};
					//for循环体
					arr[i].itprice.big_price = parseInt(arr[i].price);
					arr[i].itprice.small_price = arr[i].price.toString().split(".")[1];
				};
				return arr;
			}
			
			$scope.f = true;
			
			$scope.do_count = 1;

			$scope.goods_count = 1;
			/*--增减数量--*/
			$scope.shop_del = function($event) {
				var qty = $($event.target).attr("orderqty");
				if(qty==2){
					$($event.target).css("color","#bfbfbf");
				}
				if(qty>1){
					var inx = $($event.target).attr("inx");
					$scope.details[inx].orderqty = parseInt($scope.details[inx].orderqty)-1;
					$($event.target).parent().siblings(".count_input").children("input").val($scope.details[inx].orderqty);
					part($scope.details);
					$($event.target).parent().siblings(".add").children().css("color","#232227");
				}
				
				
			};
			$scope.shop_add = function($event) {
				var qty = $($event.target).attr("orderqty");
				var inx = $($event.target).attr("inx");
				if(qty==9998){
					$($event.target).css("color","#bfbfbf");
				}
				if(qty<9999){
					$scope.details[inx].orderqty = parseInt($scope.details[inx].orderqty)+1;
					$($event.target).parent().siblings(".count_input").children("input").val($scope.details[inx].orderqty);
					part($scope.details);
					$($event.target).parent().siblings(".del").children().css("color","#232227");
				}
			};
			
			
			var oldValue;
			$scope.shop_click = function($event){
				oldValue = $($event.target).val();
			}
			$scope.shop_keyup = function($event){
				var inx = $($event.target).attr("inx");
				var myValue = $($event.target).val();
				if(myValue!=""){
					var reg = /^[1-9]\d*$/.test(myValue);
					console.log(myValue,reg);
					if(reg){
						if(parseInt(myValue)>9999){
							$($event.target).val(oldValue);
							if(oldValue==1){
								$($event.target).parent(".count_input").siblings(".add").children(".icon-add").css("color","#232227");
								$($event.target).parent(".count_input").siblings(".del").children(".icon-del").css("color","#bfbfbf");
							}
							$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
							$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
							},1000);
						}else if(parseInt(myValue)==1){
							$scope.details[inx].orderqty = 1;
							
							$($event.target).parent(".count_input").siblings(".add").children(".icon-add").css("color","#232227");
							$($event.target).parent(".count_input").siblings(".del").children(".icon-del").css("color","#bfbfbf");
						}else if(parseInt(myValue)==9999){
							$scope.details[inx].orderqty = 9999;
							
							$($event.target).parent(".count_input").siblings(".add").children(".icon-add").css("color","#bfbfbf");
							$($event.target).parent(".count_input").siblings(".del").children(".icon-del").css("color","#232227");
						}else{
							$scope.details[inx].orderqty = parseInt(myValue);
							
							$($event.target).parent(".count_input").siblings(".add").children(".icon-add").css("color","#232227");
							$($event.target).parent(".count_input").siblings(".del").children(".icon-del").css("color","#232227");
						}
					}else{
						$($event.target).val(oldValue);
					}
				}
			}
			$scope.shop_blur = function($event){
				var myValue = $($event.target).val();
				if(myValue==""){
					$($event.target).val(oldValue);
					$(".prompt_fail .txt").html("单件商品不能少于1件");
					$(".prompt_fail").fadeIn(200);
					$timeout(function(){
						$(".prompt_fail").fadeOut(200);
					},1000);
				}
				part($scope.details);
			}
			
			
			
			
		
			/*--点击删除--*/
			$scope.goods_del = function($event){
				var inx= $($event.target).attr("inx");
				$scope.details[inx].isdeleted = "1";
				part($scope.details);
				
			}
			/*--点击恢复--*/
			$scope.goods_rec = function($event){
				var inx= $($event.target).attr("inx");
				$scope.details[inx].isdeleted = "0";
				part($scope.details);
			}
			
			$(".cart_body_box").on("focus","input",function(){
				
				$scope.focus_val = $(this).val();
				console.log($scope.focus_val);
			})
			$(".cart_body_box").on("blur","input",function(){
				console.log(this);
				var blur_val = $(this).val();
				console.log("blur_val",blur_val);
				var reg = /^[1-9]+$/.test(blur_val);
				console.log(reg);
				
				if(reg){
					var inx = $(this).attr("inx");
					var val = $(this).val();
					if(val==1){
						$(this).parent().siblings(".del").children().css("color","#bfbfbf");
					}else{
						$(this).parent().siblings(".del").children().css("color","#232227");
					}
					$scope.details[inx].orderqty = parseInt(val);
					part($scope.details);
					
				}else{
					console.log($scope.focus_val);
					$(this).val($scope.focus_val);
					
				}
				$(".cart_body_box").off("blur","input",function(){});
			});
			
			//遍历数据里面获取参数
			function getData(arr){
				var newArr =[];
				for(var i=0;i<arr.length;i++){
					var obj = {};
					obj.orderid = arr[i].orderid;
					obj.orderqty = arr[i].orderqty;
					obj.isdeleted = arr[i].isdeleted;
					newArr.push(obj);
				}
				return newArr;
			}
			
			//通过提交
			$scope.session_order = function(){
				$(".is_load").css("display","block");
				var orderno = $scope.orderno;
				var details = getData($scope.details);
				var approvalid = ReviseDetails.apid;
				var myEditOrderData = EditOrderData(orderno,details,0,approvalid);
				EditorderService.listData(myEditOrderData).then(function(res){
					console.log(res);
					$(".is_load").css("display","none");
					if(res.data.error==0){
						SuccessInfo = res.data.resources;
						SuccessInfoOrderno = SuccessInfo[0].orderno;
						ReviseDetails="";
						$state.go("order_success");
					}else{
						console.log("报错",res.config.data);
						alert(res.data.msg);
					}
				})
			}
			$scope.pass_submit = function(){
				$(".is_load").css("display","block");
				var orderno = $scope.orderno;
				var details = getData($scope.details);
				var approvalid = ReviseDetails.apid;
				var myEditOrderData = EditOrderData(orderno,details,1,approvalid);
				EditorderService.listData(myEditOrderData).then(function(res){
					console.log(res);
					$(".is_load").css("display","none");
					if(res.data.error==0){
						SuccessInfo = res.data.resources;
						SuccessInfoOrderno = SuccessInfo[0].orderno;
						ReviseDetails="";
						$state.go("order_success");
					}else{
						console.log("报错",res.config.data);
						alert(res.data.msg);
					}
				})
			}
			
		}])

