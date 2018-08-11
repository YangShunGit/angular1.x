
		app.controller("purchase_wordsCtlr",["$scope","$state","$timeout","AreaService","SendmsgService",function($scope,$state,$timeout,AreaService,SendmsgService){
		
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			$("textarea").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			$(".place .sel_title").html("选择省");
			
			$scope.receiverstatename = "";
			$scope.receiverstate = "";
			$scope.a = ""; //文本框字数初始化
			$scope.is_over = function(){
				console.log($scope.a.length);
				if($scope.a.length>=1000){
					$(".count").css("color","red");
				}
			}
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			
			$scope.d = false;
			$scope.change_nav = function(){
				$scope.d =!$scope.d;
			}
			$scope.searchFlag = function(){
				SearchFlag = true;
			}
			
			var purchaseScroll,placeScroll;;
			function purchaseLoaded(){
				purchaseScroll=new IScroll(".words_wrapper",{
					preventDefault:false
				});
				placeScroll=new IScroll(".place_wrapper",{
					preventDefault:false
				});
			}
			var purchaseTimer=$timeout(function(){
				purchaseLoaded();
				$(".words")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);	
			
			var myPlace = AreaData(1);
			AreaService.listData(myPlace).then(function(res){
				console.log(res);
				$scope.placeInfo = res.data.resources[0].areas;
			});
			
			
			$scope.clear_name = function(){
				$(".x_name").val("");
				$(".x_name").focus();
			}
			$scope.clear_phone = function(){
				$(".x_phone").val("");
				$(".x_phone").focus();
			}
			$scope.clear_company = function(){
				$(".x_company").val("");
				$(".x_company").focus();
			}
			$scope.clear_code = function(){
				$(".two_code").val("");
				$(".two_code").focus();
			}
			
			
			$scope.sel_place = function(){
				$("textarea").blur();
				$("input").blur();
				$(".place").css({
					'top':'0'
				});
				$(".place_mask").css({
					'bottom':'0px',
					'transition':'all 300ms'
				});
			}
			
			$scope.cancel_place = function(){
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
			}
			//点击蒙版地址选择消失
			$(".words").on("click",".placeCancelMask",function(){
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
			})
			
			$scope.place = function($event){
				$scope.receiverstatename = $($event.target).attr("areaname");
				$scope.receiverstate = $($event.target).attr("areaid");
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
			}
			
			$("li").click(function(){
				$(this).find("input").on("focus",function(){});
			})
			
			$(".submit").on("click",function(){
				var person = $(".x_name").val();
				var phone = $(".x_phone").val();
				var customername = $(".x_company").val();
				var areaid = $scope.receiverstate;
				var message = $scope.a;
				if(person==""){
					$(".prompt_fail .txt").html("联系人不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
						
					}, 1000);
				}else if(phone==""){
					$(".prompt_fail .txt").html("联系电话不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
						
					}, 1000);
				}else if(customername==""){
					$(".prompt_fail .txt").html("公司名称不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
						
					}, 1000);
				}else if(areaid==""){
					$(".prompt_fail .txt").html("省份地址不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				}else if(message==""){
					$(".prompt_fail .txt").html("采购需求不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
						
					}, 1000);
				}else{
					var mySendmsgData = SendmsgData(person, phone,customername,areaid,message);
					SendmsgService.listData(mySendmsgData).then(function(res){
						console.log(res);
						if(res.data.error==0){
							$(".prompt_success .txt").html("采购留言成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
								$state.go("mine");
							}, 1000);
						}else{
							alert(res.data.msg);
						}
					})
				}
			})
			
		}])
