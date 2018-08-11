define(['uiRouter'],function(){
	var wordsApp = angular.module('wordsModule',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('words',{
				url:'/words',
				templateUrl:'Views/words/words.html',
				
				controller:'wordsCtlr',
			});
		})
		
		.controller("wordsCtlr",["$scope",function($scope){
		}])
});