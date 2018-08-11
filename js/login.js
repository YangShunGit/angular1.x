
	app.controller("loginCtlr",["$scope","$state","$http", function($scope,$state,$http){
		
		//注册初始化；
		ApplyVip = {
			"companyname": "",
			"address": "",
			"province": "",
			"city": "",
			"area": "",
			"contacts": "",
			"phone": "",
			"tel": "",
			"userno": "",
			"email": "",
			"userpwd": "",
			"licenceurl": "",
			"taxurl": "",
			"organizationurl": "",
			"validdate": ""
		}
		sessionStorage.removeItem("all_address");
		var userno = GetQueryString("userno"); 
		var userpwd = GetQueryString("userpwd"); 
		var openid = GetQueryString("openid"); 
		$("#openid").val(openid);
		$(".user").val(userno);
		$(".pwd").val(userpwd);
		//alert(location.href);
		//alert(userno);
		var userval=$(".user").val();
		var pwdval =$(".pwd").val();
		//alert(userval);
		if(userval.length>0&&pwdval.length>0){
			$(".btn_login").css("background","#f52f2c");
			$(".btn_login").css("color","white");
			submit_flag = true;
		}else{
			$(".btn_login").css("background","#eeeeee");
			$(".btn_login").css("color","#cecece;");
			submit_flag = false;
		}
		
		
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		
		var submit_flag = false;
		
		$("input").on("keyup",function(){
			
			userval=$(".user").val();
			pwdval =$(".pwd").val();
			if(userval.length>0&&pwdval.length>0){
				$(".btn_login").css("background","#f52f2c");
				$(".btn_login").css("color","white");
				submit_flag = true;
			}else{
				$(".btn_login").css("background","#eeeeee");
				$(".btn_login").css("color","#cecece;");
				submit_flag = false;
			}
		})
		
		$(".btn_login").on("click",function(){
			if(submit_flag){
				$(".is_load").css("display","block");
				document.getElementById("formid").submit();
			}
		})
		
		$(".forget_password").on("click",function(){
			$state.go("forget_password2");
		})
		
		$scope.qrCode = function(){
			scanCode();
		}
		$(".user").val("");
		
		
		
		
	}])
