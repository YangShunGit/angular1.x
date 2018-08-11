define(['uiRouter'],function(){
	var forget_password5 = angular.module('forget_password5Module',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('forget_password5',{
				url:'/forget_password5',
				templateUrl:'Views/forget_password5/forget_password5.html',
				
				controller:'forgetPsd5Ctlr',
			});
		})
		.controller("forgetPsd5Ctlr",function($scope){
		
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
		})
});