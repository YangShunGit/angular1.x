define(['uiRouter'],function(){
	var placeApp = angular.module('placeModule',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('place',{
				url:'/place',
				templateUrl:'Views/place/place.html',
			
				controller:'placeCtlr',
			});
		})
		.controller("placeCtlr",["$scope","$state","AreaService",function($scope,$state,AreaService){
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
		
			var  myKeys = sessionStorage.getItem('editAddressing');
			//console.log(myKeys);
			if(myKeys){
				console.log(1111,JSON.parse(myKeys));
				myKeys = JSON.parse(myKeys);
				$scope.province = myKeys.receiverstatename;
				$scope.city = myKeys.receivercityname;
				$scope.area = myKeys.receiverdistrictname;
			}else{
				$scope.province = "请选择";
				$scope.city = "请选择";
				$scope.area = "请选择";
			}
			$scope.proStyle = {"display":"block"};
			$scope.citStyle = {"display":"none"};
			$scope.areStyle = {"display":"none"};
			
			var myPlace = AreaData(1);
			AreaService.listData(myPlace).then(function(res){
				console.log(res);
				$scope.placeInfo1 = res.data;
				//console.log(res.data);
				$scope.sheng=function(index){
					//console.log(index);
					var p = index;
					$scope.proStyle = {"display":"none"};
					$scope.citStyle = {"display":"block"};
					$scope.areStyle = {"display":"none"};
					$scope.placeInfo2 = res.data[index].city;
					$scope.province = res.data[p].name;
					myPlace.province = $scope.province;
					$scope.shi = function(index){
						//console.log(index);
						var s = index;
						$scope.proStyle ={"display":"none"};
						$scope.citStyle = {"display":"none"};
						$scope.areStyle = {"display":"block"};
						$scope.placeInfo3 = res.data[p].city[s].area;
						$scope.city = res.data[p].city[s].name;
						myPlace.city = $scope.city;
						$scope.qu = function(index){
							//console.log(index);
							var q = index;
							
							$scope.area = res.data[p].city[s].area[q];
							myPlace.area = $scope.area;
							sessionStorage.setItem("MYPLACE",JSON.stringify(myPlace));
							$state.go("register1");
						}
				}
				};
				
			});
			
		}])
});