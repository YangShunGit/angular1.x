define(['uiRouter'],function(){
	var forget_password3 = angular.module('forget_password3Module',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('forget_password3',{
				url:'/forget_password3',
				templateUrl:'Views/forget_password3/forget_password3.html',
				
				controller:'forgetPsd3Ctlr',
			});
		})
		.controller("forgetPsd3Ctlr",function($scope){
		
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
		})
});