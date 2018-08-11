
		app.controller("telCtlr",["$scope","$state","UpuserService",function($scope,$state,UpuserService){
			/*返回上一步*/
		$scope.cancel = function(){
			window.history.go(-1);
		}
			
			$scope.tel = UserInfo.usertel;
			
			/*$(".x_tel").on("keyup", function() {
				var telVal = $(".x_tel").val();
				//console.log(telVal,$.trim(telVal));
				if($.trim(telVal).length > 0) {
					$(".r_tel .next").css("background", "rgb(245, 47, 44)");
				} else {
					$(".r_tel .next").css("background", "#cacaca");
				}
			})*/
			
			$scope.clear_tel = function(){
				$(".x_tel").val("");
				$(".x_tel").focus();
				
			}
			$scope.reviseTel = function() {
				var tel = $(".x_tel").val();
				$(".is_load").css("display","block");
				var tel_reg = /^(010|02\d|0[3-9]\d{2,3})-\d{7,8}$/.test(tel);
				
				if(tel_reg||$.trim(tel).length==0) {
					$(".r_tel .tips").html("");
					var userData = {
					  "act": "3",
					  "usernick": "",
					  "usermail": "",
					  "usertel": tel,
					  "usermobile": ""
					}
					var myUpuserData = UpuserData(userData.act,userData.usernick,userData.usermail,userData.usertel,userData.usermobile)
					UpuserService.listData(myUpuserData).then(function(res){
						console.log(res);
						$(".is_load").css("display","none");
						if(res.data.error == 0){
							UserInfo.usertel = tel;
							window.history.go(-1);
						}else{
							alert(res.data.msg);
						}
					})
				}
				else{
					$(".r_tel .tips").html("请填写正确的固定电话，或选择不填")
					$(".r_tel .tips").css("display","block");
				}
				
			}
		}])
