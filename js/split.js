
		app.controller("splitCtlr",["$scope","$timeout","PackageService",function($scope,$timeout,PackageService){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		var mySplitData = JSON.parse(sessionStorage.getItem("mySplitData"));
		var istogether = sessionStorage.getItem("togetherid");
			if(istogether == "1"){
				mySplitData.togetherid = "1";
				$(".split_shops2").css("display","none");
				$(".split_shops1").css("display","block");
			}else{
				$(".split_shops1").css("display","none");
				$(".split_shops2").css("display","block");
			}
			
		var myPackageData = PackageData(mySplitData.togetherid,mySplitData.shipdate);
		console.log(myPackageData);
		
		PackageService.listData(myPackageData).then(function(res){
			console.log(res);
			
			$scope.packages = res.data.resources[0].package;
			$scope.together = res.data.resources[0].together;
			
		})
	
		
		
		
		$scope.merge_list=true;
		$scope.split_list=false;
		var splitScroll;
		function splitLoaded(){
			splitScroll = new IScroll(".split_wrapper",{
				preventDefault:false
			});
		}
		
		var splitTimer = $timeout(function(){
			splitLoaded();
			$(".split")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},500);
			
		$scope.splitList = function($event){
			$scope.togetherid = $($event.target).attr("togetherid");
			if($scope.togetherid == "1"){
				$(".split_shops2").css("display","none");
				$(".split_shops1").css("display","block");
			}else{
				$(".split_shops1").css("display","none");
				$(".split_shops2").css("display","block");
			}
				myPackageData = PackageData($scope.togetherid,mySplitData.shipdate);
				PackageService.listData(myPackageData).then(function(res){
					console.log(res);
					$scope.together = res.data.resources[0].together;
					
					$scope.packages = res.data.resources[0].package;
					
					$timeout(function(){
						splitScroll.refresh();
					},100)	
				
				})	
		};
		
		/*点击确定*/
		$(".pay_foot_box").on("click",function(){
			sessionStorage.setItem("togetherid",$scope.togetherid);
			window.history.go(-1);
		})
		
			
		}])
