
		app.controller("order_successCtlr",["$scope","$timeout","$state","OrderSubmitService",function($scope,$timeout,$state,OrderSubmitService){
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			console.log(SuccessInfo);
			$scope.successInfo = SuccessInfo;
			$scope.billno = $scope.successInfo[0].billno;
			$scope.totalfee = $scope.successInfo[0].totalfee;
			$scope.bpms = $scope.successInfo[0].bpms;
			var obj = {"orderno":$scope.successInfo[0].orderno,"packageid":""}
			sessionStorage.setItem("orderDetailData",JSON.stringify(obj));
			if($scope.bpms.length >0){
				$(".exam").css("display","block");
			}
			
			var orderSuccessScroll;
			function orderSuccessLoaded(){
				orderSuccessScroll = new IScroll(".submit_wrapper",{
					preventDefault:false,
				});
			}
			var orderSuccessTimer = $timeout(function(){
				orderSuccessLoaded();
				$(".submit")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},500);
			
			$scope.goHome = function(){
				$state.go("home");
			}
		}])
