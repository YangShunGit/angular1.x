
		app.controller("new_emailCtlr",["$scope","$state","UpuserService",function($scope,$state,UpuserService){
			
			/*返回上一步*/
			$scope.cancel = function(){
				window.history.go(-1);
			}
			
			window.addEventListener("popstate", function(){
			    clearInterval(time);
			}, false);
			
			//按钮可点击与不可点击参数
			var myValue = false;
			//按钮变色
			$(".codeInput").on("keyup",function(){
				var codeVal = $(".codeInput").val();
				console.log(codeVal,$.trim(codeVal));
				if($.trim(codeVal).length>0){
					$(".r_email .next").css("background","rgb(245, 47, 44)");
					myValue = true;
				}else{
					$(".r_email .next").css("background","#cacaca");
					myValue = false;
				}
			})
			
			
			$scope.clear_email = function(){
				$(".x_email").val("");
				$(".x_email").focus();
			}
			/*$scope.email_sub = function(){
				$(".is_load").css("display","block");
				var email = $(".x_email").val();
				var email_reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
				if(email == ""){
					$(".is_load").css("display","none");
					$(".r_email .point").html("邮箱不能为空，请输入正确的邮箱！");
				}else if(email_reg){
					$(".r_email .point").html("邮箱正确！");
					//$scope.email_info.email=email;
					var userData = {
					  "act": "2",
					  "usernick": "",
					  "usermail": email,
					  "usertel": "",
					  "usermobile": ""
					}
					var myUpuserData = UpuserData(userData.act,userData.usernick,userData.usermail,userData.usertel,userData.usermobile)
					UpuserService.listData(myUpuserData).then(function(res){
						console.log(res);
						$(".is_load").css("display","none");
						if(res.data.error == 0){
							UserInfo.usermail = email;
							window.history.go(-1);
						}else{
							alert(res.data.msg);
						}
					})
				}else{
					$(".r_email .point").html("请输入正确的邮箱！");
				}
				
			}*/
			//获取验证码
			var canGet = true;
			var count = 60;
			var time;
			$scope.getCode = function(){
				if(canGet){
					canGet = false;
					$(".getCode").html(""+count+"s后重新获取");
					$(".getCode").attr("id","code-active");
					time = setInterval(delFn,1000);
				}
			}
			function delFn(){
				if(count<=0){
					$(".getCode").html("获取验证码");
					$(".getCode").removeAttr("id");
					canGet = true;
					count = 60;
					clearInterval(time);
				}else{
					count--;
					$(".getCode").html(""+count+"s后重新获取");
				}
			}
			//点击下一步
			$scope.confirmEmail = function(){
				clearInterval(time);
			}
			
			
		}])
