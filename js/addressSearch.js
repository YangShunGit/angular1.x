
	app.controller("addressSearchCtlr",["$scope","$state","$timeout","SearchDataService","SearchService", function($scope,$state,$timeout,SearchDataService,SearchService){
		
		var datatype = "0";
		if(datatype == "0"){
			$scope.yn = true;
		}else{
			$scope.yn = false;
		}
		
		SearchDataService.listData(mySearchData).then(function(res){
			console.log(res);
			$scope.hot = res.data.resources[0].hot;
			$scope.history = res.data.resources[0].history;
		})
		
		$scope.cancel = function(){
			window.history.go(-1);
		}
		
		$scope.search_data = function($event){
			SearchKey = $($event.target).html();
			sessionStorage.setItem("categoryid","");
			sessionStorage.setItem("categoryno","");
			$state.go("shop_list");
		}
		
		$scope.sou = function(){
			SearchKey = $(".search_it").val();
			sessionStorage.setItem("categoryid","");
			sessionStorage.setItem("categoryno","");
			$state.go("shop_list");
		}
		
		if($scope.history==[]){
			h_hide();
		}
		$scope.history_clear = function(){
			$scope.history = [];
			h_hide();
		}
		
		$(".clear_input").click(function(){
			$(".search_it").val("");
			$(".search_it").focus();
		})
		
		/*--隐藏历史搜索--*/
		function h_hide(){
			$(".history_search").css("display","none");
			$(".clear_search").css("display","none");
		}
		
		
	}])
