
		app.controller("cardCtlr",["$scope","$timeout",function($scope,$timeout){
			
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
			
			var cardScroll;
			function cardLoaded(){
			cardScroll=new IScroll(".card_wrapper",{
				preventDefault:false
			});
		}
		var cardTimer=$timeout(function(){
			cardLoaded();
			$(".card_wrapper")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},100);
			
		}])
