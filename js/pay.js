
		app.controller("payCtlr",["$scope","$state","$timeout","PaymodesService",function($scope,$state,$timeout,PaymodesService){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		
		console.log("2",myPaymodesData);
		PaymodesService.listData(myPaymodesData).then(function(res){
			console.log(res);
			$scope.paymodes = res.data.resources[0].paymodes;
			$scope.paymode= sessionStorage.getItem("paymode");
			$timeout(function(){
				if($scope.paymode=='2'){
					$(".model_sel li").css({"color":"#232326","border":"1px solid #cbcbcb"});
					$(".mode_sel li:nth-child(2)").css({"color":"#f52f2c","border":"1px solid #f52f2c"});
					$(".tips").html($scope.paymodes[1].note);
				}else if($scope.paymode=="3"){
					$(".model_sel li").css({"color":"#232326","border":"1px solid #cbcbcb"});
					$(".mode_sel li:nth-child(3)").css({"color":"#f52f2c","border":"1px solid #f52f2c"});
					$(".tips").html($scope.paymodes[2].note);
				}else{
					$(".model_sel li").css({"color":"#232326","border":"1px solid #cbcbcb"});
					$(".mode_sel li:first-child").css({"color":"#f52f2c","border":"1px solid #f52f2c"});
					$(".tips").html($scope.paymodes[0].note);
				}
			},100);
			
		})
		
		
		//$scope.order_info= JSON.parse(sessionStorage.getItem("default_info"));
		//console.log($scope.order_info);
		//$scope.payment = $scope.order_info.pay_mode;
		
		
		
		
		/*获取填写订单里的支付方式（临时存储）*/
		$scope.border=function($event){
			/*选中切换*/
			$("li").css({
				"color":"#232326",
				"border":"1px solid #cbcbcb"
			});
			$($event.target).css({
				"color":"#f52f2c",
				"border":"1px solid #f52f2c"
			})
			var id = parseInt($($event.target).attr("paymodeid")); 
			/*提示信息对应改变*/
			$(".tips").html($scope.paymodes[id-1].note);
			if(id==3){
				$scope.paymode = "3";
			}
			else if(id==2){
				$scope.paymode = "2";
			}
			else{
				$scope.paymode = "1";
			}			
		}
		/*点击确定*/
		$(".pay_foot_box").on("click",function(){
			sessionStorage.setItem("paymode",$scope.paymode);
			window.history.go(-1);
		})
		}])
