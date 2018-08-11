

		app.controller("setCtlr",["$scope","$state", function($scope,$state){
			
			
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			/*返回上一步*/
			$(".hotline").attr("href","tel:"+UserInfo.hotline);
			$(".hotline p").html(UserInfo.hotline);
			var userid = GetQueryString("userid");
			var openid = GetQueryString("openid");
			$("#userid").val(userid);
			$("#openid").val(openid);
			
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			var log_flag = true;
			
		}])
	

	
