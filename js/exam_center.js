app.controller("exam_centerCtlr", ["$scope", "$timeout", "swiper", "$state", "AuditordersService", "AppreturnsService", "OrderauditService", "OrderauditsService", "ReturnauditService", "ReturnauditsService", "ReturnorderService", function($scope, $timeout, swiper, $state, AuditordersService, AppreturnsService, OrderauditService, OrderauditsService, ReturnauditService, ReturnauditsService, ReturnorderService) {
	
	$(function(){
		
	
	$("textarea").attr("onKeypress", "javascript:if(event.keyCode == 32)event.returnValue = false;");
	$("textarea").attr("onkeyup", "this.value=this.value.replace(/^ +| +$/g,'')");
	/*----iscroll----*/
	var exam_centerScroll;
	//判断列表状态参数
	var all_sel = sessionStorage.getItem("examStatus");
	//清空修改订单数据
	ReviseDetails = "";
	//is_require确保每次获取到数据之后再进行第二次获取
	var is_require = true;
	var page = MyOrderPage;
	//搜索key
	var key = "";
	var all_sels = false;
	
	//勾选状态计数，当数量和section长度相等，则为全选
	var count = 0;

	function exam_centerLoaded() {
		exam_centerScroll = new IScroll(".exam_wrapper", {
			probeType: 3,
			preventDefault: false
		});
		exam_centerScroll.on("scroll", function() {
			if(parseInt(AllPage) > page&&is_require && exam_centerScroll.maxScrollY > exam_centerScroll.y) {
				is_require = false;
				page++;
				if(all_sel == "order") {
					myAuditordersData = AuditordersData(0, "", "", "", page, 10,"");
					AuditordersService.listData(myAuditordersData).then(function(res) {
						if(parseInt(AllPage)>page){
							$(".loadingmore").css("display","flex");
						}else{
							$(".loadingmore").css("display","none");
						}
						All_orders = All_orders.concat(res.data.resources[0].orders);
						console.log(All_orders);
						orderRender(res);
					})
				} else if(all_sel == "audited") {
					myAuditordersData = AuditordersData(1, "", "", "", page, 10, key);
					AuditordersService.listData(myAuditordersData).then(function(res) {
						if(parseInt(AllPage)>page){
							$(".loadingmore").css("display","flex");
						}else{
							$(".loadingmore").css("display","none");
						}
						All_orders = All_orders.concat(res.data.resources[0].orders);
						console.log(All_orders);
						auditedRender(res);
					})
				} else if(all_sel == "return") {
					var myAppreturnsData = AppreturnsData("", "", page, 10, "", "");
					AppreturnsService.listData(myAppreturnsData).then(function(res) {
						if(parseInt(AllPage)>page){
							$(".loadingmore").css("display","flex");
						}else{
							$(".loadingmore").css("display","none");
						}
						All_orders = All_orders.concat(res.data.resources[0].orders);
						console.log(All_orders);
						returnRender(res);
					})

				}
			}
		})
	}

	
	var exam_centerTimer = $timeout(function() {
		exam_centerLoaded();
		$(".exam")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
	}, 100);

	//获取数据参数变量
	var myAuditordersData;

	if(all_sel == null) {
		all_sel = "order";
		//初次获取订单审批数据
		myAuditordersData = AuditordersData(0, "", "", "", page, 10,"");
		console.log(JSON.stringify(myAuditordersData));
		AuditordersService.listData(myAuditordersData).then(function(res) {
			console.log(res);
			AllPage = res.data.resources[0].pages;
			if(parseInt(AllPage)>page){
				//console.log($(".loadingmore"));
				$(".loadingmore").css("display","flex");
			}else{
				$(".loadingmore").css("display","none");
			}
			console.log(res.data.resources[0].orders.length,res.data.resources[0].orders.length==0);
			if(res.data.resources[0].orders.length == 0) {
			
				$(".if_empty p").html("还没有订单记录喔！");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				$(".exam_foot_box").css("display", "none");
			} else {
				
				All_orders = All_orders.concat(res.data.resources[0].orders);
				orderRender(res);
			}

		});
	} else {
		var ress = {
			data: {
				resources: [{
					orders: All_orders
				}]
			}
		}
		
		if(all_sel == "order") {
			$(".exam_title_li").css({
				"color": "#111114",
				"border-bottom": "none"
			});
			$(".order").css({
				"color": "#f52f2c",
				"border-bottom": "2px solid #f52f2c"
			});
			$(".order2").css("display", "block");
			$(".return2").css("display", "none");
			$(".audited2").css("display", "none");
			if(All_orders.length == 0) {
				$(".loadingmore").css("display","none");
				$(".if_empty p").html("未找到相关订单！");
				$(".exam_foot_box").css("display", "none");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				$(".exam_body").css("paddingBottom","0");
			} else {
				$(".if_empty").css("display", "none");
				$(".searchComponent").css("display", "block");
				orderRender(ress);
				for(var j=0;j<SectionArr.length;j++){
					if($(SectionArr[j]).attr("class")=="edit_sel"){
						count += 1;
						$($(".order2 .exam_list_li")[j]).find("section").attr("class","edit_sel");
					}
				}
				if(count == SectionArr.length){
					$(".all_edit_nor").css("background-position", "-260px -83px")
				}
				$timeout(function() {
					
					if(parseInt(AllPage)>page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					exam_centerScroll.scrollTo(0, parseInt(MyOrderScrollTop));
					exam_centerScroll.refresh();
				}, 200);
			}
		} else if(all_sel == "audited") {
			$(".exam_title_li").css({
				"color": "#111114",
				"border-bottom": "none"
			});
			$(".audited").css({
				"color": "#f52f2c",
				"border-bottom": "2px solid #f52f2c"
			});
			$(".exam_foot_box").css("display","none");
			$(".exam_body").css("paddingBottom", "0");
			$(".order2").css("display", "none");
			$(".return2").css("display", "none");
			$(".audited2").css("display", "block");
			if(All_orders.length == 0) {
				$(".if_empty p").html("未找到相关订单！");
				$(".loadingmore").css("display","none");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				
			} else {
				$(".if_empty").css("display", "none");
				$(".searchComponent").css("display", "block");
				auditedRender(ress);
				$timeout(function() {
					if(parseInt(AllPage)>page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					exam_centerScroll.scrollTo(0, parseInt(MyOrderScrollTop));
					exam_centerScroll.refresh();
				}, 200);
			}
		} else if(all_sel == "return") {
			$(".exam_title_li").css({
				"color": "#111114",
				"border-bottom": "none"
			});
			$(".return").css({
				"color": "#f52f2c",
				"border-bottom": "2px solid #f52f2c"
			});
			$(".order2").css("display", "none");
			$(".return2").css("display", "block");
			$(".audited2").css("display", "none");
			if(All_orders.length == 0) {
				$(".if_empty p").html("未找到相关订单！");
				$(".loadingmore").css("display","none");
				$(".exam_foot_box").css("display", "none");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				$(".exam_body").css("paddingBottom", "0");
			} else {
				$(".if_empty").css("display", "none");
				$(".searchComponent").css("display", "block");
				returnRender(ress);
				for(var j=0;j<EmArr.length;j++){
					if($(EmArr[j]).attr("class")=="edit_sel"){
						count += 1;
						$($(".return2 .exam_list_li")[j]).find("em").attr("class","edit_sel");
					}
				}
				if(count == EmArr.length){
					$(".all_edit_nor").css("background-position", "-260px -83px")
				}
				$timeout(function() {
					
					if(parseInt(AllPage)>page){
						$(".loadingmore").css("display","flex");
					}else{
						$(".loadingmore").css("display","none");
					}
					exam_centerScroll.scrollTo(0, parseInt(MyOrderScrollTop));
					exam_centerScroll.refresh();
				}, 200);
			}
		}
	}

	/*返回上一步*/
	$scope.myBack = function() {
		window.history.go(-1);
	}
	/*$scope.imgArr=["../../imgs/hot_category/goods.jpg","../../imgs/hot_category/goods.jpg","../../imgs/hot_category/goods.jpg","../../imgs/hot_category/goods.jpg","../../imgs/hot_category/goods.jpg"];
	$scope.w = ($scope.imgArr.length)*80+20+"px";
	$scope.setWidth = function(e){
		console.log(e);
	}*/

	
	/*--获取数据--*/

	/*--点击搜索单号--*/
	$scope.cancel = function() {
		$(".exam").animate({
			left: "0"
		}, 500, function() {
			$(".exam").css("overflow", "hidden");
			$(".search").css("z-index", "100");

		});

	}
	/*$scope.is_search = function() {
		$(".exam").css("overflow", "visible");
		$(".search").css("z-index", "300");

		$(".exam").animate({
			left: "-100%"
		}, 500);
		SearchDataService.listData(mySearchData).then(function(res){
			console.log(res);
			$scope.hot = res.data.resources[0].hot;
			$scope.history = res.data.resources[0].history;
		})
		$(".clear_input").click(function() {
			$(".search_it").val("");
			$(".search_it").focus();
		})
	}*/

	//order订单列表数据渲染函数
	function orderRender(res) {
		$scope.goods = res.data.resources[0].orders;
		for(var j = 0; j < $scope.goods.length; j++) {
			var myLi = $(".order2 #exam_list_li").clone(true);
			$(myLi).removeAttr("id");
			$(myLi).attr("class", "exam_list_li");
			
			
			$(myLi).find(".order_number").html($scope.goods[j].billno);
			$(myLi).find(".order_status").html($scope.goods[j].statename);
			$(myLi).find(".order_number").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".shop_box").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".shop_box1").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".exam_list_foot").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".agree").attr("apid", $scope.goods[j].apid);
			$(myLi).find(".refuse").attr("apid", $scope.goods[j].apid);
			$(myLi).find("section").attr("apid", $scope.goods[j].apid);
			$(myLi).find(".revise").attr("data-index", j);
			if($scope.goods[j].details.length == 1) {
				$(myLi).find(".shop_box").css("display", "block");
				$(myLi).find(".shop_box1").css("display", "none");
				$(myLi).find(".shop_box .shop_pic img").attr("data-original", $scope.goods[j].details[0].littleurl);
				$(myLi).find(".shop_box .shop_title div").html($scope.goods[j].details[0].itemname);
			} else {
				$(myLi).find(".shop_box1").css("display", "block");
				$(myLi).find(".shop_box").css("display", "none");
				$.each($scope.goods[j].details, function(index, obj) {
					var mySwiperSlide = $("#swiper-slide").clone(true);
					$(mySwiperSlide).removeAttr("id");
					$(mySwiperSlide).attr("class", "swiper-slide");
					$(mySwiperSlide).find("img").attr("data-original", obj.littleurl);
					
					$(mySwiperSlide).appendTo($(myLi).find(".swiper-wrapper"));
				})
			}

			$(myLi).find(".all_count").html($scope.goods[j].totalqty);
			$(myLi).find(".true_pay").html($scope.goods[j].totalfee);
			$(myLi).appendTo(".order2");
		}
		$("img.lazy").lazyload({effect: "fadeIn"});
		$timeout(function() {
			
			exam_centerScroll.refresh();
			is_require = true;
		}, 200);
	}

	//audited已审订单数据渲染函数
	function auditedRender(res) {

		$scope.goods = res.data.resources[0].orders;

		for(var j = 0; j < $scope.goods.length; j++) {
			var myLi = $(".audited2 #exam_list_li").clone(true);
			$(myLi).removeAttr("id");
			$(myLi).attr("class", "exam_list_li");
			$(myLi).find(".order_number").html($scope.goods[j].billno);
			$(myLi).find(".order_status").html($scope.goods[j].statename);
			$(myLi).find(".order_number").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".shop_box").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".shop_box1").attr("orderno", $scope.goods[j].orderno);
			$(myLi).find(".exam_list_foot").attr("orderno", $scope.goods[j].orderno);
			if($scope.goods[j].details.length == 1) {
				$(myLi).find(".shop_box").css("display", "block");
				$(myLi).find(".shop_box1").css("display", "none");
				$(myLi).find(".shop_box .shop_pic img").attr("data-original", $scope.goods[j].details[0].littleurl);
				$(myLi).find(".shop_box .shop_title div").html($scope.goods[j].details[0].itemname);
			} else {
				$(myLi).find(".shop_box1").css("display", "block");
				$(myLi).find(".shop_box").css("display", "none");
				$.each($scope.goods[j].details, function(index, obj) {
					var mySwiperSlide = $("#swiper-slide").clone(true);
					$(mySwiperSlide).removeAttr("id");
					$(mySwiperSlide).attr("class", "swiper-slide");
					$(mySwiperSlide).find("img").attr("data-original", obj.littleurl);
					
					$(mySwiperSlide).appendTo($(myLi).find(".swiper-wrapper"));
				})
			}
			$(myLi).find(".all_count").html($scope.goods[j].totalqty);
			$(myLi).find(".true_pay").html($scope.goods[j].totalfee);
			$(myLi).appendTo(".audited2");
		}
		$("img.lazy").lazyload({effect: "fadeIn"});
		$timeout(function() {
			exam_centerScroll.refresh();
			is_require = true;
		}, 200);
	}

	//return退货审批数据渲染函数
	function returnRender(res) {

		$scope.goods = res.data.resources[0].orders;

		for(var j = 0; j < $scope.goods.length; j++) {
			var myLi = $(".return2 #exam_list_li").clone(true);
			$(myLi).removeAttr("id");
			$(myLi).attr("class", "exam_list_li");
			//console.log($scope.goods[j].statename,$scope.goods[j].statename=="已作废");
			if($scope.goods[j].statename=="已作废"){
				$(myLi).find("em").detach();
				$(myLi).find(".exam_fn").detach();
				$(myLi).find(".exam_list_head").css("padding-left","20px");
			}
			$(myLi).find(".order_number").html($scope.goods[j].billno);
			$(myLi).find(".order_status").html($scope.goods[j].statename);
			$(myLi).find(".order_number").attr("returnno", $scope.goods[j].returnno);
			$(myLi).find(".shop_box").attr("returnno", $scope.goods[j].returnno);
			$(myLi).find(".shop_box1").attr("returnno", $scope.goods[j].returnno);
			$(myLi).find(".exam_list_foot").attr("returnno", $scope.goods[j].returnno);
			$(myLi).find(".agree").attr("apid", $scope.goods[j].apid);
			$(myLi).find(".refuse").attr("apid", $scope.goods[j].apid);
			$(myLi).find("em").attr("apid", $scope.goods[j].apid);
			if($scope.goods[j].detail.length == 1) {
				$(myLi).find(".shop_box").css("display", "block");
				$(myLi).find(".shop_box1").css("display", "none");
				$(myLi).find(".shop_box .shop_pic img").attr("data-original", $scope.goods[j].detail[0].littleurl);
				$(myLi).find(".shop_box .shop_title div").html($scope.goods[j].detail[0].itemname);
			} else {
				$(myLi).find(".shop_box1").css("display", "block");
				$(myLi).find(".shop_box").css("display", "none");
				$.each($scope.goods[j].detail, function(index, obj) {
					var mySwiperSlide = $("#swiper-slide").clone(true);
					$(mySwiperSlide).removeAttr("id");
					$(mySwiperSlide).attr("class", "swiper-slide");
					$(mySwiperSlide).find("img").attr("data-original", obj.littleurl);
					
					$(mySwiperSlide).appendTo($(myLi).find(".swiper-wrapper"));
				})
			}
			$(myLi).find(".all_count").html($scope.goods[j].totalqty);
			$(myLi).find(".true_pay").html($scope.goods[j].totalfee);
			$(myLi).appendTo(".return2");
		}
		$("img.lazy").lazyload({effect: "fadeIn"});
		$timeout(function() {
			exam_centerScroll.refresh();
			is_require = true;
		}, 200);
	}

	//order订单审批状态处理函数
	function orderStatus() {

		$(".exam_title_li").css({
			"color": "#111114",
			"border-bottom": "none"
		});
		$(".order").css({
			"color": "#f52f2c",
			"border-bottom": "2px solid #f52f2c"
		});
		$(".order2").css("display", "block");
		$(".return2").css("display", "none");
		$(".audited2").css("display", "none");
		myAuditordersData = AuditordersData(0, "", "", "", 1, 10,"");
		AuditordersService.listData(myAuditordersData).then(function(res) {
			console.log(res);
			All_orders = All_orders.concat(res.data.resources[0].orders);
			$(".is_load").css("display", "none");
			$(".order2 .exam_list_li").remove();
			if(res.data.resources[0].orders.length == 0) {
				$(".if_empty p").html("未找到相关订单！");
				$(".exam_foot_box").css("display", "none");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				$(".exam_body").css("paddingBottom", "0");
			} else {
				$(".exam_body").css("paddingBottom", "50px");
				$(".if_empty").css("display", "none");
				$(".exam_foot_box").css("display", "block");
				orderRender(res);
			}

		});
	}
	//audited已审订单状态处理函数
	function auditedStatus() {

		$(".exam_body").css("paddingBottom", "0");
		$(".exam_foot_box").css("display", "none");
		$(".exam_title_li").css({
			"color": "#111114",
			"border-bottom": "none"
		});
		$(".audited").css({
			"color": "#f52f2c",
			"border-bottom": "2px solid #f52f2c"
		});
		$(".order2").css("display", "none");
		$(".return2").css("display", "none");
		$(".audited2").css("display", "block");
		myAuditordersData = AuditordersData(1, "", "", "", 1, 10, "");
		AuditordersService.listData(myAuditordersData).then(function(res) {
			console.log(res);
			All_orders = All_orders.concat(res.data.resources[0].orders);
			$(".is_load").css("display", "none");
			$(".audited2 .exam_list_li").remove();
			if(res.data.resources[0].orders.length == 0) {
				
				$(".if_empty p").html("还没有订单记录喔！");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");

			} else {
				$(".if_empty").css("display", "none");
				$(".searchComponent").css("display", "block");
				auditedRender(res);
			}
		});
	}

	//return退货审批状态处理函数
	function returnStatus() {
		$(".searchComponent").css("display", "none");
		$(".return2 .exam_list_li").remove();
		$(".exam_title_li").css({
			"color": "#111114",
			"border-bottom": "none"
		});
		$(".return").css({
			"color": "#f52f2c",
			"border-bottom": "2px solid #f52f2c"
		});
		$(".order2").css("display", "none");
		$(".return2").css("display", "block");
		$(".audited2").css("display", "none");
		var myAppreturnsData = AppreturnsData("", "", 1, 10, "", "");
		AppreturnsService.listData(myAppreturnsData).then(function(res) {
			console.log(res);
			All_orders = All_orders.concat(res.data.resources[0].orders);
			$(".is_load").css("display", "none");
			if(res.data.resources[0].orders.length == 0) {
				$(".if_empty p").html("还没有订单记录喔！");
				$(".exam_order_list").css("display", "none");
				$(".if_empty").css("display", "block");
				$(".exam_foot_box").css("display", "none");
				$(".exam_body").css("paddingBottom", "0");
			} else {
				$(".exam_body").css("paddingBottom", "50px");
				$(".if_empty").css("display", "none");
				$(".exam_foot_box").css("display", "block");
				returnRender(res);
			}
		});
	}

	//订单审批
	$(".order").on("click", function() {
		if(all_sel != "order") {
			All_orders = [];
			$(".exam .all_edit_nor").css("background-position", "-442px -289px");
			$(".is_load").css("display", "block");
			all_sel = "order";
			page = 1;
			orderStatus();
			exam_centerScroll.refresh();
			exam_centerScroll.scrollTo(0, 0);
		}
	});

	/*--已审订单--*/
	$(".audited").on("click", function() {
		if(all_sel != "audited") {
			All_orders = [];
			key = "";
			$(".is_load").css("display", "block");
			all_sel = "audited";
			page = 1;
			auditedStatus();
			exam_centerScroll.refresh();
			exam_centerScroll.scrollTo(0, 0);
		}
	})

	/*--退货审批--*/
	$(".return").on("click", function() {
		if(all_sel != "return") {
			All_orders = [];
			$(".exam .all_edit_nor").css("background-position", "-442px -289px");
			$(".is_load").css("display", "block");
			all_sel = "return";
			page = 1;
			returnStatus();
			exam_centerScroll.refresh();
			exam_centerScroll.scrollTo(0, 0);
		}
	})

	var act, resion, apid;
	/*--点击同意--*/
	$(".exam_body_box").on("click", ".agree", function() {
		$(".mask_confirm .txt").html("确定要同意审批订单吗？");
		$(".mask_confirm").css("display", "block");
		act = "1";
		resion = "";
		all_sels = false;
		apid = $(this).attr("apid");
	});
	//全部同意
	$(".allAgree").on("click", function() {
		$(".mask_confirm .txt").html("确定要同意审批所有订单吗？");
		$(".mask_confirm").css("display", "block");
		act = "1";
		resion = "";
		all_sels = true;
		apid = [];
		if(all_sel == "order") {
			$.each($("section.edit_sel"), function(index, obj) {
				var ap = $(obj).attr("apid");
				apid.push(ap);
			});
		} else {
			console.log($("em.edit_sel"));
			$.each($("em.edit_sel"), function(index, obj) {
				var ap = $(obj).attr("apid");
				apid.push(ap);
			});
		}
		apid = apid.join(",");
		console.log(apid);
	})

	/*--点击拒绝--*/
	$(".exam_body_box").on("click", ".refuse", function() {
		$("textarea").val("");
		$(".refuse_mask").css("display", "block");
		$(".refuse_window").animate({
			bottom: "0"
		}, 300);
		act = "0";
		all_sels = false;
		apid = $(this).attr("apid");
	})
	//全部拒绝
	$(".allRefuse").on("click", function() {
		$("textarea").val("");
		$(".refuse_mask").css("display", "block");
		$(".refuse_window").animate({
			bottom: "0"
		}, 300);
		act = "0";
		apid = [];
		all_sels = true;
		if(all_sel == "order") {
			$.each($("section.edit_sel"), function(index, obj) {
				var ap = $(obj).attr("apid");
				apid.push(ap);
			});
		} else {
			$.each($("em.edit_sel"), function(index, obj) {
				var ap = $(obj).attr("apid");
				apid.push(ap);
			});
		}
		apid = apid.join(",");
		console.log(apid);
	})
	$(".cc").on("click", function() {
		$(".refuse_window").animate({
			bottom: "-230px"
		}, 300, function() {
			$(".refuse_mask").css("display", "none");
		});
	})
	$(".refuse_mask").on("click", function() {
		$(".refuse_window").animate({
			bottom: "-230px"
		}, 300, function() {
			$(".refuse_mask").css("display", "none");
		});
	})
	$(".refuse_submit").on("click", function() {
		resion = $("textarea").val();
		$(".refuse_window").animate({
			bottom: "-230px"
		}, 200, function() {
			$(".refuse_mask").css("display", "none");
			$(".mask_confirm .txt").html("确定要拒绝审批订单吗？");
			$(".mask_confirm").css("display", "block");
		});
	});
	//确认按钮
	$timeout(function() {
		$(".mask_confirm .yes").on("click", function() {
			$(".mask_confirm").css("display", "none");
			$(".is_load").css("display", "block");

			var myOrderauditData = OrderauditData(act, resion, apid);
			console.log(myOrderauditData);
			if(all_sel == "order") {
				if(all_sels == true) {
					OrderauditsService.listData(myOrderauditData).then(function(res) {
						console.log(res);
						$(".exam .all_edit_nor").css("background-position", "-442px -289px");
						if(res.data.error == 0) {
							$(".is_load").css("display", "none");

							orderStatus();

							$(".prompt_success .txt").html("订单审批成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
							}, 1000);
						} else {
							$(".is_load").css("display", "none");
							console.log(res.config.data);
							alert(res.data.msg);
						}
					})
				} else {
					OrderauditService.listData(myOrderauditData).then(function(res) {
						console.log(res);
						$(".exam .all_edit_nor").css("background-position", "-442px -289px");
						if(res.data.error == 0) {
							$(".is_load").css("display", "none");

							orderStatus();

							$(".prompt_success .txt").html("订单审批成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
							}, 1000);
						} else {
							$(".is_load").css("display", "none");
							console.log(res.config.data);
							alert(res.data.msg);
						}
					})
				}
			} else {
				if(all_sels == true) {
					ReturnauditsService.listData(myOrderauditData).then(function(res) {
						console.log(res);
						$(".exam .all_edit_nor").css("background-position", "-442px -289px");
						if(res.data.error == 0) {
							$(".is_load").css("display", "none");

							returnStatus();

							$(".prompt_success .txt").html("订单审批成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
							}, 1000);
						} else {
							$(".is_load").css("display", "none");
							console.log(res.config.data);
							alert(res.data.msg);
						}
					})
				} else {
					ReturnauditService.listData(myOrderauditData).then(function(res) {
						console.log(res);
						$(".exam .all_edit_nor").css("background-position", "-442px -289px");
						if(res.data.error == 0) {
							$(".is_load").css("display", "none");
							
							returnStatus();

							$(".prompt_success .txt").html("订单审批成功");
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
							}, 1000);
						} else {
							$(".is_load").css("display", "none");
							console.log(res.config.data);
							alert(res.data.msg);
						}
					})
				}
			}
		});
		$(".mask_confirm .no").on("click", function() {
			$(".is_load").css("display", "none");
			$(".mask_confirm").css("display", "none");
		});
	}, 200);

	/*--点击修改--*/
	$(".exam_body_box").on("click", ".revise", function() {
		SectionArr = $(".order2 .exam_list_li section");
		EmArr = $(".return2 .exam_list_li em");
		ReviseDetails = $scope.goods[$(this).attr("data-index")];
		console.log(ReviseDetails, $scope.goods, $(this).attr("data-index"));
		//sessionStorage.setItem("goods",JSON.stringify(ReviseDetails));
		sessionStorage.setItem("examScrollY", exam_centerScroll.y);
		$state.go("revise_order");
	})

	//单个点击选中
	$timeout(function(){
	$(".exam_body_box").on("click","section",function(){
		if($(this).attr("class") == "edit_nor") {
			$(this).attr("class", "edit_sel");
			console.log($("section.edit_nor"));
			
			if($(".exam_list_li section.edit_nor").length == 0) {
				$(".all_edit_nor").css("background-position", "-260px -83px");
			}
			
		} else {
			$(this).attr("class", "edit_nor");
			$(".all_edit_nor").css("background-position", "-442px -289px");

		}
	});
	$(".exam_body_box").on("click","em",function(){
		if($(this).attr("class") == "edit_nor") {
			$(this).attr("class", "edit_sel");
			console.log($("em.edit_nor"));
			
				if($(".exam_list_li em.edit_nor").length == 0) {
					$(".all_edit_nor").css("background-position", "-260px -83px");
				}
			
		} else {
			$(this).attr("class", "edit_nor");
			$(".all_edit_nor").css("background-position", "-442px -289px");

		}
	})
	},0);
	/*--全选--*/
	$(".all_edit_nor").on("click", function() {
		if($(this).css("background-position") == "-260px -83px") {
			$(this).css("background-position", "-442px -289px");
			if(all_sel == "order") {
				$(".exam_list_li section").attr("class", "edit_nor");
			} else {
				$(".exam_list_li em").attr("class", "edit_nor");
			}
		} else {
			$(this).css("background-position", "-260px -83px");
			if(all_sel == "order") {
				$(".exam_list_li section").attr("class", "edit_sel");

			} else {
				$(".exam_list_li em").attr("class", "edit_sel");

			}
		}
	})

	$scope.mask = function() {
		$(".search_it").val("");
		$(".maskBlack").css("display", "none");
		$(".search_go").css("display", "none");
		$(".search_input input").attr("placeholder", "");
		$(".exam_right").css({
			'width': '20%',
			'transition': 'all 300ms'
		});
	}

	$scope.is_search = function() {
		$(".maskBlack").css("display", "block");
		$(".exam_right").css({
			'width': '97%',
			'transition': 'all 300ms'
		});
		$timeout(function() {
			$(".search_input input").attr("placeholder", "商品名称/商品编号/订单号");
			$(".search_go").css("display", "block");
			$(".search_it").val(key);
		}, 300);
	}

	//判断手指左右滑动,左右滑动时允许浏览器默认事件，上下滑动时禁用浏览器默认事件；
			$timeout(function(){
				var startX, startY, moveEndX, moveEndY, X, Y;
			    $(".myOrder_wrapper").on("touchstart", function(e) {
			        startX = e.originalEvent.changedTouches[0].pageX,
			        startY = e.originalEvent.changedTouches[0].pageY;
			        touchflag = true;
			    });
			    $(".myOrder_wrapper").on("touchmove", function(e) {
			    	if(touchflag){
			    		touchflag = false;
			        moveEndX = e.originalEvent.changedTouches[0].pageX,
			        moveEndY = e.originalEvent.changedTouches[0].pageY,
			        X = moveEndX - startX,
			        Y = moveEndY - startY;
			 		console.log(X,Y);
			        if ( Math.abs(X) > Math.abs(Y) && X > 0||Math.abs(X) > Math.abs(Y) && X < 0 ) {
			            
						console.log("开");
						document.removeEventListener("touchmove",prevent,false);
						
			        }else if(Math.abs(X) <= Math.abs(Y) && X > 0||Math.abs(X) <= Math.abs(Y) && X < 0){
			        	
						document.addEventListener('touchmove',
							prevent
							, isPassive() ? {
								capture: false,
								passive: false
							} : false);
						
						
					}
			       }
			    });
			    $("myOrder_wrapper").on("touchend", function(e) {
			    	
					document.addEventListener('touchmove',
							prevent
							, isPassive() ? {
								capture: false,
								passive: false
							} : false);
			    });
			},300);

	//点击订单，图片，价格查看订单详情
	$(".exam_body_box").on("click", ".order_number", function() {
		$(".is_load").css("display", "block");
		if(all_sel == "order" || all_sel == "audited") {
			var orderno = $(this).attr("orderno");
			console.log(orderno);
			var obj = {
				orderno: orderno,
				packageid: ""
			}
			if(all_sel == "order") {
				SectionArr = $(".order2 .exam_list_li section");
			}
			sessionStorage.setItem("orderDetailData", JSON.stringify(obj));
			sessionStorage.setItem("examStatus", all_sel);
			$state.go("look_order");
		} else {
			/*--点击查看退单详情--*/
			//Order_index = $(this).attr("order-index");
			//Package_index = $(this).attr("package-index");
			EmArr = $(".return2 .exam_list_li em");
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			var returnno = $(this).attr("returnno");
			var myCancelreturnData = CancelreturnData(returnno);
			ReturnorderService.listData(myCancelreturnData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					sessionStorage.setItem("examStatus", all_sel);
					ReturnDetail = res.data.resources[0];
					$(".is_load").css("display", "none");
					$state.go("returnOrderDetail");
				} else {
					alert(res.data.msg);
				}
			})
		}
	});

	/*$(".return_progress_list").on("click", ".shop_list", function() {
		//Order_index = $(this).attr("order-index");
		//Package_index = $(this).attr("package-index");
		//MyOrderScrollTop = myOrderScroll.y;
		MyOrderPage = page;
		MyOrderScrollTop = exam_centerScroll.y;
		sessionStorage.setItem("returnStatus", returnStatus);
		var returnno = $(this).attr("returnno");
		var myCancelreturnData = CancelreturnData(returnno);
		ReturnorderService.listData(myCancelreturnData).then(function(res) {
			console.log(res);
			if(res.data.error == 0) {
				ReturnDetail = res.data.resources[0];
				$(".is_load").css("display", "none");
				$state.go("returnOrderDetail");
			} else {
				alert(res.data.msg);
			}
		})
	});*/

	$(".exam_body_box").on("click", ".shop_box", function() {
		$(".is_load").css("display", "block");
		if(all_sel == "order" || all_sel == "audited") {
			var orderno = $(this).attr("orderno");
			var obj = {
				orderno: orderno,
				packageid: ""
			}
			if(all_sel == "order") {
				SectionArr = $(".order2 .exam_list_li section");
			}
			
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			sessionStorage.setItem("orderDetailData", JSON.stringify(obj));
			sessionStorage.setItem("examStatus", all_sel);
			$state.go("look_order");
		} else {
			/*--点击查看退单详情--*/
			//Order_index = $(this).attr("order-index");
			//Package_index = $(this).attr("package-index");
			//MyOrderScrollTop = myOrderScroll.y;
			EmArr = $(".return2 .exam_list_li em");
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			var returnno = $(this).attr("returnno");
			var myCancelreturnData = CancelreturnData(returnno);
			ReturnorderService.listData(myCancelreturnData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					sessionStorage.setItem("examStatus", all_sel);
					ReturnDetail = res.data.resources[0];
					$(".is_load").css("display", "none");
					$state.go("returnOrderDetail");
				} else {
					alert(res.data.msg);
				}
			})
		}
	});
	$(".exam_body_box").on("click", ".shop_box1", function() {
		$(".is_load").css("display", "block");
		if(all_sel == "order" || all_sel == "audited") {
			var orderno = $(this).attr("orderno");
			var obj = {
				orderno: orderno,
				packageid: ""
			}
			if(all_sel == "order") {
				SectionArr = $(".order2 .exam_list_li section");
			}
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			sessionStorage.setItem("orderDetailData", JSON.stringify(obj));
			sessionStorage.setItem("examStatus", all_sel);
			$state.go("look_order");
		} else {
			/*--点击查看退单详情--*/
			//Order_index = $(this).attr("order-index");
			//Package_index = $(this).attr("package-index");
			//MyOrderScrollTop = myOrderScroll.y;
			EmArr = $(".return2 .exam_list_li em");
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			var returnno = $(this).attr("returnno");
			var myCancelreturnData = CancelreturnData(returnno);
			ReturnorderService.listData(myCancelreturnData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					sessionStorage.setItem("examStatus", all_sel);
					ReturnDetail = res.data.resources[0];
					$(".is_load").css("display", "none");
					$state.go("returnOrderDetail");
				} else {
					alert(res.data.msg);
				}
			})
		}
	});
	$(".exam_body_box").on("click", ".exam_list_foot", function() {
		$(".is_load").css("display", "block");
		if(all_sel == "order" || all_sel == "audited") {
			var orderno = $(this).attr("orderno");
			var obj = {
				orderno: orderno,
				packageid: ""
			}
			if(all_sel == "order") {
				SectionArr = $(".order2 .exam_list_li section");
			}
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			sessionStorage.setItem("orderDetailData", JSON.stringify(obj));
			sessionStorage.setItem("examStatus", all_sel);
			$state.go("look_order");
		} else {
			/*--点击查看退单详情--*/
			//Order_index = $(this).attr("order-index");
			//Package_index = $(this).attr("package-index");
			//MyOrderScrollTop = myOrderScroll.y;
			EmArr = $(".return2 .exam_list_li em");
			MyOrderPage = page;
			MyOrderScrollTop = exam_centerScroll.y;
			var returnno = $(this).attr("returnno");
			var myCancelreturnData = CancelreturnData(returnno);
			ReturnorderService.listData(myCancelreturnData).then(function(res) {
				console.log(res);
				if(res.data.error == 0) {
					sessionStorage.setItem("examStatus", all_sel);
					ReturnDetail = res.data.resources[0];
					$(".is_load").css("display", "none");
					$state.go("returnOrderDetail");
				} else {
					alert(res.data.msg);
				}
			})
		}
	});

	//搜索订单
	$scope.sou = function() {
		key = $(".search_it").val();
		if(key.length != 0) {
			$(".is_load").css("display","block");
			$(".exam_right").css({
				'width': '20%',
				'transition': 'all 300ms'
			});
			$timeout(function() {
				$(".maskBlack").css("display", "none");
				$(".search_go").css("display", "none");
				$(".search_input input").attr("placeholder", "");
			}, 100);

			myAuditordersData = AuditordersData(1, "", "", "", 1, 10, key);
			AuditordersService.listData(myAuditordersData).then(function(res) {
				console.log(res);
				$(".search_it").val("");
				if(res.data.error == 0) {
					$(".is_load").css("display", "none");
					$(".audited2 .exam_list_li").remove();
					if(res.data.resources[0].orders.length == 0) {
						$(".if_empty p").html("还没有订单记录喔！");
						$(".exam_order_list").css("display", "none");
						$(".if_empty").css("display", "block");
					} else {
						$(".if_empty").css("display", "none");
						$(".searchComponent").css("display", "block");
						auditedRender(res);
						exam_centerScroll.scrollTo(0, 0);
					}
				} else {
					alert(res.data.msg);
				}
			})
		}
	}
	})

}])