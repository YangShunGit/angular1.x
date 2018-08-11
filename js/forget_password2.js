
	app.controller("forget_password2Ctlr",["$scope","$state","FindpwdService",function($scope,$state,FindpwdService){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		var userno,email;
		
		var button_flag = false;
		$("input").on("keyup",function(){
			userno = $(".user_input").val();
			email = $(".email_input").val();
			if(userno.length>0&&email.length>0){
				$(".next_button").css({
					'background':'rgb(245, 47, 44)'
				});
				button_flag = true;
			}else{
				$(".next_button").css({
					'background':'#cacaca'
				});
				button_flag = false;
			}
		})
		
		$(".next_button").on("click",function(){
			if(button_flag){
				button_flag = false;
				$(".is_load").css("display","block");
				var myFindpwdData = FindpwdData(userno,email);
				console.log(myFindpwdData);
				FindpwdService.listData(myFindpwdData).then(function(res){
					console.log(res);
					$(".is_load").css("display","none");
					if(res.data.error==0){
						$(".prompt_success .txt").html(res.data.msg);
						$(".prompt_success").fadeIn(200);
						setTimeout(function(){
							button_flag = true;
							$(".prompt_success").fadeOut(200);
							$state.go("login");
						},3000);
					}else{
						$(".prompt_fail .txt").html(res.data.msg);
						$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
								button_flag = true;
						},1000);
					}
				})
			}
		})
		
		$(".empty_userno").on("click",function(){
			$(".user_input").val("");
			$(".next_button").css({
				'background':'#cacaca'
			});
			button_flag = false;
		});
		$(".empty_email").on("click",function(){
			$(".email_input").val("");
			$(".next_button").css({
				'background':'#cacaca'
			});
			button_flag = false;
		})
	}])
