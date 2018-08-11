
	app.controller("kac_exclusiveCtlr",["$scope","swiper",function($scope,swiper){
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
			
			
		}])
