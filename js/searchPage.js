app.controller("searchPageCtlr", ["$scope", "$state", "$timeout", "SearchDataService", "SearchService", "ClearsearchService", function($scope, $state, $timeout, SearchDataService, SearchService, ClearsearchService) {
	//==================判断是否是返回键进入搜索页，是则再次返回上一页=========
		
		
		
		
		if(SearchFlag == false){
			if(SearchFlagShopList==true){
				SearchFlagShopList=false;
				
				window.history.go(-2);
			}else{
				
				window.history.go(-1);
			}
		} else {

			var datatype = sessionStorage.getItem("datatype");

			if(datatype == "0") {
				$scope.yn = true;
			} else {
				$scope.yn = false;
			}

			SearchDataService.listData(mySearchData).then(function(res) {
				console.log(res);
				$scope.hot = res.data.resources[0].hot;
				$scope.history = res.data.resources[0].history;
				if($scope.history.length == 0) {
					h_hide();
				}
			})
			$scope.cancel = function() {
				SearchFlag = false;
				window.history.go(-1);
			}

			$scope.change_yn = function() {
				if($scope.yn == true) {
					datatype = 1 ;
					$scope.yn = false;
				} else {
					datatype = 0;
					$scope.yn = true;
				}

			}

			$scope.search_data = function($event) {
				SearchKey = $($event.target).html();
				sessionStorage.setItem("datatype",datatype);
				sessionStorage.setItem("groupid","");
				sessionStorage.setItem("categoryid", "");
				sessionStorage.setItem("categoryno", "");
				//window.history.go(-1);
				ShopHistory = {
					scrollTop:0,
					sortStatus:"",
					by:0,
					brandid:"",
					brandText:"",
					page:1,
					ch:true,
					res:""
				}
				IsSearch = true;
				SearchFlag = false;
				$state.go("shop_list");
			}

			$scope.sou = function() {
				SearchKey = $(".search_it").val();
				if(SearchKey!=""){
					sessionStorage.setItem("datatype",datatype);
					sessionStorage.setItem("groupid","");
					sessionStorage.setItem("categoryid", "");
					sessionStorage.setItem("categoryno", "");
					SearchFlag = false;
					IsSearch = true;
					ShopHistory = {
						scrollTop:0,
						sortStatus:"",
						by:0,
						brandid:"",
						brandText:"",
						page:1,
						ch:true,
						res:""
					}
					$state.go("shop_list");
				}
			}
			if($scope.history == []) {
				h_hide();
			}
			$scope.history_clear = function() {
				$(".is_load").css("display", "block");
				ClearsearchService.listData(myIndexData).then(function(res) {
					console.log(res);
					$(".is_load").css("display", "none");
					if(res.data.error == 0) {
						$scope.history = [];
						h_hide();
					} else {
						alert(res.data.msg);
					}
				})
			}

			$(".clear_input").click(function() {
				$(".search_it").val("");
				$(".search_it").focus();
			})

			/*--隐藏历史搜索--*/
			function h_hide() {
				$(".history_search").css("display", "none");
				$(".clear_search").css("display", "none");
			}

		}
	
}])