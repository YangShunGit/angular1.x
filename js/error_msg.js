
		app.controller("error_msgCtlr",["$scope","$state",function($scope,$state){
			
			var msg = GetQueryString("msg");
			
			$(".error_massage").html(msg);
			$(".error_msg_cancel").on("click",function(){
				$state.go("login");
			})
		}])
