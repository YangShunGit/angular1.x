
		app.controller("mineCtlr",["$scope","$timeout","UserService",function($scope,$timeout,UserService){
			if(ka){
				$(".tab_table1").css("display","none");
				$(".tab_table2").css("display","flex");
			}else{
				$(".tab_table2").css("display","none");
				$(".tab_table1").css("display","flex");
			};
			
			//获取个人信息
			UserService.listData(myIndexData).then(function(res) {
				console.log(res);
				UserInfo = res.data.resources[0];
				$scope.userInfo = UserInfo;
			});
			
			
			//清除我的订单页面页数和位置参数
			MyOrderPage = 1;
			MyOrderScrollTop = 0;
			All_orders = [];
			Groupid = "";
			Favoritgroup = [];
			State_index = 0;
			
			//清除我的订单状态筛选参数
			sessionStorage.removeItem("sdstate");
			//清除审批中心状态判断参数
			sessionStorage.removeItem("examStatus");
			//清除退换货状态判断参数
			sessionStorage.removeItem("returnStatus");
			
			//清除审批中心勾选缓存
			SectionArr = [];
			EmArr = [];
			
			
			
			if(UserInfo.userno==null){
				$(".no_name").css("display","block");
				$(".username").css("display","none");
			}else{
				$(".no_name").css("display","none");
				$(".username").css("display","block");
			}
			$scope.userInfo = UserInfo;
			
			
			var mineScroll;
			function mineLoaded(){
				mineScroll=new IScroll(".mine_wrapper",{
					preventDefault:false,
					onBeforeScrollStart:null,
					bounce:true
				});
			}
			var mineTimer=$timeout(function(){
				mineLoaded();
				$(".mine")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);
		}])
