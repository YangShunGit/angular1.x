
		app.controller("phoneCtlr", ["$scope", "$state","UpuserService", function($scope, $state,UpuserService) {
			/*返回上一步*/
			$scope.cancel = function() {
				window.history.go(-1);
			}
			
			window.addEventListener("popstate", function(){
			    clearInterval(time);
			}, false);
			
			$scope.phone =  UserInfo.usermobile;
			
			//按钮可点击与不可点击参数
			var myValue = false;
			//按钮变色
			$(".codeInput").on("keyup",function(){
				var codeVal = $(".codeInput").val();
				console.log(codeVal,$.trim(codeVal));
				if($.trim(codeVal).length>0){
					$(".r_phone .next").css("background","rgb(245, 47, 44)");
					myValue = true;
				}else{
					$(".r_phone .next").css("background","#cacaca");
					myValue = false;
				}
			})
			
			/*$scope.clear_phone = function() {
				$(".x_phone").val("");
				$(".x_phone").focus();
			}
			$scope.phone_sub = function() {
				$(".is_load").css("display","block");
				var phone = $(".x_phone").val();
				var phone_reg = /^(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9])[0-9]{8}$/.test(phone);
				if(phone == "") {
					$(".is_load").css("display","none");
					$(".r_phone .tips").html("手机号不能为空");
				} else if(phone_reg) {
					$(".r_phone .tips").html("手机号正确");
					var userData = {
					  "act": "4",
					  "usernick": "",
					  "usermail": "",
					  "usertel": "",
					  "usermobile": phone
					}
					var myUpuserData = UpuserData(userData.act,userData.usernick,userData.usermail,userData.usertel,userData.usermobile)
					UpuserService.listData(myUpuserData).then(function(res){
						console.log(res);
						$(".is_load").css("display","none");
						if(res.data.error == 0){
							UserInfo.usermobile = phone;
							window.history.go(-1);
						}else{
							alert(res.data.msg);
						}
					})
				} else {
					$(".r_phone.tips").html("请输入11位的手机号码")
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
			$scope.newPhone = function(){
				clearInterval(time);
				$state.go("new_phone");
			}
			
		}])
