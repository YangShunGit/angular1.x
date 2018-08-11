app.controller("myCollectCtlr", ["$scope", "$timeout", "$state", "FavoritesService", "AddCartService", "CollectService", function($scope, $timeout, $state, FavoritesService, AddCartService, CollectService) {
	/*返回上一步*/
	$scope.myBack = function() {
		window.history.go(-1);
	}

	/*--iscroll功能---*/
	var collectScroll;
	var is_require = true;
	var page = MyOrderPage;
	var groupindex = null;
	var groupid = Groupid;
	var groundname = "筛选";
	
	//截取字符串前四位变量
	var fourStr = "";
	var collectTimer = $timeout(function() {
		collectLoaded();
		$(".collect")[0].addEventListener('touchmove',
			prevent, isPassive() ? {
				capture: false,
				passive: false
			} : false);
	}, 100);

	function collectLoaded() {
		collectScroll = new IScroll(".collect_wrapper", {
			probeType: 3,
			preventDefault: false,
			bounce: true
		});
		
		collectScroll.on("scroll", function() {
			//$(".collect_wrapper").trigger('scroll');
			console.log(parseInt(AllPage) >= page, parseInt(AllPage), page);
			if(parseInt(AllPage) > page && $scope.edit_judge && is_require && collectScroll.maxScrollY > collectScroll.y) {

				is_require = false;
				console.log("124", is_require);
				page++;
				var myFavoritesData = FavoritesData(groupid, page, 10);
				//console.log("数据=======", myFavoritesData);
				FavoritesService.listData(myFavoritesData).then(function(res) {
					console.log(res);

					if(parseInt(res.data.resources[0].pages) == page) {
						$(".loadingmore").css("display", "none");
						$(".nomore").css("display", "block");
					} else {
						$(".loadingmore").css("display", "flex");
						$(".nomore").css("display", "none");
					}
					$scope.goods = $scope.goods.concat(res.data.resources[0].items);
					$scope.goods = priceSplit($scope.goods);

					$timeout(function() {
						is_require = true;
						collectScroll.refresh();
					}, 200);
				})

			}
		})
	}

	if(All_orders.length != 0) {
		$scope.goods = All_orders;
		$scope.favoritgroup = Favoritgroup;
		//console.log(MyOrderScrollTop);
		
		$timeout(function() {
			if(parseInt(AllPage) > page) {
				$(".nomore").css("display", "none");
				$(".loadingmore").css("display", "flex");
			} else {
				$(".loadingmore").css("display", "none");
				$(".nomore").css("display", "block");
			}
			collectScroll.refresh();
			collectScroll.scrollTo(0, parseInt(MyOrderScrollTop));
			//clearTimeout(time2);
		}, 300);
		if(groupid==""){
			$(".collect .default_sort_li span").css("color","#fe2f27");
		}else{
			$(".collect .default_sort_li span").css("color","#3C444b");
			$(".collect .sort_li span.gray").css("color","#fe2f27");
			$(".collect .price_sort_li .gray p").css("background-position","-422px -304px");
			for(var i = 0; i < $scope.favoritgroup.length; i++) {
				if(groupid == $scope.favoritgroup[i].groupid) {
					var time = setTimeout(function() {
						$(".filter_list li")[i].style.color = "rgb(247, 52, 46)";
						
						if($scope.favoritgroup[i].groupname.length>4){
							fourStr = $scope.favoritgroup[i].groupname.substring(0,4)+"...";
						}else{
							fourStr = $scope.favoritgroup[i].groupname;
						}
						$(".groupName").html(fourStr);
						clearTimeout(time);
					}, 200);
					break;
				}
			}
		}
		
	} else {
		var myFavoritesData = FavoritesData(groupid, page, 10);
		FavoritesService.listData(myFavoritesData).then(function(res) {
			console.log(res);
			AllPage = res.data.resources[0].pages;
			$scope.goods = res.data.resources[0].items;
			$scope.favoritgroup = res.data.resources[0].favoritgroup;
			/*for(var k = 0;k<$scope.favoritgroup.length;k++){
				if($scope.favoritgroup[k].groupname.length>4){
					var fourStr = $scope.favoritgroup[k].groupname.substring(0,4);
					$scope.favoritgroup[k].groupname = fourStr+"...";
				}
			}*/
			if($scope.goods.length == 0) {
				$(".empty").css({
					"display": "block"
				});
				$(".shop_sort").css({
					"display": "none"
				});
				$(".collect_right").css({
					"display": "none"
				});
			} else {
				$scope.goods = priceSplit($scope.goods);
			}
			if(parseInt(AllPage) > page) {
				$(".nomore").css("display", "none");
				$(".loadingmore").css("display", "flex");
			} else if($scope.goods.length==0){
				$(".loadingmore").css("display", "none");
				$(".nomore").css("display", "none");
			}else{
				$(".loadingmore").css("display", "none");
				$(".nomore").css("display", "block");
			}
			$timeout(function() {

				collectScroll.refresh();
			}, 200);
		})
	}
	/*--传参--*/
	$scope.getData = function($event) {
		var sessionData = {};
		var myId = $($event.target).attr("data-id");
		$scope.goods.map(function(item) {
			if(item.goods_id == myId) {
				sessionData = item;
			}
		});
		sessionData = JSON.stringify(sessionData);
		sessionStorage.setItem("shop_data", sessionData);
		$state.go("detail_page");

	}

	$scope.all_goods = 0;
	//$scope.goods = JSON.parse(sessionStorage.getItem("collect_shop"));
	//console.log("收藏",$scope.goods);

	/*无商品时效果*/

	$scope.edit_status = true;
	//判断是否在编辑中，编辑中不可点
	$scope.edit_judge = true;
	//记录编辑之前是加载状态还是没有更多
	var is_nomore;
	/*--点击编辑--*/
	$scope.collect_edit = function() {
		if($(".collect_filter").css("display") == "block") {
			$(".collect_filter").css("display", "none");
			$(".price_sort_li span.gray").css("color", "#3C444b");
			$(".gray p").css({
				"background-position": "-389px -294px"
			});
		}
		$scope.edit_status = !$scope.edit_status;
		$scope.sel_judge = true;

		if($scope.edit_judge) {
			if($(".nomore").css("display") == "block") {
				is_nomore = "yes";
			} else {
				is_nomore = "no";
			}
			$(".nomore").css("display", "none");
			$(".loadingmore").css("display", "none");
			$(".shop_list_ul").animate({
				paddingLeft: "30px"
			}, 500);
			$(".collect .li_title").css("paddingRight", "20px");
			$("section").attr("class", "edit_nor");
			$(".li_cart").css("display", "none");
			$(".li_add").css("display", "none");
			$(".collect_body").css({
				"padding-bottom": "50px"
			})
			$timeout(function() {
				collectScroll.refresh();

			}, 100)
			$scope.edit_judge = false;
			$("section").css("display", "block");
		} else {
			if(is_nomore == "yes") {
				$(".nomore").css("display", "block");
				$(".loadingmore").css("display", "none");
			} else {
				$(".nomore").css("display", "none");
				$(".loadingmore").css("display", "flex");
			}
			$(".shop_list_ul").animate({
				paddingLeft: "0px"
			}, 500);
			$(".collect .li_title").css("paddingRight", "0px");
			$("section").css({
				"display": "none"
			});
			$(".li_cart").css("display", "block");
			$(".li_add").css("display", "block");
			$(".collect_body").css({
				"padding-bottom": "0px"
			})
			$timeout(function() {
				$(".check_sel").css({
					"display": "none"
				});
				$(".foot_left1 p").css("background-position", "-442px -289px");
				collectScroll.refresh();
			}, 200)

			$scope.edit_judge = true;
		}
		/*--移除点击详情页效果--*/
		$(".li_pic a").attr("href") == "#/detail_page" ?
			$(".li_pic a").removeAttr("href") :
			$(".li_pic a").attr("href", "#/detail_page");
	}

	/*--data-id查找商品--*/
	function find_shop(id, arr) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].goods_id == id) {
				return i;
			}
		}
	}

	/*--编辑状态下的勾选--*/
	$scope.change_edit = function($event) {
		if($($event.target).attr("class") == "edit_nor") {
			$($event.target).attr("class", "edit_sel");

			if($("section.edit_nor").length == 0) {
				$(".all_edit_nor").css("background-position", "-260px -83px");
			}
		} else {
			$($event.target).attr("class", "edit_nor");
			$(".all_edit_nor").css("background-position", "-442px -289px");

		}
	}

	/*--筛选变色--*/
	$(".filter_list").on("click", "li", function() {
		if($scope.edit_judge) {
			collectScroll.scrollTo(0,0);
			groupindex = $(this).attr("data-index");
			if($(this).attr("groupname").length>4){
				fourStr = $(this).attr("groupname").substring(0,4)+"...";
			}else{
				fourStr = $(this).attr("groupname");
			}
			$(".groupName").html(fourStr);
			$(".filter_list li").css("color", "#626262");
			$(".draw").css("display", "none");
			$(this).css("color", "#f7342e");
			$(this).find(".draw").css("display", "inline-block");
			groupid = $(this).attr("groupid");
			page = 1;
			
			myFavoritesData = FavoritesData(groupid, page, 10);
			FavoritesService.listData(myFavoritesData).then(function(res) {
				console.log(res);
				
				
				AllPage = res.data.resources[0].pages;
				$(".gray p").css({
					"background-position": "-389px -294px"
				});
				$(".collect_filter").css({
					"display": "none"
				})
				$(".collect .sort_li span.gray").css("color","rgb(254, 47, 39)");
				$(".collect .price_sort_li .gray p").css({
					"background-position":"-422px -304px"
				})
				$(".default_sort_li span").css("color","#3C444b");
				$scope.goods = res.data.resources[0].items;
				if(res.data.resources[0].items.length == 10) {
					$(".loadingmore").css("display", "flex");
					$(".nomore").css("display", "none");
				} else {
					$(".loadingmore").css("display", "none");
					$(".nomore").css("display", "block");
				}
				$scope.goods = priceSplit($scope.goods);
				$timeout(function() {
					collectScroll.refresh();
				}, 200);
			})
		}
	});

	/*--点击进行筛选--*/
	
	$(".price_sort_li").on("click",function() {
		if($scope.edit_judge) {
			if($(this).find("p").css("background-position") == "-422px -294px") {
				if(groupid.length>0){
					$(".gray p").css({
						"background-position": "-422px -304px"
					});
				}else{
					$(".gray p").css({
						"background-position": "-389px -294px"
					});
					$(".price_sort_li span.gray").css("color", "#3C444b");
				}
				$(".collect_filter").css({
					"display": "none"
				})
				
			} else {
				$(".gray p").css({
					"background-position": "-422px -294px"
				});
				$(".collect_filter").css({
					"display": "block"
				})
				$(".price_sort_li span.gray").css("color", "#fe2f27");
			}
			
		}
	})

	$(".default_sort_li").on("click", function() {
		if($scope.edit_judge) {
			collectScroll.scrollTo(0,0);
			page = 1;
			groupid = "";
			$(".groupName").html("筛选");
			myFavoritesData = FavoritesData(groupid, page, 10);
			FavoritesService.listData(myFavoritesData).then(function(res) {
				console.log(res);
				AllPage = res.data.resources[0].pages;
				$(".gray p").css({
					"background-position": "-389px -294px"
				});
				$(".collect_filter").css({
					"display": "none"
				})
				$(".price_sort_li span.gray").css("color", "#3C444b");
				$(".default_sort_li span").css("color","#fe2f27");
				$scope.goods = res.data.resources[0].items;

				//上拉加载、没有更多显示隐藏
				if(res.data.resources[0].items.length == 10) {
					$(".loadingmore").css("display", "flex");
					$(".nomore").css("display", "none");
				} else {
					$(".loadingmore").css("display", "none");
					$(".nomore").css("display", "block");
				}

				$scope.goods = priceSplit($scope.goods);

				$scope.favoritgroup = res.data.resources[0].favoritgroup;
				$timeout(function() {
					collectScroll.refresh();
				}, 200);
			})
		}
	})

	/*点击遮罩位置隐藏筛选*/
	$scope.click_draw = function($event) {
		//console.log($($event.target).attr("class"));
		
		if($($event.target).attr("class") == "collect_filter") {
			$(".collect_filter").css("display", "none");
			if(groupid==""){
				$(".price_sort_li span.gray").css("color", "#3C444b");
				$(".gray p").css({
					"background-position": "-389px -294px"
				});
			}else{
				$(".price_sort_li span.gray").css("color", "rgb(254, 47, 39)");
				$(".gray p").css({
					"background-position": "-422px -304px"
				});
			}
			

		}
	}

	/*--全选--*/
	$(".all_edit_nor").on("click", function() {
		if($(this).css("background-position") == "-260px -83px") {
			$("section").attr("class", "edit_nor");
			$(this).css("background-position", "-442px -289px");
		} else {
			$("section").attr("class", "edit_sel");
			$(this).css("background-position", "-260px -83px");
		}
	})

	var fids = [];
	
	/*--点击取消收藏--*/
	$(".foot_right2 .collect").on("click", function() {
		fids = [];
		
		var edit_sel = $(".list_li section.edit_sel");

		$.each(edit_sel, function(index, obj) {
			fids.push($(obj).attr("fids"));
		})
		fids = fids.toString();
		console.log("111", fids);
		if(fids.length <= 0) {
			$(".prompt_fail .txt").html("未选中选择商品");
			$(".prompt_fail").fadeIn(200);
			setTimeout(function() {
				$(".prompt_fail").fadeOut(200);
			}, 1000);
		} else {
			$(".mask_confirm .txt").html("确认要取消收藏吗？");
			$(".mask_confirm").css("display", "block");

		}
	});
	$timeout(function() {
		$(".mask_confirm").on("click", ".yes", function() {
			
			$(".mask_confirm").css("display", "none");
			var act = "del";
			var eid = "";
			var itemid = "";
			var cartid = "";
			var myCollectData = CollectData(act, cartid, eid, itemid, fids);
			console.log(myCollectData);
			CollectService.listData(myCollectData).then(function(res) {
				console.log(res);
				if(res.data.error == "0") {
					$(".prompt_success .txt").html("已取消收藏");

					$(".prompt_success").fadeIn(200);
					setTimeout(function() {
						$(".prompt_success").fadeOut(200);
					}, 1000);
					page = 1;
					//Groupid = groupid;
					//groupid = "";
					if(groupindex==null){
						groupid = "";
					}else{
						$scope.favoritgroup[groupindex].totalqty = $scope.favoritgroup[groupindex].totalqty - $("section.edit_sel").length;
						if($scope.favoritgroup[groupindex].totalqty==0){
							groupid = "";
						}
					}
					
					
					myFavoritesData = FavoritesData(groupid, page, 10);
					FavoritesService.listData(myFavoritesData).then(function(res) {
						console.log(res);
						if(groupid==""){
							$scope.favoritgroup = res.data.resources[0].favoritgroup;
							$(".collect .default_sort_li span").css("color","#fe2f27");
							$(".collect .sort_li span.gray").css("color","#3C444b");
							$(".collect .price_sort_li .gray p").css("background-position","-389px -294px");
							$(".groupName").html("筛选");
						}
						/*if($("section.edit_nor").length == 0) {
							if(groupid==""){
								$(".collect .default_sort_li span").css("color","#fe2f27");
							}else{
								$(".collect .default_sort_li span").css("color","#3C444b");
								$(".collect .sort_li span.gray").css("color","#fe2f27");
								$(".collect .price_sort_li .gray p").css("background-position","-422px -304px");
								groupid = Groupid ;
								for(var i = 0; i < $scope.favoritgroup.length; i++) {
									if(groupid == $scope.favoritgroup[i].groupid) {
										var time = setTimeout(function() {
											$(".filter_list li")[i].style.color = "rgb(247, 52, 46)";
											
											if($scope.favoritgroup[i].groupname.length>4){
												fourStr = $scope.favoritgroup[i].groupname.substring(0,4)+"...";
											}else{
												fourStr = $scope.favoritgroup[i].groupname;
											}
											$(".groupName").html(fourStr);
											clearTimeout(time);
										}, 200);
										break;
									}
								}
							}
						}*/
						AllPage = res.data.resources[0].pages;
						$scope.goods = res.data.resources[0].items;
						$scope.goods = priceSplit($scope.goods);
						//$scope.favoritgroup = res.data.resources[0].favoritgroup;
						
						if($scope.goods.length == 0) {
							$(".empty").css({
								"display": "block"
							});
							$(".shop_sort").css({
								"display": "none"
							});
							$(".collect_foot").css({
								"display": "none"
							});
							$(".collect_right").css({
								"display": "none"
							});
						}
						if(res.data.resources[0].items.length == 10) {
							$(".loadingmore").css("display", "flex");
							$(".nomore").css("display", "none");
						} else if(res.data.resources[0].items.length==0){
							$(".loadingmore").css("display", "none");
							$(".nomore").css("display", "none");
						} else{
							$(".loadingmore").css("display", "none");
							$(".nomore").css("display", "block");
						}
						$(".shop_list_ul").css({
							"paddingLeft": "0px"
						});
						$(".collect .li_title").css("paddingRight", "0px");
						$("section").css({
							"display": "none"
						});
						//$(".li_cart").css("display", "block");
						//$(".li_add").css("display", "block");
						$(".collect_body").css({
							"padding-bottom": "0px"
						})
						$timeout(function() {
							$(".check_sel").css({
								"display": "none"
							});
							$("section").css("display", "block");
							$(".foot_left1 p").css("background-position", "-442px -289px");
							collectScroll.refresh();
						}, 200)
						$scope.edit_status = !$scope.edit_status;
						$scope.edit_judge = true;
					})
				} else {
					$(".prompt_fail .txt").html(res.data.msg);
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				}
			})
		});

		$(".mask_confirm").on("click", ".no", function() {
			$(".mask_confirm").css("display", "none");
		});
	}, 200);

	/*--点击add--*/
	$(".shop_list_ul").on("click", ".list_li .li_add .add", function() {
		if($(this).children().css("color") != "rgb(191, 191, 191)") {
			var old_count = $(this).siblings(".count").children("input").val();
			var new_count = parseInt(old_count) + 1;
			if(new_count > 9999) {
				$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
				$(".prompt_fail").fadeIn(200);
				setTimeout(function() {
					$(".prompt_fail").fadeOut(200);
				}, 1000);
				$(this).children().css("color", "#bfbfbf");
			} else {
				$(this).siblings(".count").children("input").val(new_count);
				$(this).siblings(".del").children(".icon-del").css("color", "#232227");
			}
		}
	});

	/*--点击del--*/
	$(".shop_list_ul").on("click", ".list_li .li_add .del", function() {

		var old_count = $(this).siblings(".count").children("input").val();
		if(old_count > 2) {
			var new_count = parseInt(old_count) - 1;
			$(this).siblings(".add").children().css("color", "#232227");
			$(this).siblings(".count").children("input").val(new_count);
		} else {
			$(this).siblings(".count").children("input").val(1);
			$(this).children(".icon-del").css("color", "#bfbfbf");
		}
	});

	var oldValue;
	$(".shop_list_ul").on("click", ".count input", function() {
		oldValue = $(this).val();
	});
	/*--点击count--*/
	$(".shop_list_ul").on("keyup", ".count input", function() {
		var myValue = $(this).val();
		if(myValue != "") {
			var reg = /^[1-9]\d*$/.test(myValue);
			console.log(myValue, reg);
			if(reg) {
				if(parseInt(myValue) > 9999) {
					$(this).val(oldValue);
					if(oldValue == 1) {
						$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
						$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#bfbfbf");
					}
					$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				} else if(parseInt(myValue) == 1) {
					$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#bfbfbf");
				} else {
					$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#232227");
				}
			} else {
				$(this).val(oldValue);
			}
		}
	});
	$(".shop_list_ul").on("blur", ".count input", function() {
		var myValue = $(this).val();
		if(myValue == "") {
			$(this).val(oldValue);
			$(".prompt_fail .txt").html("单件商品不能少于1件");
			$(".prompt_fail").fadeIn(200);
			$timeout(function() {
				$(".prompt_fail").fadeOut(200);
			}, 1000);
		}
	});

	/*--添加购物车--*/
	$(".shop_list_ul").on("click", ".list_li .li_cart", function() {
		/*加入购物车成功提示框*/
		$(".prompt_success .txt").html("加入购物车成功");
		$(".prompt_success").fadeIn(200);
		setTimeout(function() {
			$(".prompt_success").fadeOut(200);
		}, 1000);
		var eid = $(this).attr("eid");
		var itemid = $(this).attr("itemid");
		var orderqty = $(this).siblings(".li_add").children(".count").children("input").val();
		var price = $(this).attr("price");
		var act = "add";
		var cartid = "";
		var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
		console.log(myAddCartData);
		AddCartService.listData(myAddCartData).then(function(res) {
			console.log("111", res);
		})

	});

	/*--数据传递函数--*/
	$scope.getData = function($event) {
		var shopData = {};
		MyOrderScrollTop = collectScroll.y;
		MyOrderPage = page;
		Groupid = groupid;
		Favoritgroup = $scope.favoritgroup;
		All_orders = $scope.goods;
		shopData.itemid = $($event.target).attr("itemid");
		shopData.eid = $($event.target).attr("eid");
		shopData.colorid = $($event.target).attr("colorid");
		shopData.sizeid = $($event.target).attr("sizeid");

		shopData = JSON.stringify(shopData);
		sessionStorage.setItem("detail_data", shopData);
		$state.go("detail_page");
	}

}]);