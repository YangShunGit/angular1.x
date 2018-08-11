define(['uiRouter'],function(){
	var forget_password = angular.module('forget_passwordModule',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('forget_password',{
				url:'/forget_password',
				templateUrl:'Views/forget_password/forget_password.html',
				
				controller:'forgetPsdCtlr',
			});
		})
		.controller("forgetPsdCtlr",function($scope){
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
		})
});