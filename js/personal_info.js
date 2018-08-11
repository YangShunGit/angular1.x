
		app.controller("personal_infoCtlr",["$scope","UpuserService","$state",function($scope,UpuserService,$state){
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			$scope.userInfo = UserInfo;
			
			$scope.change_username = function(){
				
				$state.go("username");
			}
			$scope.change_email = function(){
				
				$state.go("email");
			}
			$scope.change_tel = function(){
				
				$state.go("tel");
			}
			$scope.change_phone = function(){
				
				$state.go("phone");
			}
		
			
			
		}])
