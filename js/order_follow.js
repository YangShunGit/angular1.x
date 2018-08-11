
		app.controller("order_followCtlr",["$scope","$timeout",function($scope,$timeout){
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.back(-1);
			}
			$scope.exams={
				billno:"",
				logisticss:""
			}
			if(OrderFollowFlag){
				$scope.all_orders = All_orders;
				$scope.exams = {};
				console.log(All_orders,Order_index,Package_index);
				$scope.exams.billno = $scope.all_orders[Order_index].billno;
				$scope.exams.logisticss = $scope.all_orders[Order_index].packages[Package_index].logistics;
			}else{
				$scope.all_orders = TheOrder;
				console.log(TheOrder.billno,$scope.all_orders);
				$scope.exams.billno = TheOrder.billno;
				$scope.exams.logisticss =TheOrder.packages[Package_index].logistics;
			}
			
			var followScroll;
			function followLoaded(){
				followScroll=new IScroll(".follow_wrapper",{
					preventDefault:false,
					onBeforeScrollStart:null
				});
			}
			
			var followTimer=$timeout(function(){
				followLoaded();
				$(".follow")[0].addEventListener('touchmove',
			prevent, isPassive() ? {
				capture: false,
				passive: false
			} : false);
			},200);
			
		}])
