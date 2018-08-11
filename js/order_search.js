define(['uiRouter'],function(){
	var order_searchApp = angular.module('order_searchModule',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('order_search',{
				url:'/order_search',
				templateUrl:'Views/order_search/order_search.html',
			
				controller:'order_searchCtlr',
			});
		})
		
		.controller("order_searchCtlr",["$scope","$state",function($scope,$state){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		
			$scope.historyArr=["水笔","鼠标","复印纸","计算器","铅笔","钢笔","键盘","鼠标垫","办公本子","报事贴","电脑清洁用品"];
			$scope.order_para = function($event){
				console.log($($event.target).html());
				var obj = {};
				obj.search = $($event.target).html();
				var OBJ = JSON.stringify(obj);
				sessionStorage.setItem("orderKey",OBJ);
				$state.go("myOrder");
			}
		
		}])
});