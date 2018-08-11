
		app.controller("exam_searchCtlr",["$scope","$state",function($scope,$state){
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			
			
			$scope.historyArr=["水笔","KR170107000002","复印纸","计算器","KR170107000003","钢笔","键盘","鼠标垫","办公本子","报事贴","电脑清洁用品"];
			$scope.order_para = function($event){
				console.log($($event.target).html());
				var obj = {};
				obj.search = $($event.target).html();
				var OBJ = JSON.stringify(obj);
				sessionStorage.setItem("orderKey",OBJ);
				$state.go("exam_center");
			}
			$scope.clear_history_search = function(){
				$scope.historyArr=[];
			}
			
			if($scope.historyArr.length>0){
				$(".history_search").css("display","block");
				$(".clear_search").css("display","block");
			}
			
			/*--点击搜索--*/
			$scope.sou = function(){
				$scope.sou_value = $(".search_it").val();
				console.log($scope.sou_value.length);
				if($scope.sou_value.length>=1){
					var obj = {};
					obj.search = $scope.sou_value;
					var OBJ = JSON.stringify(obj);
					sessionStorage.setItem("searchKey",OBJ);
					$state.go("exam_center");
				}
			}
			
			
		
		}])
