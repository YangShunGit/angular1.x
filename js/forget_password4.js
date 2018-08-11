define(['uiRouter'],function(){
	var forget_password4 = angular.module('forget_password4Module',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('forget_password4',{
				url:'/forget_password4',
				templateUrl:'Views/forget_password4/forget_password4.html',
				
				controller:'forgetPsd4Ctlr',
			});
		})
		.controller("forgetPsd4Ctlr",function($scope){
		
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
		})
});