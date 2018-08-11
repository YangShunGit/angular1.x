
		app.controller("kacCtlr", ["$scope", "$timeout", function($scope, $timeout) {
			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}

			/*--youshangjiao--*/
			$scope.d = false;
			$scope.change_nav = function() {
				$scope.d = !$scope.d;
			}
			$scope.searchFlag = function() {
				SearchFlag = true;
			}

			var kacScroll;

			function kacLoaded() {
				kacScroll = new IScroll("#kac_wrapper", {
					preventDefault: false
				});
			}

			
			var kacTimer = $timeout(function() {
				kacLoaded();
				$(".kac")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 100);

		}])
