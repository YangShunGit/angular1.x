app.controller("cartCtlr", ["$scope", "$timeout", "$state", "CartDataService", "CartEditService", "AddCartService", "CollectService", "SettlementService", "CartMescroll", function($scope, $timeout, $state, CartDataService, CartEditService, AddCartService, CollectService, SettlementService, CartMescroll) {

	$("input").attr("onKeypress", "javascript:if(event.keyCode == 32)event.returnValue = false;");
	$("input").attr("onkeyup", "this.value=this.value.replace(/(^ +| +$)/g,'')");

	if(ka) {
		$(".tab_table1").css("display", "none");
		$(".tab_table2").css("display", "flex");
	} else {
		$(".tab_table2").css("display", "none");
		$(".tab_table1").css("display", "flex");
	};

	$scope.totalfee = [{
		price: ''
	}];

	function judgeMaxQtytotal(qty) {
		if(parseInt(qty) > 9999) {
			return "9999+";
		} else {
			return qty;
		}
	}

	var meScroll;
	var cartTimer = $timeout(function() {
		cartLoaded();
		$(".cart_body")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
	}, 200);
	//下拉刷新
	CartMescroll.mescroll(function(res,mescroll) {
		meScroll = mescroll;
		$scope.allselected = res.data.resources[0].allselected;
		if($scope.allselected == "1") {
			$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_sel");
		} else {
			$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_nor");
		}
		$scope.qtytotal = judgeMaxQtytotal(res.data.resources[0].qtytotal);
		$scope.jsqty = judgeMaxQtytotal(res.data.resources[0].jsqty);
		//$scope.qtytotal = res.data.resources[0].qtytotal;
		console.log($scope.itemtotal);
		$scope.goodsSession = res.data.resources[0].items;
		$scope.totalfee[0].price = res.data.resources[0].totalfee;
		$scope.totalfee = priceSplit($scope.totalfee);
		if($scope.goodsSession.length == 0) {
			//删除至购物车为空时效果
			$(".empty").css({
				"display": "block"
			});
			$(".cart_foot").css({
				"display": "none"
			});
			$(".cart_edit").css({
				"display": "none"
			});
		} else {
			$(".empty").css({
				"display": "none"
			});
			$(".cart_foot").css({
				"display": "block"
			});
			$(".cart_edit").css({
				"display": "block"
			});
			$scope.goods = priceSplit($scope.goodsSession);

		}
		$timeout(function() {
			cartScroll.refresh();
		}, 200);
	})

	//初始页面获取数据
	CartDataService.listData(myCartData).then(function(res) {
		console.log(res);
		$scope.allselected = res.data.resources[0].allselected;
		if($scope.allselected == "1") {
			$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_sel");
		} else {
			$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_nor");
		}
		$scope.qtytotal = judgeMaxQtytotal(res.data.resources[0].qtytotal);
		$scope.jsqty = judgeMaxQtytotal(res.data.resources[0].jsqty);
		//$scope.qtytotal = res.data.resources[0].qtytotal;

		//console.log($scope.itemtotal);
		$scope.goodsSession = res.data.resources[0].items;
		$scope.totalfee[0].price = res.data.resources[0].totalfee;
		$scope.totalfee = priceSplit($scope.totalfee);
		if($scope.goodsSession.length == 0) {
			/*删除至购物车为空时效果*/
			$(".empty").css({
				"display": "block"
			});
			$(".cart_foot").css({
				"display": "none"
			});
			$(".cart_edit").css({
				"display": "none"
			});
		} else {
			$(".empty").css({
				"display": "none"
			});
			$(".cart_foot").css({
				"display": "block"
			});
			$(".cart_edit").css({
				"display": "block"
			});
			$scope.goods = priceSplit($scope.goodsSession);
		}
	})

	$scope.f = true;
	/*--编辑状态与完成状态参数--*/
	$scope.foot = true;
	$scope.get_obj = JSON.parse(sessionStorage.getItem("cart_shop"));

	/*--惯性滑动iscroll--*/
	var cartScroll;

	function cartLoaded() {
		var refresh_flag = false;
		var y, touchend_falg = false,
			start_y;
		cartScroll = new IScroll(".cart_wrapper", {
			preventDefault: false,
			probeType: 3,
			bounce: false

		});
		
		cartScroll.on("scrollEnd", function() {
			if(cartScroll.y==0&&$scope.foot==true){
				console.log("解锁");
				meScroll.lockDownScroll(false);
			}else{
				console.log("锁");
				meScroll.lockDownScroll(true);
			}
		})
		
		$(".cart_box")[0].addEventListener("touchend", function() {
			if(cartScroll.y==0){
				console.log("解锁");
				meScroll.lockDownScroll(false);
			}else{
				console.log("锁");
				meScroll.lockDownScroll(true);
			}
				

			
		}, false);

}




$scope.do_count = 1;

/*--数据传递函数--*/
$scope.getData = function($event) {
	var shopData = {};
	shopData.itemid = $($event.target).attr("itemid");
	shopData.eid = $($event.target).attr("eid");
	shopData.colorid = $($event.target).attr("colorid");
	shopData.sizeid = $($event.target).attr("sizeid");

	shopData = JSON.stringify(shopData);
	sessionStorage.setItem("detail_data", shopData);
	$state.go("detail_page");
}

/*--编辑状态下判断是否全部选中--*/
function is_all_edit() {
	var flag = true;
	for(var i = 0; i < $scope.goods.length; i++) {
		if($scope.goods[i].goods_edit == false) {
			flag = false;
			return false;
		}
	}
	if(flag) {
		return true;
	}
}

function is_all_edit_change() {
	if(is_all_edit() == false) {
		$(".all_sel").css({
			"background-position": "-442px -289px"
		});
	} else {
		$(".all_sel").css({
			"background-position": "-260px -83px"
		});
	}
}

/*--获取到数据都，进行数据处理--*/
function reduceData(res) {
	$scope.allselected = res.data.resources[0].allselected;
	if($scope.allselected == "1") {
		$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_sel");
	} else {
		$(".cart_foot>.cart_foot_box1>.foot_left1>div").attr("class", "all_nor");
	}
	$(".is_load").css("display", "none");
	$scope.qtytotal = judgeMaxQtytotal(res.data.resources[0].qtytotal);
	$scope.jsqty = judgeMaxQtytotal(res.data.resources[0].jsqty);
	//$scope.qtytotal = res.data.resources[0].qtytotal;
	$scope.goodsSession = res.data.resources[0].items;
	$scope.totalfee[0].price = res.data.resources[0].totalfee;
	$scope.totalfee = priceSplit($scope.totalfee);
	if($scope.goodsSession == 0) {
		/*删除至购物车为空时效果*/
		$(".empty").css({
			"display": "block"
		});
		$(".cart_foot").css({
			"display": "none"
		});
		$(".cart_edit").css({
			"display": "none"
		});

	} else {
		$(".empty").css({
			"display": "none"
		});
		$(".cart_foot").css({
			"display": "block"
		});
		$(".cart_edit").css({
			"display": "block"
		});
	}
	$scope.goods = priceSplit($scope.goodsSession);
	$timeout(function() {
		cartScroll.refresh();
	}, 200);
	$timeout(function() {
		cartScroll.refresh();
	}, 1000);
	$timeout(function() {
		cartScroll.refresh();
	}, 5000);
	$timeout(function() {
		cartScroll.refresh();
	}, 10000);

}

/*--单个勾选--*/
$scope.change_sel = function($event) {
	$(".is_load").css("display", "block");
	var that_selected = $($event.target).attr("data-selected");

	var cartid = $($event.target).attr("cartid");
	var isselect;
	if(that_selected == "1") {
		isselect = "0";
	} else {
		isselect = "1";
	}

	var myCartEditData = CartEditData(cartid, isselect);
	CartEditService.listData(myCartEditData).then(function(res) {
		console.log(res);
		reduceData(res);
	})
}

/*--全选--*/
$scope.all_sel = function($event) {
	$(".is_load").css("display", "block");
	var all_cartid = [];
	$.each($scope.goods, function(index, obj) {
		all_cartid.push(obj.cartid);
	});
	all_cartid = all_cartid.toString();
	console.log(all_cartid);
	var isselect;
	if($scope.allselected == "1") {
		isselect = "0";
	} else {
		isselect = "1";
	}
	//console.log(that_selected,isselect);
	var myCartEditData = CartEditData(all_cartid, isselect);
	CartEditService.listData(myCartEditData).then(function(res) {
		console.log(res);
		reduceData(res);
	})

}

$scope.goods_count = 1;
/*--增减数量--*/
$scope.del = function($event) {
	var val = $($event.target).parent().siblings(".count_input").children("input").val();
	console.log("val", val);
	if(val != 1) {
		$(".is_load").css("display", "block");
		var eid = $($event.target).attr("eid");
		var itemid = $($event.target).attr("itemid");
		var orderqty = -1;
		var price = $($event.target).attr("price");
		var act = "up";
		var cartid = $($event.target).attr("cartid");
		var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
		AddCartService.listData(myAddCartData).then(function(res) {
			console.log(res);
			reduceData(res);
		})
	}

};
$scope.add = function($event) {
	if($($event.target).css("color") != "rgb(191, 191, 191)") {
		var val = $($event.target).parent().siblings(".count_input").children("input").val();
		if(val == 9999) {
			$(".prompt_fail .txt").html("单件商品不能超过9999件哦！");
			$(".prompt_fail").fadeIn(200);
			setTimeout(function() {
				$(".prompt_fail").fadeOut(200);
			}, 1000);
			$($event.target).css("color", "#bfbfbf");
		} else {
			$(".is_load").css("display", "block");
			var eid = $($event.target).attr("eid");
			var itemid = $($event.target).attr("itemid");
			var orderqty = 1;
			var price = $($event.target).attr("price");
			var act = "up";
			var cartid = $($event.target).attr("cartid");
			var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
			AddCartService.listData(myAddCartData).then(function(res) {
				console.log(res);
				reduceData(res);
			})
		}
	}
};

var oldValue;
$(".cart_list_ul").on("click", ".count_input input", function() {
	oldValue = $(this).val();
});
/*--点击count--*/
$(".cart_list_ul").on("keyup", ".count_input input", function() {

	var myValue = $(this).val();
	if(myValue != "") {
		var reg = /^[1-9]\d*$/.test(myValue);
		console.log(myValue, reg);
		if(reg) {
			if(parseInt(myValue) < 1) {
				$(this).val(oldValue);
				$(".prompt_fail .txt").html("单件商品不能少于1件");
				$(".prompt_fail").fadeIn(200);
				$timeout(function() {
					$(".prompt_fail").fadeOut(200);
				}, 1000);
			} else if(parseInt(myValue) > 9999) {
				$(this).val(oldValue);
				$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
				$(".prompt_fail").fadeIn(200);
				setTimeout(function() {
					$(".prompt_fail").fadeOut(200);
				}, 1000);
			}
		} else {
			$(this).val(oldValue);
		}
	}
});
$(".cart_list_ul").on("blur", ".count_input input", function() {
	var myValue = $(this).val();
	if(myValue == "") {
		$(this).val(oldValue);
		$(".prompt_fail .txt").html("单件商品不能少于1件");
		$(".prompt_fail").fadeIn(200);
		$timeout(function() {
			$(".prompt_fail").fadeOut(200);
		}, 1000);
	} else {
		var orderqty = parseInt(myValue) - parseInt(oldValue);
		console.log(orderqty);
		var eid = $(this).attr("eid");
		var itemid = $(this).attr("itemid");
		var price = $(this).attr("price");
		var act = "up";
		var cartid = $(this).attr("cartid");
		var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
		AddCartService.listData(myAddCartData).then(function(res) {
			console.log(res);
			reduceData(res);
		})
	}
});




/*--编辑删除--*/
$scope.edit = function() {
	if($scope.foot == true) {
		/*--编辑--*/
		meScroll.lockDownScroll(true);
		$scope.foot = false;
	} else {
		/*--完成--*/
		meScroll.lockDownScroll(false);
		$("section").attr("class", "edit_nor");
		$scope.foot = true;
	}
};

/*--编辑状态下的勾选--*/
$scope.change_edit = function($event) {
	if($($event.target).attr("class") == "edit_nor") {
		$($event.target).attr("class", "edit_sel");
	} else {
		$($event.target).attr("class", "edit_nor");
	}
	var all_section = $(".list_li section");
	var all_sel_flag = true;
	$.each(all_section, function(index, obj) {
		if($(obj).attr("class") == "edit_nor") {
			all_sel_flag = false;
		}
	})
	if(all_sel_flag == true) {
		$(".foot_left1 p").attr("class", "all_edit_sel");
	} else {
		$(".foot_left1 p").attr("class", "all_edit_nor");
	}
}
$scope.all_edit_sel = function($event) {
	if($($event.target).attr("class") == "all_edit_nor") {
		$(".list_li section").attr("class", "edit_sel");
		$(".foot_left1 p").attr("class", "all_edit_sel");
	} else {
		$(".list_li section").attr("class", "edit_nor");
		$(".foot_left1 p").attr("class", "all_edit_nor");
	}
}

/*--删除功能--*/
$scope.cut = function() {
	var cartid = [];
	var edit_sel = $(".list_li section.edit_sel");
	$.each(edit_sel, function(index, obj) {
		cartid.push($(obj).attr("cartid"));
	});
	cartid = cartid.toString();

	if(cartid.length <= 0) {
		$(".prompt_fail .txt").html("请选择商品");
		$(".prompt_fail").fadeIn(200);
		setTimeout(function() {
			$(".prompt_fail").fadeOut(200);
		}, 1000);
	} else {
		$(".cart_confirm .txt").html("确认要删除这" + edit_sel.length + "种商品吗？");
		$(".cart_confirm").css("display", "block");
		$(".cart_confirm").on("click", ".yes", function() {
			$(".cart_confirm").css("display", "none");
			console.log(cartid);
			$(".is_load").css("display", "block");
			var eid = "";
			var itemid = "";
			var orderqty = "";
			var price = "";
			var act = "del";
			var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
			console.log(myAddCartData);
			AddCartService.listData(myAddCartData).then(function(res) {
				console.log(res);
				reduceData(res);
				$timeout(function() {
					cartScroll.refresh();
				})
			})
		})
	}
	$(".cart_confirm").on("click", ".no", function() {
		$(".cart_confirm").css("display", "none");
	});
};

/*--去结算--*/
//去结算只能点击一次
var balanceFlag = true;
$scope.go_balance = function() {
	if($scope.jsqty != 0 && balanceFlag == true) {
		balanceFlag = false;
		$(".is_load").css("display", "block");
		BuyFlag = false;
		SettlementService.listData(mySettlementData).then(function(res) {
			console.log(res);
			if(res.data.resources[0].receiveaddress.addressid == null) {
				NoAddress = true;
			}
			sessionStorage.setItem("fillOrderRes", JSON.stringify(res));
			$state.go("fill_order");
		})
	}
}

/*--商品查找函数--*/
function shopSearch(shop, shops) {
	var flag = false;
	for(var i = 0; i < shops.length; i++) {
		if(shop.goods_id == shops[i].goods_id) {
			flag = true;
			return true;
		}
	}
	if(flag == false) {
		return false;
	}
}

/*--收藏--*/
$scope.toCollect = function() {

	var cartid = [];
	var edit_sel = $(".list_li section.edit_sel");

	$.each(edit_sel, function(index, obj) {
		cartid.push($(obj).attr("cartid"));
	})
	cartid = cartid.toString();
	if(cartid.length <= 0) {
		$(".prompt_fail .txt").html("请选择商品");
		$(".prompt_fail").fadeIn(200);
		setTimeout(function() {
			$(".prompt_fail").fadeOut(200);
		}, 1000);
	} else {
		$(".is_load").css("display", "block");
		var act = "c2f";
		var eid = "";
		var itemid = "";
		var fids = "";
		var myCollectData = CollectData(act, cartid, eid, itemid, fids);
		console.log(JSON.stringify(myCollectData));
		CollectService.listData(myCollectData).then(function(res) {
			console.log(res);
			$(".is_load").css("display", "none");
			if(res.data.error == 0) {
				$(".cart_prompt .txt").html("已加入收藏");
				$(".cart_prompt").fadeIn(200);
				setTimeout(function() {
					$(".cart_prompt").fadeOut(200);
				}, 1000);
			} else {
				alert(res.data.msg);
			}

		})
	}

}

$scope.ref = function() {
	$timeout(function() {
		cartScroll.refresh();
	}, 300);
}

}])