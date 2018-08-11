
	app.controller("help_centerCtlr",["$scope", "$timeout",function($scope,$timeout){
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		
		$(".ul1 li:last").css("border","none");
		$(".ul2 li:last").css("border","none");
		$(".ul3 li:last").css("border","none");
		$(".ul4 li:last").css("border","none");
		
		/*--youshangjiao--*/
		$scope.d = false;
		$scope.change_nav = function(){
			$scope.d =!$scope.d;
		}
		$scope.searchFlag = function(){
			SearchFlag = true;
		}
		$scope.back_home = function(){
			sessionStorage.setItem("tabIndex",0);
		}
		/*----iscroll----*/
		var helpScroll;
		function helpLoaded(){
			helpScroll=new IScroll("#help",{
				preventDefault:false
			});
		}
		var helpTimer=$timeout(function(){
			helpLoaded();
			
			$(".help_center")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},100);
		
		}])
