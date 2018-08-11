
	
	app.controller("upload_licenseCtlr",["$scope","time","$timeout","$state","ApplyvipService", function($scope,time,$timeout,$state,ApplyvipService){
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.back();
		}
		 
		$scope.myClose = function(){
			window.history.go(-2);
		}
		
		//登录页面初始化ApplyVip
		console.log(ApplyVip);
		if(ApplyVip.licenceurl!=""){
			$(".upload .pic1 .pic1Img").css("height","auto");
			$(".uploadAgain").css("display","flex");
			$(".pic1 input").removeAttr("id");
			$(".space3 input").attr("id","businessLicence");
		}
		$(".pic_look1").attr("src",ApplyVip.licenceurl);
	 	if(ApplyVip.validdate!=""){
	 		$(".deadline").css("display","block");
	 		
	 		$("#term").val(ApplyVip.validdate);
	 		$("#f").css({
	 			color: 'rgb(35, 35, 38)',
    			border: '1px solid rgb(203, 203, 203)'
	 		});
	 		$("#nf").css({
	 			border: "1px solid #f52f2c",
    			color: "#f52f2c"
	 		});
	 	}
		function uploadLoaded(){
			uploadScroll=new IScroll(".upload_wrapper",{
				preventDefault:false,
				onBeforeScrollStart:null
			});
		}
		
		var uploadTimer=$timeout(function(){
			uploadLoaded();
			$(".upload")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},200);
		
		var date_flag = true;
		
		$scope.change=function($event){	
			$(".choice").css({
				"color":"#232326",
				"border":"1px solid #cbcbcb"
			});
			$($event.target).css({
			"color":"#f52f2c",
			"border":"1px solid #f52f2c"
			});
			if($($event.target).attr("id")=="nf"){
				$(".deadline").css({
					"display":"block"
				});	
				date_flag = false;
			}else{
				date_flag = true;
				$(".deadline").css({
					"display":"none"
				})
			}
		}
		
		time.picker();
		
		$(".next_button").on("click",function(){
			if(date_flag==true){
				ApplyVip.validdate = "长期";
			}else{
				ApplyVip.validdate = $("#term").val();
			}
			ApplyVip.licenceurl = $(".pic_look1").attr("src");
			ApplyVip.taxurl = $(".pic_look2").attr("src");
			ApplyVip.organizationurl = $(".pic_look3").attr("src");
			if(ApplyVip.licenceurl==""){
				$(".prompt_fail .txt").html("请上传营业执照！");
				$(".prompt_fail").fadeIn(200);
				setTimeout(function() {
					$(".prompt_fail").fadeOut(200);
				}, 1000);
			}else{
				var myLoginData = LoginData(ApplyVip.companyname,ApplyVip.address,ApplyVip.province,ApplyVip.city,ApplyVip.area,ApplyVip.contacts,ApplyVip.phone,ApplyVip.tel,ApplyVip.email,ApplyVip.licenceurl,ApplyVip.validdate)
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
		
		$timeout(function(){
			uploadScroll.refresh();
		},1000);
		
		//点击查看大图
		$(".pic1Img").on("click",function(){
			$(".magnifier-img").attr("src",$(".pic_look1").attr("src"));
			$(".magnifier").css("display","block");
		})
		
		$scope.magCancel = function(){
			$(".magnifier").css("display","none");
		}
		var ro = 0;
		$scope.rotate = function(){
			
			ro = ro + 90;
			$(".pic1Img").css({
				"transition":"all .5s",
				"transform":"rotateZ(+"+ro+"deg)"
			});
			$('.magnifier-img').css({
				"transform":"rotateZ(+"+ro+"deg)"
			});
			
		}
		
		$scope.rotateInit = function(){
			ro = 0;
		}
		
	}])
