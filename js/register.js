
	app.controller("registerCtlr",["$scope","$timeout","$state","ApplyvipService", function($scope,$timeout,$state,ApplyvipService){
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.back();
		}
		$scope.myClose = function(){
			window.history.go(-3);
		}
		
		var registerScroll;
		function registerLoaded(){
			registerScroll=new IScroll(".register_wrapper",{
				preventDefault:false,
				onBeforeScrollStart:null
			});
			
		}
		
		var registerTimer=$timeout(function(){
			registerLoaded();
			$(".register")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},200);
		
		$(".empty").on("click",function(){
			$(this).siblings("input").val("");
		});
		
		
		
		var userno,email,userpwd;
		
	
		$(".next_button").on("click",function(){
			var userno = $(".user_input").val();
			var email = $(".email_input").val();
			var userpwd = $(".set_input").val();
			var ruserpwd = $(".confirm_input").val();
			if(userno == ""){
				$(".tips").html("请输入用户名");
				$(".tips").fadeIn(200);
				setTimeout(function() {
					$(".tips").fadeOut(200);
				}, 1000);
			}else if(email==""){
				$(".tips").html("请输入邮箱");
				$(".tips").fadeIn(200);
				setTimeout(function() {
					$(".tips").fadeOut(200);
				}, 1000);
			}else if(userpwd==""){
				$(".tips").html("请设置密码");
				$(".tips").fadeIn(200);
				setTimeout(function() {
					$(".tips").fadeOut(200);
				}, 1000);
			}else if(ruserpwd==""){
				$(".tips").html("请确认密码");
				$(".tips").fadeIn(200);
				setTimeout(function() {
					$(".tips").fadeOut(200);
				}, 1000);
			}else if(userpwd != ruserpwd){
				$(".tips").html("两次密码不一致");
				$(".tips").fadeIn(200);
				setTimeout(function() {
					$(".tips").fadeOut(200);
				}, 1000);
			}else{
				ApplyVip.userno = userno;
				ApplyVip.email = email;
				ApplyVip.userpwd = userpwd;
				var myLoginData = LoginData(ApplyVip.companyname,ApplyVip.address,ApplyVip.province,ApplyVip.city,ApplyVip.area,ApplyVip.contacts,ApplyVip.phone,ApplyVip.tel,ApplyVip.userno,ApplyVip.email,ApplyVip.userpwd,ApplyVip.licenceurl,ApplyVip.taxurl,ApplyVip.organizationurl,ApplyVip.validdate)
				ApplyvipService.listData(myLoginData).then(function(res){
					console.log(res);
					
					if(res.data.error==0){
						$(".prompt_success .txt").html(res.data.msg);
						$(".prompt_success").fadeIn(200);
						setTimeout(function(){
							$(".prompt_success").fadeOut(200);
							$state.go("login");
						},3000);
					}else{
						$(".prompt_success .txt").html(res.data.msg);
						$(".prompt_success").fadeIn(200);
						setTimeout(function(){
							$(".prompt_success").fadeOut(200);
							
						},2000);
					}
					
				})
			}
		})
		
		
	}])
