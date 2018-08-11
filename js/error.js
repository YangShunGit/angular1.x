define([],function(){
	var errorApp = angular.module('errorModule',[])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('error',{
				url:'/error',
				templateUrl:'Views/error/error.html',
				controller:'errorCtlr',
			});
		})
		
		.controller("errorCtlr",["$scope",function($scope){
			
		}])
});