define(['uiRouter', "swiper"], function() {
	var mineApp = angular.module('homeModule', ['ui.router'])

		.controller("homeCtlr", ["HomeDataService", "CategoryDataService", "$scope", "swiper", "$timeout", "$state", "UserService", "homeMescroll", function(HomeDataService, CategoryDataService, $scope, swiper, $timeout, $state, UserService, homeMescroll) {

			if(ka) {
				$(".tab_table1").css("display", "none");
				$(".tab_table2").css("display", "flex");
			} else {
				$(".tab_table2").css("display", "none");
				$(".tab_table1").css("display", "flex");
			};
			/*$(function(){
				$("img.lazy").lazyload({placeholder :"imgs/default2.jpg",effect: "fadeIn"});
			})*/
			
			var homeScroll;
			var meScroll;
			
			sessionStorage.setItem("datatype", "0");
			var homeTimer = $timeout(function() {
				homeLoaded();
				$(".home_box")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 0);

			HomeDataService.listData(myIndexData).then(function(res) {

				$scope.myData = res.data.resources;
				console.log($scope.myData);
				/*--轮播图--*/
				$scope.qtytotal = res.data.resources[0].qtytotal;
				$scope.items = res.data.resources[0].rollinads;
				/*--热门分类--*/
				if(res.data.resources[0].hg == undefined || res.data.resources[0].hg.length == 0) {
					$(".hot_category_box").css("display", "none");
				} else {
					$scope.hg = res.data.resources[0].hg;
				}
				/*--排行榜--*/
				$scope.solu = res.data.resources[0].solu;
				$scope.rank = $scope.solu;
				console.log($scope.rank);
				if($scope.rank.length == 2 || $scope.rank.length == 4) {
					
					$(".type_three").css("display", "none");
					$(".type_two").css("display", "block");
					$(".type_two li").css({
						"width": "50%",
						"float": "left"
					});
					$(".type_two li:odd").attr("class", "product_rank br");
					for(var i = 0; i < $scope.rank.length; i++) {
						var myLi = $(".type_two #product_rank").clone(true);
						$(myLi).removeAttr("id").attr("class", "product_rank");
						$(myLi).attr("data-title", $scope.rank[i].solutiontitle);
						$(myLi).attr("data-id", $scope.rank[i].solutionid);
						$(myLi).find("img").attr("data-original", $scope.rank[i].picurl);

						$(myLi).appendTo(".type_two");

					}
				} else {
					$(".type_two").css("display", "none");
					$(".type_three").css("display", "block");
					$(".type_three li:first-child").attr("class", "product_rank");
					var bodyWidth = $("body").width();
					console.log(bodyWidth);
					for(var i = 0; i < $scope.rank.length; i++) {
						var myLi = $(".type_three #product_rank").clone(true);
						$(myLi).removeAttr("id").attr("class", "product_rank");
						$(myLi).attr("data-title", $scope.rank[i].solutiontitle);
						$(myLi).attr("data-id", $scope.rank[i].solutionid);
						$(myLi).find("img").attr("data-original", $scope.rank[i].picurl);
						if(i == 0) {
							$(myLi).find("img").attr("src", "imgs/bDefault.jpg");
							$(myLi).height(bodyWidth / 2);

						} else if(i == 2) {
							$(myLi).find("img").attr("src", "imgs/sDefault.jpg");
							$(myLi).css("top", bodyWidth / 4);
							$(myLi).height(bodyWidth / 4);
						} else {
							$(myLi).find("img").attr("src", "imgs/sDefault.jpg");
							$(myLi).height(bodyWidth / 4);
						}

						$(myLi).appendTo(".type_three");

					}

				}
				$("img.lazy").lazyload({
					placeholder: "imgs/default2.jpg",
					effect: "fadeIn"
				});
				$timeout(function() {

					homeScroll.refresh();
					/*$(".rank").find("img").css("opacity","1");*/
				}, 200);
			})

			swiper.swiper();
			
			homeMescroll.mescroll(function(res,mescroll) {
				meScroll = mescroll;
				console.log(res);
				$scope.myData = res.data.resources;
				//console.log($scope.myData);
				//--轮播图--
				$scope.qtytotal = res.data.resources[0].qtytotal;
				$scope.items = res.data.resources[0].rollinads;
				//--热门分类--
				if(res.data.resources[0].hg == undefined || res.data.resources[0].hg.length == 0) {
					$(".hot_category_box").css("display", "none");
				} else {
					$scope.hg = res.data.resources[0].hg;

				}
				//--排行榜--
				$scope.solu = res.data.resources[0].solu;
				$scope.rank = $scope.solu;
				console.log($scope.rank);
				if($scope.rank.length == 2 || $scope.rank.length == 4) {
					console.log("222");
					$(".type_three").css("display", "none");
					$(".type_two").css("display", "block");
					var reduceLi = $(".type_two li.product_rank");
					$.each(reduceLi, function(index, obj) {
						if($(obj).attr("id") != "product_rank") {
							$(obj).remove();
						}
					})
					$(".type_two li").css({
						"width": "50%",
						"float": "left"
					});
					$(".type_two li:odd").attr("class", "product_rank br");
					for(var i = 0; i < $scope.rank.length; i++) {
						var myLi = $(".type_two #product_rank").clone(true);
						$(myLi).removeAttr("id").attr("class", "product_rank");
						$(myLi).attr("data-title", $scope.rank[i].solutiontitle);
						$(myLi).attr("data-id", $scope.rank[i].solutionid);
						$(myLi).find("img").attr("src", $scope.rank[i].picurl);
						$(myLi).appendTo(".type_two");
					}
				} else {
					$(".type_two").css("display", "none");
					$(".type_three").css("display", "block");
					var reduceLi = $(".type_three li.product_rank");
					$.each(reduceLi, function(index, obj) {
						if($(obj).attr("id") != "product_rank") {
							$(obj).remove();
						}
					})
					var bodyWidth = $("body").width();
					console.log(bodyWidth);
					$(".type_three li:first-child").attr("class", "product_rank");
					for(var i = 0; i < $scope.rank.length; i++) {
						var myLi = $(".type_three #product_rank").clone(true);
						$(myLi).removeAttr("id").attr("class", "product_rank");
						$(myLi).attr("data-title", $scope.rank[i].solutiontitle);
						$(myLi).attr("data-id", $scope.rank[i].solutionid);
						$(myLi).find("img").attr("src", $scope.rank[i].picurl);
						$(myLi).appendTo(".type_three");
					}
					$timeout(function() {
						$(".type_three li:nth-child(4)").css("top", $(".type_three li:nth-child(3)").height());
					}, 200);

				}
			});

			function homeLoaded() {
				var refresh_flag = false;
				var scrollStart = false;
				var y, y0, top, touchend_falg = false,
					start_y;
				homeScroll = new IScroll("#home", {
					preventDefault: false,
					probeType: 3,
					bounce: false
				});
				homeScroll.on("scrollStart", function() {
					scrollStart = true;

				})
				homeScroll.on("scroll", function() {
					
					 
					$("#home").trigger('scroll');
					if(-homeScroll.y / 150 < 0.9) {
						$(".search_bg").css("opacity", -homeScroll.y / 150);

						if(-homeScroll.y / 150 < 0.6) {
							$(".search_category_text").css("color", "white");
							$(".search_div").css("background", "rgba(243,243,243,0.8)");
							$(".search_div").css("color", "#B6B9C0");
						} else {
							$(".search_category_text").css("color", "#88898d");
							$(".search_div").css("background", "rgba(221, 221, 221,0.8)");
							$(".search_div").css("color", "white");
						}
					} else {
						$(".search_bg").css("opacity", "1");
					}

					y = homeScroll.y;

				});
				homeScroll.on("scrollEnd", function() {
					if(homeScroll.y==0){
						meScroll.lockDownScroll(false);
					}else{
						meScroll.lockDownScroll(true);
					}
					
					//搜索框变色
					if(-homeScroll.y / 150 < 0.9) {
						$(".search_bg").css("opacity", -homeScroll.y / 150);
					} else {
						$(".search_bg").css("opacity", "1");
					}
					if(-homeScroll.y / 150 < 0.6) {
						$(".search_category_text").css("color", "white");
						$(".search_div").css("background", "rgba(243,243,243,0.8)");
						$(".search_div").css("color", "#B6B9C0");
					} else {
						$(".search_category_text").css("color", "#88898d");
						$(".search_div").css("background", "rgba(221, 221, 221,0.8)");
						$(".search_div").css("color", "white");
					}

					console.log(homeScroll.y, touchend_falg);

					
				})
				
			}

			function isPassive() {
				var supportsPassiveOption = false;
				try {
					addEventListener("test", null, Object.defineProperty({}, 'passive', {
						get: function() {
							supportsPassiveOption = true;
						}
					}));
				} catch(e) {}
				return supportsPassiveOption;
			}

			$scope.ref = function() {
				$timeout(function() {
					homeScroll.refresh();
				}, 400);

				$timeout(function() {
					homeScroll.refresh();
				}, 3000);
				$timeout(function() {
					homeScroll.refresh();
				}, 10000);
			}

			/*--制服传参--*/
			/*$scope.uniform = function(){
				SearchKey =　"制服";
				$state.go("shop_list");
			}*/

			/*--专属商品传参--*/
			$(".menu").on("click", ".menu_list li:first-child", function() {
				SearchKey = 　"";
				IsSearch = false;
				//商品列表数据初始化
				ShopHistory = {
					scrollTop: 0,
					sortStatus: "",
					by: 0,
					brandid: "",
					brandText: "",
					page: 1,
					ch: true,
					res: ""
				}
				sessionStorage.setItem("datatype", "0");
				sessionStorage.setItem("groupid", "");
				sessionStorage.setItem("categoryid", "");
				sessionStorage.setItem("categoryno", "");
				$state.go("shop_list");
			});
			/*--非专属商品传参--*/
			$(".menu").on("click", ".menu_list li:nth-child(2)", function() {
				SearchKey = 　"";
				IsSearch = false;
				//商品列表数据初始化
				ShopHistory = {
					scrollTop: 0,
					sortStatus: "",
					by: 0,
					brandid: "",
					brandText: "",
					page: 1,
					ch: true,
					res: ""
				}
				sessionStorage.setItem("datatype", "1");
				sessionStorage.setItem("groupid", "");
				sessionStorage.setItem("categoryid", "");
				sessionStorage.setItem("categoryno", "");
				$state.go("shop_list");
			});

			/*--hot分类--*/
			$(".hot_category_list").on("click", "li", function() {
				var myId = $(this).attr("data-groupid");
				sessionStorage.setItem("datatype", "1");
				sessionStorage.setItem("groupid", myId);
				sessionStorage.setItem("categoryid", "");
				sessionStorage.setItem("categoryno", "");
				SearchKey = "";
				IsSearch = false;
				$state.go("shop_list");
			})

			$scope.cancel = function() {
				$(".home_search").css({
					'transform': 'translate3d(0,0,0)',
					'transition': 'all ' + 0 + 'ms',
				});
				$(".home_box").css({
					'transform': 'translate3d(0,0,0)',
					'transition': 'all ' + 0 + 'ms',
				});
				sessionStorage.setItem("datatype", "0");
			}

			$scope.change_yn = function() {
				if($scope.yn == true) {
					datatype = "1";
					$scope.yn = false;
					sessionStorage.setItem("datatype", "1");
				} else {
					datatype = "0";
					$scope.yn = true;
					sessionStorage.setItem("datatype", "0");
				}
			}

			$(".search_div_a").on("click", function() {
				SearchFlag = true;
			})

			//获取个人信息
			UserService.listData(myIndexData).then(function(res) {
				console.log(res);
				UserInfo = res.data.resources[0];
			});
			
			$scope.qrCode = function(){
				scanCode();
			}
			
		}])
});