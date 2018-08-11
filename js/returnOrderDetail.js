app.controller("returnOrderDetailCtlr", ["$scope", "$timeout", "AddCartService", function($scope, $timeout, AddCartService) {
	var returnOrderDetailScroll;

	function returnOrderDetailLoaded() {
		returnOrderDetailScroll = new IScroll(".bwrapper", {
			preventDefault: false
		});
	}

	var returnOrderDetailTimer = $timeout(function() {
		returnOrderDetailLoaded();
		$(".page")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
	}, 200);

	/*返回上一步*/
	$scope.myBack = function() {
		window.history.go(-1);
	}

	/*--youshangjiao--*/
	$scope.d = false;
	$scope.change_nav = function() {
		$scope.d = !$scope.d;
	}
	$scope.searchFlag = function() {
		SearchFlag = true;
	}

	//获取数据
	$scope.returnDetail = ReturnDetail;
	if($scope.returnDetail.bpms.length==0){
		$(".roProgress_b").css("display","none");
	}
	console.log(ReturnDetail);

	$scope.add = function($event) {
		var eid = $($event.target).attr("eid");
		var itemid = $($event.target).attr("itemid");
		var orderqty = $($event.target).attr("orderqty");
		var price = $($event.target).attr("price");
		var act = "add";
		var cartid = "";
		var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
		console.log(myAddCartData);
		AddCartService.listData(myAddCartData).then(function(res) {
			
			console.log("111", res);
			if(res.data.error==0){
				/*加入购物车成功提示框*/
				$(".prompt_success .txt").html("加入购物车成功");
				$(".prompt_success").fadeIn(200);
				setTimeout(function() {
					$(".prompt_success").fadeOut(200);
				}, 1000);
			}else{
				alert(res.data.msg);
			}
			
		})

	};

}])