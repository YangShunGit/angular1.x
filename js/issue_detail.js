
		app.controller("issue_detailCtlr",["$scope","$timeout",function($scope,$timeout){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
		/*--youshangjiao--*/
		$scope.d = false;
		$scope.change_nav = function(){
			$scope.d =!$scope.d;
		}
		$scope.searchFlag = function(){
			SearchFlag = true;
		}
		
		var issueScroll;
		function issueLoaded(){
			issueScroll=new IScroll(".wrapper",{
				preventDefault:false,
				onBeforeScrollStart:null,
				bounce:true
			});
		}
		var issueTimer=$timeout(function(){
			issueLoaded();
			$(".issue_detail")[0].addEventListener('touchmove',
			prevent
			, isPassive() ? {
				capture: false,
				passive: false
			} : false);
		},200);
		
		
		}])
