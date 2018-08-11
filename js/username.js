app.controller("usernameCtlr", ["$scope", "$state", "UpuserService", function($scope, $state, UpuserService) {
	/*返回上一步*/
	$scope.cancel = function() {
		window.history.go(-1);
	}

	console.log(UserInfo);

	//$scope.name_info=JSON.parse(sessionStorage.getItem("person_info"));
	$scope.username = UserInfo.usernick;

	$(".x_username").on("keyup", function() {
		var userVal = $(".x_username").val();
		//console.log(userVal,$.trim(userVal));
		if($.trim(userVal).length > 0) {
			$(".r_username .next").css("background", "rgb(245, 47, 44)");
		} else {
			$(".r_username .next").css("background", "#cacaca");
		}
	})

	$scope.clear_username = function() {
		$(".x_username").val("");
		$(".x_username").focus();
		$(".r_username .next").css("background", "#cacaca");
	}
	$scope.reviseUsename = function() {
		var name = $(".x_username").val();
		if(name != "") {
			$(".is_load").css("display", "block");
			/*--正则判断是否满足条件--*/
			
			//var name_reg = /^[\u4E00-\u9FA5A-Za-z0-9.*]+$/.test(name);
			var name_reg = /^\S{1,20}$/.test(name);
			//console.log(name_reg,strlen(name));
			if(name_reg) {
				var userData = {
					"act": "1",
					"usernick": name,
					"usermail": "",
					"usertel": "",
					"usermobile": ""
				}
				var myUpuserData = UpuserData(userData.act, userData.usernick, userData.usermail, userData.usertel, userData.usermobile)
				UpuserService.listData(myUpuserData).then(function(res) {
					console.log(res);
					$(".is_load").css("display", "none");
					if(res.data.error == 0) {
						UserInfo.usernick = name;
						window.history.go(-1);
					} else {
						alert(res.data.msg);
					}
				})

			} else {
				$(".is_load").css("display", "none");
				$(".r_username .point").html("请填写正确昵称，1-20个字符");
				$(".r_username .point").css("display", "block");
			}
		}
	}
}])