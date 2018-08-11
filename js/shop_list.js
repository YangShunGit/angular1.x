app.controller("shop_listCtlr", ["$scope", "$timeout", "$state", "ShopListDataService", "AddCartService", "SearchService", function($scope, $timeout, $state, ShopListDataService, AddCartService, SearchService) {

	var datatype = sessionStorage.getItem("datatype");
	var groupid = sessionStorage.getItem("groupid");
	$timeout(function() {
		$(".ysj .detail_nav_list a.nav2").css("display", "none");
	}, 200);

	var s_id = sessionStorage.getItem("categoryid");
	var s_no = sessionStorage.getItem("categoryno");
	if(s_id == null) {
		s_id = "";
		s_no = "";
	}
	
	var shopScroll;
	//获取数据page参数
	var page = ShopHistory.page;
	//当前排序状态
	var sortStatus = ShopHistory.sortStatus;
	//筛选品牌id
	$scope.brandSession = ShopHistory.brandid;
	//筛选品牌名称
	$scope.brandText = ShopHistory.brandText;
	
	//ch为true列表显示，为false大图显示
	$scope.ch = ShopHistory.ch;
	//升序降序判断参数
	var by = ShopHistory.by;
	//页面显示当前页码
	$scope.page = 1;
	//筛选页显示隐藏参数
	$scope.right = false;
	//移除两侧的空白字符
	SearchKey = $.trim(SearchKey);
	//console.log(SearchKey);
	//每次只请求一次数据参数，获取到数据之后再进行第二次请求
	var is_require = true;
	console.log("=====",ShopHistory);
	/*--价格整数小数分割函数--*/
	function priceSplit(arr) {
		for(var i = 0; i < arr.length; i++) {
			//价格整数、小数部分
			arr[i].itprice = {
				"big_price": "",
				"small_price": ""
			};
			//for循环体
			arr[i].itprice.big_price = parseInt(arr[i].price);
			arr[i].itprice.small_price = arr[i].price.toString().split(".")[1];
		};
		return arr;
	}

	/*--数据处理--*/
	function reduce(res) {
		$scope.all_page = res.data.resources[0].pages;
		
		$scope.search_key = res.data.resources[0].key;
		/*--展开隐藏参数--*/
		var deploy = false;
		/*--展开全部品牌--*/
		$(".right_content_box").on("click", ".all", function() {
			if(deploy == true) {
				$(this).parent().siblings().children(".body_show").css("height", "40px");
				$(this).children(".arrow").css("background-position", "-410px -170px");
				deploy = false;
			} else {
				$(this).parent().siblings().children(".body_show").css("height", "auto");
				$(this).children(".arrow").css("background-position", "-410px -180px");
				deploy = true;
			}
		})
		$scope.keepGoods = res.data.resources[0].items;
		//console.log("$scope.keepGoods", $scope.keepGoods);
		if($scope.keepGoods.length == 0) {
			is_require = false;
			$(".empty").css("display", "block");
			$(".shop_sort").css("display", "none");
			$(".shop_box").css("display", "none");
		} else {
			$(".empty").css("display", "none");
			$(".shop_sort").css("display", "block");
			$(".shop_box").css("display", "block");
			for(var i = 0; i < $scope.keepGoods.length; i++) {
				//价格整数、小数部分
				$scope.keepGoods[i].itprice = {
					"big_price": "",
					"small_price": ""
				};
				//for循环体
				$scope.keepGoods[i].itprice.big_price = parseInt($scope.keepGoods[i].price);
				$scope.keepGoods[i].itprice.small_price = $scope.keepGoods[i].price.toString().split(".")[1];
			};
			if(parseInt($scope.all_page)==page||parseInt($scope.all_page)==0){
				$(".loadingmore").css("display","none");
				$(".nomore").css("display","block");
			}else{
				
				$(".nomore").css("display","none");
				$(".loadingmore").css("display","flex");
			}
		}
		$scope.goods = $scope.keepGoods;
		//console.log("============",ShopHistory.res.data.resources[0].items);
		
		if($scope.goods.length == 0) {
			$(".empty").css("display", "block");
		}

		
		$timeout(function() {
			//shopScroll.scrollTo(0,0);
			shopScroll.refresh();
		}, 100);
		//console.log("刷新成功");
	}
	
	
	
	
	//====================================================================
	/*---获取数据---*/
	if(ShopHistory.res!=""){
		shopLoaded();
		if(sortStatus=="qty"){
			$(".volume_sort_li").siblings().css("color", "#252527");
			$(".volume_sort_li").css("color", "#fa3022");
		}else if(sortStatus=="price"){
			$(".price_sort_li").siblings().css("color", "#252527");
			$(".price_sort_li").css("color", "#fa3022");
			if(by=="1"){
				$(".price_sort_li span").attr("class", "descend");
			}else{
				$(".price_sort_li span").attr("class", "ascend");
			}
		}
		$timeout(function(){
			$scope.brands = ShopHistory.res.data.resources[0].brands;
			reduce(ShopHistory.res);
			shopScroll.scrollTo(0,parseInt(ShopHistory.scrollTop));
			console.log($(".brand_list span"));
			
		},300);
		$timeout(function(){
			for(var n=0;n<$(".brand_list span").length;n++){
				if($($(".brand_list span")[n]).attr("brandid")==ShopHistory.brandid){
					console.log("渲染成功");
					$($(".brand_list span")[n]).attr("class","active");
					$($(".brand_list span")[n]).children("i").css("width","16px");
					$($(".brand_list span")[n]).css({
						"color":"rgb(242, 48, 48)",
						"background":"white"
					})
				}
			}
		},400);
		
	}else{
		if(IsSearch == true) {
			//IsSearch = false;
			//获取搜索之后商品列表的数据
			var myShopListData = ShopListData(datatype, s_id, "", s_no, "", SearchKey, 1, 10, "", 0, groupid);
			console.log(myShopListData);
			SearchService.listData(myShopListData).then(function(res) {
				console.log("搜索数据",res);
				$scope.brands =res.data.resources[0].brands;
				reduce(res);
				ShopHistory.res = res;
			})
		} else {
			//获取商品列表的数据
			//console.log(SearchKey);
			var myShopData = ShopListData(datatype, s_id, "", s_no, "", SearchKey, page, 10, "", 0, groupid);
			ShopListDataService.listData(myShopData).then(function(res) {
				console.log("res----",res);
				$scope.brands = res.data.resources[0].brands;
				reduce(res);
				ShopHistory.res = res;
			});
		}
	}
	
	
	
	
	
	
	$scope.confirm = function() {
		$(".is_load").css("display", "block");
		page = 1;
		ShopHistory.page = page;
		var brandid = $scope.brandSession;
		ShopHistory.brandText = $scope.brandText;
		ShopHistory.brandid = brandid;
		myShopListData = ShopListData(datatype, s_id, "", s_no, brandid, SearchKey, page, 10, sortStatus , 0, groupid);
		//console.log("打印筛选数据",myShopListData);
		if(IsSearch == true) {
			SearchService.listData(myShopListData).then(function(res) {
				console.log(res);
				$(".is_load").css("display", "none");
				$scope.all_page =  res.data.resources[0].pages;
				$scope.keepGoods = res.data.resources[0].items;
				console.log("keepGoods", $scope.keepGoods);
				if($scope.keepGoods.length == 0) {
					$(".empty").css("display", "block");
					$(".shop_sort").css("display", "none");
					$(".shop_box").css("display", "none");
				} else {
					$(".empty").css("display", "none");
					$(".shop_sort").css("display", "block");
					$(".shop_box").css("display", "block");
					$scope.keepGoods = priceSplit($scope.keepGoods);
					if($scope.keepGoods.length==10){
						$(".nomore").css("display","none");
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
						$(".nomore").css("display","block");
					}
				}
				$scope.goods = $scope.keepGoods;
				ShopHistory.res.data.resources[0].items=$scope.goods;
				console.log("mygoods", $scope.goods);

				$timeout(function() {
					shopScroll.refresh();
					shopScroll.scrollTo(0, 0);
					$(".to_top").css("display", "none");
					is_require = true;
				}, 200);
			})
		} else {
			ShopListDataService.listData(myShopListData).then(function(res) {
				console.log(res);
				$(".is_load").css("display", "none");
				$scope.all_page =  res.data.resources[0].pages;
				$scope.keepGoods = res.data.resources[0].items;
				console.log("keepGoods", $scope.keepGoods);
				if($scope.keepGoods.length == 0) {
					$(".empty").css("display", "block");
					$(".shop_sort").css("display", "none");
					$(".shop_box").css("display", "none");
				} else {
					$(".empty").css("display", "none");
					$(".shop_sort").css("display", "block");
					$(".shop_box").css("display", "block");
					$scope.keepGoods = priceSplit($scope.keepGoods);
					if($scope.keepGoods.length==10){
						$(".nomore").css("display","none");
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
						$(".nomore").css("display","block");
					}
				}
				$scope.goods = $scope.keepGoods;
				console.log("mygoods", $scope.goods);
				ShopHistory.res.data.resources[0].items=$scope.goods;
				$timeout(function() {
					shopScroll.refresh();
					shopScroll.scrollTo(0, 0);
					$(".to_top").css("display", "none");
					is_require = true;
				}, 200);
			})
		}

		$scope.right = "";
		is_require = true;
	};

	

	function shopLoaded() {
		shopScroll = new IScroll(".shop_wrapper", {
			probeType: 3,
			preventDefault: false,
			checkDOMChanges: true,
			bounce:false
		});

		shopScroll.on("scroll", function() {
			//iscroll懒加载滚动监测
			$(".shop_wrapper").trigger('scroll');
			$timeout(function() {
				$(".tips").css("display", "block");
				shopScroll.refresh();
			}, 200);
			
			//console.log(is_require, shopScroll.maxScrollY, shopScroll.y);
			if(page < parseInt($scope.all_page) && is_require && shopScroll.maxScrollY >= shopScroll.y-200) {
				is_require = false;
				console.log("124", is_require);
				page++;
				ShopHistory.page = page;
				var brandid = $scope.brandSession;
				myShopData = ShopListData(datatype, s_id, "", s_no, brandid, SearchKey, page, 10, "", 0, groupid);
				if(IsSearch == true) {
					SearchService.listData(myShopData).then(function(res) {
						//console.log("滚动search",res);
						$scope.keepGoods = res.data.resources[0].items;
						if($scope.all_page == page) {
							$(".loadingmore").css("display","none");
							$(".nomore").css("display","block");
						} else {
							$(".nomore").css("display","none");
							$(".loadingmore").css("display","flex");
						}
						for(var i = 0; i < $scope.keepGoods.length; i++) {
							//价格整数、小数部分
							$scope.keepGoods[i].itprice = {
								"big_price": "",
								"small_price": ""
							};
							//for循环体
							$scope.keepGoods[i].itprice.big_price = parseInt($scope.keepGoods[i].price);
							$scope.keepGoods[i].itprice.small_price = $scope.keepGoods[i].price.toString().split(".")[1];
						};
						
						$scope.goods = $scope.goods.concat($scope.keepGoods);
						ShopHistory.res.data.resources[0].items = $scope.goods;
						
						console.log("mygoods", $scope.goods);
	
						$timeout(function() {
							shopScroll.refresh();
							is_require = true;
						}, 200);
					})
				}else{
					ShopListDataService.listData(myShopData).then(function(res) {
						console.log("滚动shoplist",res,$scope.keepGoods.length);
						$scope.keepGoods = res.data.resources[0].items;
						if($scope.all_page == page) {
							$(".loadingmore").css("display","none");
							$(".nomore").css("display","block");
						} else {
							$(".nomore").css("display","none");
							$(".loadingmore").css("display","flex");
						}
						for(var i = 0; i < $scope.keepGoods.length; i++) {
							//价格整数、小数部分
							$scope.keepGoods[i].itprice = {
								"big_price": "",
								"small_price": ""
							};
							//for循环体
							$scope.keepGoods[i].itprice.big_price = parseInt($scope.keepGoods[i].price);
							$scope.keepGoods[i].itprice.small_price = $scope.keepGoods[i].price.toString().split(".")[1];
						};
						
						$scope.goods = $scope.goods.concat($scope.keepGoods);
						ShopHistory.res.data.resources[0].items = $scope.goods;
						
						console.log("ShopHistory====",ShopHistory);
	
						$timeout(function() {
							shopScroll.refresh();
							is_require = true;
						}, 200);
	
					})
				}
			}
		});

		shopScroll.on("scrollEnd", function() {
			/*--页码显示隐藏--*/
			$scope.page = parseInt(shopScroll.y / (shopScroll.scrollerHeight / -page)) + 1;
			console.log(shopScroll, shopScroll.scrollerHeight, page, $scope.page);
			if($scope.page >= $scope.all_page) {
				$scope.page = $scope.all_page;
				$timeout(function() {
					$(".tips").css("display", "block");
				}, 500);
			}
			if($scope.page > 1) {
				$(".to_top").css("display", "block");
			} else {
				$(".to_top").css("display", "none");
			}
			$(".page_prompt").fadeIn(200);
			var myTimeOut = $timeout(function() {
				$(".page_prompt").fadeOut(200);
				$timeout.cancel(myTimeOut);
			}, 2000);
			$scope.$digest();
		});
	}

	var shopTimer = $timeout(function() {
		shopLoaded();
		$(".shop")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
	}, 200);

	/*--回到顶部--*/
	$(".to_top").on("click", function() {
		shopScroll.scrollTo(0, 0);
		$(".to_top").css("display", "none");
	});

	/*--youshangjiao--*/
	$scope.d = false;
	$scope.change_nav = function() {
		$scope.d = !$scope.d;
	}

	/*--切换列表模式和大图模式--*/
	$scope.changeList = function() {
		$(".tips").css("display", "none");
		$scope.ch = !$scope.ch;
		ShopHistory.ch = $scope.ch;
		$timeout(function() {
			shopScroll.refresh();
			shopScroll.scrollTo(0, 0);
		}, 100)
	};

	/*--数据传递函数跳转到详情页--*/
	$scope.getData = function($event) {
		ShopHistory.scrollTop = shopScroll.y;
		var shopData = {};
		shopData.itemid = $($event.target).attr("itemid");
		shopData.eid = $($event.target).attr("eid");
		shopData.colorid = $($event.target).attr("colorid");
		shopData.sizeid = $($event.target).attr("sizeid");

		shopData = JSON.stringify(shopData);
		sessionStorage.setItem("detail_data", shopData);
		$state.go("detail_page");
	}

	/*--返回上一步--*/
	$scope.myBack = function() {
		window.history.go(-1);
	}

	/*--点击add--*/
	$(".shop_list_ul").on("click", ".list_li .del_add .add", function() {
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
	})

	/*--点击del--*/
	$(".shop_list_ul").on("click", ".list_li .del_add .del", function() {

		var old_count = $(this).siblings(".count").children("input").val();
		if(old_count > 2) {
			var new_count = parseInt(old_count) - 1;
			$(this).siblings(".add").children().css("color", "#232227");
			$(this).siblings(".count").children("input").val(new_count);
		} else {
			$(this).siblings(".count").children("input").val(1);
			$(this).children(".icon-del").css("color", "#bfbfbf");
		}
	})

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
	$(".shop_list_ul").on("click", ".list_li .li_add", function() {
		/*加入购物车成功提示框*/
		$(".prompt_success .txt").html("加入购物车成功");
		$(".prompt_success").fadeIn(200);
		setTimeout(function() {
			$(".prompt_success").fadeOut(200);
		}, 1000);
		var eid = $(this).attr("eid");
		var itemid = $(this).attr("itemid");
		var orderqty = $(this).siblings(".del_add").children(".count").children("input").val();
		var price = $(this).attr("price");
		var act = "add";
		var cartid = "";
		var myAddCartData = AddCartData(eid, itemid, orderqty, price, act, cartid);
		console.log(myAddCartData);
		AddCartService.listData(myAddCartData).then(function(res) {
			console.log("111", res);
		})
	});

	
	/*--筛选页点击变色--*/
	$(".body_show").on("click", "span", function() {
		$(".tips").css("display", "none");
		var myText = $(this).text();
		if($(this).children(".sel").css("width") == "0px") {
			$(this).children(".sel").css("width", "16px");
			$(this).attr("class", "active");
			$(this).css({
				"color": "#f23030",
				"background": "white"
			});
			$(this).parent().siblings(".brand_list").children().css({
				"color": "#201f24",
				"background": "#f0f2f5"
			});
			$(this).parent().siblings(".brand_list").children().removeAttr("class");
			$(this).parent().siblings(".brand_list").children().children("i").css("width", "0px");
			$scope.brandSession = $(this).attr("brandid");
			$scope.brandText = $(this).text();
			$scope.brandText = $.trim($scope.brandText);
		} else {
			$(this).children(".sel").css("width", "0px");
			$(this).removeAttr("class");
			$(this).css({
				"color": "#201f24",
				"background": "#f0f2f5"
			});
			$scope.brandSession = "";
			$scope.brandText = "";
		}
		$scope.$digest();
	});
	
	//品牌筛选重置函数
	function reset() {
		$(".body_show span").children(".sel").css("width", "0px");
		$(".body_show span").removeAttr("class");
		$(".body_show span").css({
			"color": "#201f24",
			"background": "#f0f2f5"
		});
		$scope.brandSession = "";
		$scope.brandText = "";
	}

	/*--筛选重置--*/
	$(".reset").click(function() {
		$(".tips").css("display", "none");
		$(".price_sort_li span").attr("class", "gray");
		$(".body_show span").children(".sel").css("width", "0px");
		$(".body_show span").removeAttr("class");
		$(".body_show span").css({
			"color": "#201f24",
			"background": "#f0f2f5"
		});
		$scope.brandSession = "";
		$scope.brandText = "";
		$scope.$digest();
	});
	/*--默认筛选--*/
	$(".default_sort_li").on("click", function() {
		if(sortStatus!=""){
		sortStatus = "";
		ShopHistory.sortStatus = sortStatus;
		$(".is_load").css("display", "block");
		$(".tips").css("display", "none");
		$(this).siblings().css("color", "#252527");
		$(this).css("color", "#fa3022");
		var brandid = $scope.brandSession;
		$(".price_sort_li span").attr("class", "gray");
		page = 1;
		ShopHistory.page = page;
		by = "";
		var mySearch = {
			"datatype": datatype,
			"categoryid": s_id,
			"dictionaryid": "",
			"categoryno": s_no,
			"brandid": brandid,
			"key": SearchKey,
			"page": page,
			"pagesize": 10,
			"order": "",
			"by": "",
			"groupid": groupid
		}
		var myShopListData = ShopListData(mySearch.datatype, mySearch.categoryid, mySearch.dictionaryid, mySearch.categoryno, mySearch.brandid, mySearch.key, mySearch.page, mySearch.pagesize, mySearch.order, mySearch.by, mySearch.groupid);
		if(IsSearch == true) {
			SearchService.listData(myShopListData).then(function(res) {
				if(res.data.error == 0) {
					$(".is_load").css("display", "none");
					reduce(res);
					shopScroll.scrollTo(0,0);
					ShopHistory.res.data.resources[0].items = $scope.goods;
				} else {
					alert(res.data.msg);
				}
				console.log(res);

			})
		} else {
			ShopListDataService.listData(myShopListData).then(function(res) {
				console.log(res);
				$(".is_load").css("display", "none");
				
				reduce(res);
				shopScroll.scrollTo(0,0);
				ShopHistory.res.data.resources[0].items = $scope.goods;
			})
		}
		}
	})
	/*--价格筛选--*/
	
	$(".price_sort_li").on("click", function() {
		
		sortStatus = "price";
		ShopHistory.sortStatus = sortStatus;
		$(".is_load").css("display", "block");
		$(this).siblings().css("color", "#252527");
		$(this).css("color", "#fa3022");
		/*---价格排序图标变色--*/
		var brandid = $scope.brandSession;
		if($(".price_sort_li span").attr("class") == "gray") {
			$(".price_sort_li span").attr("class", "ascend");
			by = "0";
		} else {
			if($(".price_sort_li span").attr("class") == "ascend") {
				$(".price_sort_li span").attr("class", "descend")
				by = "1";
			} else {
				$(".price_sort_li span").attr("class", "ascend");
				by = "0";
			}
		}
		page = 1;
		ShopHistory.page = page;
		console.log(SearchKey);
		var mySearch = {
			"datatype": datatype,
			"categoryid": s_id,
			"dictionaryid": "",
			"categoryno": s_no,
			"brandid": brandid,
			"key": SearchKey,
			"page": page,
			"pagesize": 10,
			"order": "price",
			"by": by,
			"groupid": groupid
		}
		var myShopListData = ShopListData(mySearch.datatype, mySearch.categoryid, mySearch.dictionaryid, mySearch.categoryno, mySearch.brandid, mySearch.key, mySearch.page, mySearch.pagesize, mySearch.order, mySearch.by, mySearch.groupid);
		if(IsSearch == true) {
			SearchService.listData(myShopListData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					$(".is_load").css("display", "none");
					reduce(res);
					shopScroll.scrollTo(0,0);
					ShopHistory.res.data.resources[0].items = $scope.goods;
				} else {
					alert(res.data.msg);
				}
			})
		} else {
			ShopListDataService.listData(myShopListData).then(function(res) {
				console.log(res);
				$(".is_load").css("display", "none");
				reduce(res);
				shopScroll.scrollTo(0,0);
				ShopHistory.res.data.resources[0].items = $scope.goods;
			})
		}
		
	});
	/*--销量筛选--*/
	$(".volume_sort_li").on("click", function() {
		if(sortStatus!="qty"){
		sortStatus = "qty";
		ShopHistory.sortStatus = sortStatus;
		$(".is_load").css("display", "block");
		$(".tips").css("display", "none");
		$(this).siblings().css("color", "#252527");
		$(this).css("color", "#fa3022");
		var brandid = $scope.brandSession;
		$(".price_sort_li span").attr("class", "gray");
		page = 1;
		ShopHistory.page = page;
		var mySearch = {
			"datatype": datatype,
			"categoryid": s_id,
			"dictionaryid": "",
			"categoryno": s_no,
			"brandid": brandid,
			"key": SearchKey,
			"page": page,
			"pagesize": 10,
			"order": "qty",
			"by": 0,
			"groupid": groupid
		}
		var myShopListData = ShopListData(mySearch.datatype, mySearch.categoryid, mySearch.dictionaryid, mySearch.categoryno, mySearch.brandid, mySearch.key, mySearch.page, mySearch.pagesize, mySearch.order, mySearch.by, mySearch.groupid);
		if(IsSearch == true) {
			SearchService.listData(myShopListData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					$(".is_load").css("display", "none");
					
					reduce(res);
					shopScroll.scrollTo(0,0);
					ShopHistory.res.data.resources[0].items = $scope.goods;
				} else {
					alert(res.data.msg);
				}
			})
		} else {
			ShopListDataService.listData(myShopListData).then(function(res) {
				console.log(res);
				$(".is_load").css("display", "none");
				reduce(res);
				shopScroll.scrollTo(0,0);
				ShopHistory.res.data.resources[0].items = $scope.goods;
			})
		}
		}
	});

	//点击搜索框
	$(".search_div").on("click", function() {
		//搜索页点击返回判断参数
		SearchFlagShopList = true;
		//搜索返回判断参数
		SearchFlag = true;

	})

}])