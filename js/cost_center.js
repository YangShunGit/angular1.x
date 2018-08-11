
		app.controller("cost_centerCtlr", ["$scope","$timeout", function($scope,$timeout) {
			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}
			$scope.cost_data=["采购部","销售部3","销售部2","销售部1","上海田子坊","南京田子坊"];
			$scope.cost_sel = JSON.parse(sessionStorage.getItem("person"));
			
				if($scope.cost_sel==null){
					$scope.cost_sel={"cost_sel":""}
				}else{$timeout(function(){
					index=$scope.cost_sel.cost_index;
					$(".sel_list li").children(".sel_draw").css({"display":"none"});
					$(".sel_list li").eq(index).children(".sel_draw").css("display","block");
/*				    console.log("/////",index);
				    console.log($(".sel_list li"));		*/		
				},10)};
			
			/*定义index*/
			var index = $scope.cost_sel.cost_index;
			
		}])
