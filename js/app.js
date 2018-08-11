define(["home", "scroll_prode"], function() {
	console.log("app启动");
	app = angular.module("myModule", ["homeModule", "oc.lazyLoad", "me-lazyload"])
		.service("time", function() {
			this.picker = function() {
				var calendar = new datePicker();
				calendar.init({
					'trigger': '#term',
					/*按钮选择器，用于触发弹出插件*/
					'type': 'date',
					/*模式：date日期；datetime日期时间；time时间；ym年月；*/
					'minDate': '1900-1-1',
					/*最小日期*/
					'maxDate': '2100-12-31',
					/*最大日期*/
					'onSubmit': function() { /*确认时触发事件*/
						var theSelectData = calendar.value;
					},
					'onClose': function() { /*取消时触发事件*/ }
				});
			}
		})
		.directive("findpasswordtitle", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/findPasswordTitle/findPasswordTitle.html"
			};
		})
		.directive("ysj", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/ysj/ysj.html"
			}
		})
		/*--地区选择--*/
		.directive("place", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/place/place.html"
			}
		})
		/*--成本中心选择--*/
		.directive("costcenter", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/cost_center/cost_center.html"
			}
		})
		/*--订单详情查看物流--*/
		.directive("orderfollow", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/order_follow/order_follow.html"
			}
		})
		/*--搜索页面--*/
		.directive("searchpage", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/searchPage/searchPage.html"
			}
		})
		/*--确认弹框--*/
		.directive("confirm", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/confirm/confirm.html"
			}
		})
		/*--成功弹框--*/
		.directive("prompt", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/prompt/prompt.html"
			}
		})
		/*--回到顶部--*/
		.directive("totop", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/to_top/to_top.html"
			}
		})
		/*--页码弹框--*/
		.directive("pageprompt", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/page_prompt/page_prompt.html"
			}
		})
		/*--如果为空--*/
		.directive("ifempty", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/if_empty/if_empty.html"
			}
		})
		//右侧搜索组件
		.directive("searchcomponent", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/searchComponent/searchComponent.html"
			}
		})
		//加载中动画
		.directive("loading", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/loading/loading.html"
			}
		})
		//蒙版遮罩
		.directive("mask", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/mask/mask.html"
			}
		})
		//上拉加载更多
		.directive("loadingmore", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/loadingMore/loadingMore.html"
			}
		})
		//没有更多
		.directive("nomore", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/nomore/nomore.html"
			}
		})
		//图片点击放大
		.directive("magnifier", function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/magnifier/magnifier.html"
			}
		})
		/*--repeat完成即执行指令--*/
		.directive('repeatFinish', function() {
			return {
				link: function(scope, element, attr) {
					//console.log(scope.$index)
					if(scope.$last == true) {
						console.log('ng-repeat执行完毕')
						scope.$eval(attr.repeatFinish)
					}
				}
			}
		})
		.directive('tabbar', function() {
			return {
				restrict: "E",
				replace: true,
				templateUrl: "Views/tabbar/tabbar.html"
			}
		})
		.service("swiper", ["$timeout", function($timeout) {
			this.swiper = function() {
				$timeout(function() {
					var mySwiper = new Swiper('.swiper-container', {
						autoplay: 2500,
						observer: true,
						observeParents: true,
						autoplayDisableOnInteraction: false,
						loop: true,
						// 如果需要分页器
						pagination: '.swiper-pagination',
					})
				}, 100)
			}
		}])
		.service("homeMescroll", ["$timeout","HomeDataService", function($timeout,HomeDataService) {
			this.mescroll = function(successCallback) {
				$timeout(function() {
					var mescroll = new initMeScroll(70,"home", {
						down: {
							auto: true, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
							callback: downCallback //下拉刷新的回调
						}
						/*,
						up: {
							auto: true, //初始化完毕,是否自动触发上拉加载的回调
							isBoth: true, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
							callback: upCallback, //上拉加载的回调
							toTop: { //配置回到顶部按钮
								src: "", //默认滚动到1000px显示,可配置offset修改
								//offset : 1000
							}
						}*/
					});

					function downCallback() {
						HomeDataService.listData(myIndexData).then(function(res) {
							console.log("下拉刷新成功",res);
							if(res.data.error==0){
								$(".downwarp-txt").html("刷新成功");
								$(".ok").attr("src","imgs/ok.png");
								successCallback(res,mescroll);
							}
							var time = setTimeout(function(){
								mescroll.endSuccess(); 
								clearTimeout(time);
							},1000);
							},function(res){
								$(".downwarp-txt").html(res.data.msg);
								var time = setTimeout(function(){
									mescroll.endErr();
									clearTimeout(time);
								},1000);
						})
					}
				}, 100)
			}
		}])
		.service("CartMescroll", ["$timeout","CartDataService", function($timeout,CartDataService) {
			this.mescroll = function(successCallback) {
				$timeout(function() {
					var mescroll = new initMeScroll(50,"cart", {
						down: {
							auto: true, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
							callback: downCallback //下拉刷新的回调
						}
						/*,
						up: {
							auto: true, //初始化完毕,是否自动触发上拉加载的回调
							isBoth: true, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
							callback: upCallback, //上拉加载的回调
							toTop: { //配置回到顶部按钮
								src: "", //默认滚动到1000px显示,可配置offset修改
								//offset : 1000
							}
						}*/
					});
					function downCallback() {
						CartDataService.listData(myCartData).then(function(res) {
							console.log("下拉刷新成功",res);
							if(res.data.error==0){
								$(".downwarp-txt").html("刷新成功");
								$(".ok").attr("src","imgs/ok.png");
								successCallback(res,mescroll);
							}
							var time = setTimeout(function(){
								mescroll.endSuccess(); 
								clearTimeout(time);
							},1000);
							},function(res){
								$(".downwarp-txt").html(res.data.msg);
								var time = setTimeout(function(){
									mescroll.endErr();
									clearTimeout(time);
								},1000);
						})
					}
				}, 100)
			}
		}])
		
		/*--home--*/
		.service("HomeDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/index?l=" + Math.random(), data)
			}
		})
		.service("CategoryDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/itemclass?l=" + Math.random(), data)
			}
		})
		/*--商品列表--*/
		.service("ShopListDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/items?l=" + Math.random(), data)
			}
		})
		/*--详情页--*/
		.service("DetailDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/item?l=" + Math.random(), data)
			}
		})
		/*--购物车进入获取数据--*/
		.service("CartDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/cart?l=" + Math.random(), data)
			}
		})
		/*--搜索页:热门搜索，历史搜索--*/
		.service("SearchDataService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/getsclick?l=" + Math.random(), data)
			}
		})
		/*--筛选排序--*/
		.service("SearchService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/search?l=" + Math.random(), data)
			}
		})
		/*--购物车勾选--*/
		.service("CartEditService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/cartedit?l=" + Math.random(), data)
			}
		})
		/*--购物车数量--*/
		.service("AddCartService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/addcart?l=" + Math.random(), data)
			}
		})
		/*--收藏--*/
		.service("CollectService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/editfavortes?l=" + Math.random(), data)
			}
		})
		/*--去结算--*/
		.service("OrderSubmitService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/ordersubmit?l=" + Math.random(), data)
			}
		})
		/*--订单提交--*/
		.service("SettlementService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/settlement?l=" + Math.random(), data)
			}
		})
		/*--配送信息--*/
		.service("DeliveryService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/delivery?l=" + Math.random(), data)
			}
		})
		/*--地址信息--*/
		.service("AddressService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/address?l=" + Math.random(), data)
			}
		})
		/*--地址编辑--*/
		.service("EditaddrService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/editaddr?l=" + Math.random(), data)
			}
		})
		/*--地区选择--*/
		.service("AreaService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/area?l=" + Math.random(), data)
			}
		})
		/*--成本中心--*/
		.service("OrganizesService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/organizes?l=" + Math.random(), data)
			}
		})
		/*--付款方式--*/
		.service("PaymodesService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/paymodes?l=" + Math.random(), data)
			}
		})
		/*--拆单split--*/
		.service("PackageService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/package?l=" + Math.random(), data)
			}
		})
		/*--发票信息--*/
		.service("InvoiceService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/invoice?l=" + Math.random(), data)
			}
		})
		/*--订单详情--*/
		.service("OrderService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/order?l=" + Math.random(), data)
			}
		})
		/*--用户（我的）--*/
		.service("UserService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/user?l=" + Math.random(), data)
			}
		})
		/*--修改用户信息--*/
		.service("UpuserService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/upuser?l=" + Math.random(), data)
			}
		})
		/*--立即购买--*/
		.service("ImbuyService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/imbuy?l=" + Math.random(), data)
			}
		})
		/*--订单列表--*/
		.service("OrdersService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/orders?l=" + Math.random(), data)
			}
		})
		/*--取消订单--*/
		.service("CancelorderService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/cancelorder?l=" + Math.random(), data)
			}
		})
		/*--申请售后--*/
		.service("ReturnfororderService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returnfororder?l=" + Math.random(), data)
			}
		})
		/*--再次审批--*/
		.service("AppagainService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/appagain?l=" + Math.random(), data)
			}
		})
		/*--确认收货--*/
		.service("OrdersignService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/ordersign?l=" + Math.random(), data)
			}
		})
		/*--再次购买--*/
		.service("BugagainService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/bugagain?l=" + Math.random(), data)
			}
		})
		/*--退换货订单--*/
		.service("ReturnsService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returns?l=" + Math.random(), data)
			}
		})
		/*--我的收藏--*/
		.service("FavoritesService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/favorites?l=" + Math.random(), data)
			}
		})
		/*--审批中心--*/
		.service("AuditordersService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/auditorders?l=" + Math.random(), data)
			}
		})
		/*--退货审批列表--*/
		.service("AppreturnsService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/appreturns?l=" + Math.random(), data)
			}
		})
		/*--订单状态列表--*/
		.service("StatesService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/states?l=" + Math.random(), data)
			}
		})
		/*--退货提交--*/
		.service("ReturnsubmitService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returnsubmit?l=" + Math.random(), data)
			}
		})
		/*--审批(同意，拒绝，修改)--*/
		.service("OrderauditService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/orderaudit?l=" + Math.random(), data)
			}
		})
		/*--审批(全部同意，全部拒绝)--*/
		.service("OrderauditsService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/orderaudits?l=" + Math.random(), data)
			}
		})
		/*--修改订单(通过提交)--*/
		.service("EditorderService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/editorder?l=" + Math.random(), data)
			}
		})
		/*--findpwd--*/
		.service("FindpwdService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/findpwd?l=" + Math.random(), data)
			}
		})
		/*--申请会员--*/
		.service("ApplyvipService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/applyvip?l=" + Math.random(), data)
			}
		})
		/*--采购留言--*/
		.service("SendmsgService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/sendmsg?l=" + Math.random(), data)
			}
		})
		/*--清空历史搜索--*/
		.service("ClearsearchService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/clearsearch?l=" + Math.random(), data)
			}
		})
		/*--取消退货(售后)--*/
		.service("CancelreturnService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/cancelreturn?l=" + Math.random(), data)
			}
		})
		/*--退货详情--*/
		.service("ReturnorderService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returnorder?l=" + Math.random(), data)
			}
		})
		/*--退货单审批--*/
		.service("ReturnauditService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returnaudit?l=" + Math.random(), data)
			}
		})
		/*--退货单审批(全部同意，全部拒绝)--*/
		.service("ReturnauditsService", function($http) {
			this.listData = function(data) {
				return $http.post("/api/b2b/returnaudits?l=" + Math.random(), data)
			}
		})
		//==========================制服列表============================
		.service("uniformData", function($http) {
			this.listData = function() {
				return $http.get("json/uniform.json")
			}
		})

	app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
		function($provide, $compileProvider, $controllerProvider, $filterProvider) {
			app.controller = $controllerProvider.register;
			app.directive = $compileProvider.directive;
			app.filter = $filterProvider.register;
			app.factory = $provide.factory;
			app.service = $provide.service;
			app.constant = $provide.constant;
		}
	]);
	// 按模块化加载其他的脚本文件
	app.constant('Modules_Config', [{
		name: 'treeControl',
		serie: true,
		files: [
			/*"Scripts/angular-bootstrap/ui-bootstrap-tpls-0.14.3.min.js"
			 */
		]
	}]);
	app.config(['$ocLazyLoadProvider', "$urlRouterProvider", function($ocLazyLoadProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$ocLazyLoadProvider.config({
			loadedModules: ['myModule'], //主模块名,和ng.bootstrap(document, ['monitorApp'])相同
			files: [], //主模块需要的资源，这里主要子模块的声明文件
			debug: false,
			events: false
		});

	}]);
	app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'Views/home/home.html',
				controller: 'homeCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"css/home.css", "css/wrap.css"
						])
					}]
				}
			})
			.state('category', {
				url: '/category',
				templateUrl: 'Views/category/category.html',
				controller: 'categoryCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/category.js", "css/category.css"
						])
					}]
				}
			})
			.state('categoryka', {
				url: '/categoryka',
				templateUrl: 'Views/categoryka/categoryka.html',
				controller: 'categorykaCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/categoryka.js", "css/categoryka.css"
						])
					}]
				}
			})
			.state('cart', {
				url: '/cart',
				templateUrl: 'Views/cart/cart.html',
				controller: 'cartCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/cart.js", "css/cart.css"
						])
					}]
				}
			})
			.state('mine', {
				url: '/mine',
				templateUrl: 'Views/mine/mine.html',
				controller: 'mineCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/mine.js", "css/mine.css"
						])
					}]
				}
			})
			.state('email_detail', {
				url: '/email_detail',
				templateUrl: 'Views/email_detail/email_detail.html',
				controller: 'email_detailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/email_detail.js", "css/email_detail.css"
						])
					}]
				}
			})
			.state('address_edit', {
				url: '/address_edit',
				templateUrl: 'Views/address_edit/address_edit.html',
				controller: 'address_editCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/address_edit.js", "css/address_edit.css"
						])
					}]
				}
			})
			.state('address_manage_edit', {
				url: '/address_manage_edit',
				templateUrl: 'Views/address_manage_edit/address_manage_edit.html',
				controller: 'address_manage_editCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/address_manage_edit.js", "css/address_manage_edit.css"
						])
					}]
				}
			})
			.state('address_manage', {
				url: '/address_manage',
				templateUrl: 'Views/address_manage/address_manage.html',
				controller: 'address_manageCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/address_manage.js", "css/address_manage.css"
						])
					}]
				}
			})
			.state('addressSearch', {
				url: '/addressSearch',
				templateUrl: 'Views/addressSearch/addressSearch.html',
				controller: 'addressSearchCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/addressSearch.js", "css/addressSearch.css"
						])
					}]
				}
			})
			.state('all_order', {
				url: '/all_order',
				templateUrl: 'Views/all_order/all_order.html',
				controller: 'all_orderCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/all_order.js", "css/all_order.css"
						])
					}]
				}
			})
			.state('application_process', {
				url: '/application_process',
				templateUrl: 'Views/application_process/application_process.html',
				controller: 'application_processCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/application_process.js", "css/application_process.css"
						])
					}]
				}
			})
			.state('application_process2', {
				url: '/application_process2',
				templateUrl: 'Views/application_process2/application_process2.html',
				controller: 'application_process2Ctlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/application_process2.js", "css/application_process2.css"
						])
					}]
				}
			})
			.state('card', {
				url: '/card',
				templateUrl: 'Views/card/card.html',
				controller: 'cardCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/card.js", "css/card.css"
						])
					}]
				}
			})
			.state('carry_info', {
				url: '/carry_info',
				templateUrl: 'Views/carry_info/carry_info.html',
				controller: 'carry_infoCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/carry_info.js", "css/carry_info.css"
						])
					}]
				}
			})
			.state('cost_center', {
				url: '/cost_center',
				templateUrl: 'Views/cost_center/cost_center.html',
				controller: 'cost_centerCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/cost_center.js", "css/cost_center.css"
						])
					}]
				}
			})
			.state('detail_page', {
				url: '/detail_page',
				templateUrl: 'Views/detail_page/detail_page.html',
				controller: 'detail_pageCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/jquery.fly.min.js", "js/detail_page.js", "css/detail_page.css"
						])
					}]
				}
			})
			.state('email', {
				url: '/email',
				templateUrl: 'Views/email/email.html',
				controller: 'emailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/email.js", "css/email.css"
						])
					}]
				}
			})
			.state('new_email', {
				url: '/new_email',
				templateUrl: 'Views/new_email/new_email.html',
				controller: 'new_emailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/new_email.js", "css/email.css"
						])
					}]
				}
			})
			.state('error_msg', {
				url: '/error_msg',
				templateUrl: 'Views/error_msg/error_msg.html',
				controller: 'error_msgCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/error_msg.js", "css/error_msg.css"
						])
					}]
				}
			})
			.state('exam_center', {
				url: '/exam_center',
				templateUrl: 'Views/exam_center/exam_center.html',
				controller: 'exam_centerCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/exam_center.js", "css/exam_center.css"
						])
					}]
				}
			})
			.state('exam_search', {
				url: '/exam_search',
				templateUrl: 'Views/exam_search/exam_search.html',
				controller: 'exam_searchCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/exam_search.js", "css/exam_search.css"
						])
					}]
				}
			})
			.state('fill_order', {
				url: '/fill_order',
				templateUrl: 'Views/fill_order/fill_order.html',
				controller: 'fill_orderCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/fill_order.js", "css/fill_order.css"
						])
					}]
				}
			})
			.state('forget_password2', {
				url: '/forget_password2',
				templateUrl: 'Views/forget_password2/forget_password2.html',
				controller: 'forget_password2Ctlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/forget_password2.js", "css/forget_password2.css"
						])
					}]
				}
			})
			.state('help_center', {
				url: '/help_center',
				templateUrl: 'Views/help_center/help_center.html',
				controller: 'help_centerCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/help_center.js", "css/help_center.css"
						])
					}]
				}
			})
			.state('issue_detail', {
				url: '/issue_detail',
				templateUrl: 'Views/issue_detail/issue_detail.html',
				controller: 'issue_detailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/issue_detail.js", "css/issue_detail.css"
						])
					}]
				}
			})
			.state('kac_exclusive', {
				url: '/kac_exclusive',
				templateUrl: 'Views/kac_exclusive/kac_exclusive.html',
				controller: 'kac_exclusiveCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/kac_exclusive.js", "css/kac_exclusive.css"
						])
					}]
				}
			})
			.state('kac', {
				url: '/kac',
				templateUrl: 'Views/kac/kac.html',
				controller: 'kacCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/kac.js", "css/kac.css"
						])
					}]
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: 'Views/login/login.html',
				controller: 'loginCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/login.js", "css/login.css"
						])
					}]
				}
			})
			.state('look_order', {
				url: '/look_order',
				templateUrl: 'Views/look_order/look_order.html',
				controller: 'look_orderCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/look_order.js", "css/look_order.css"
						])
					}]
				}
			})
			.state('myCollect', {
				url: '/myCollect',
				templateUrl: 'Views/myCollect/myCollect.html',
				controller: 'myCollectCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/myCollect.js", "css/myCollect.css"
						])
					}]
				}
			})
			.state('myOrder', {
				url: '/myOrder',
				templateUrl: 'Views/myOrder/myOrder.html',
				controller: 'myOrderCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/myOrder.js", "css/myOrder.css"
						])
					}]
				}
			})
			.state('new_address', {
				url: '/new_address',
				templateUrl: 'Views/new_address/new_address.html',
				controller: 'new_addressCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/new_address.js", "css/new_address.css"
						])
					}]
				}
			})
			.state('new_receiver', {
				url: '/new_receiver',
				templateUrl: 'Views/new_receiver/new_receiver.html',
				controller: 'new_receiverCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/new_receiver.js", "css/new_receiver.css"
						])
					}]
				}
			})
			.state('order_follow', {
				url: '/order_follow',
				templateUrl: 'Views/order_follow/order_follow.html',
				controller: 'order_followCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/order_follow.js", "css/order_follow.css"
						])
					}]
				}
			})
			.state('order_success', {
				url: '/order_success',
				templateUrl: 'Views/order_success/order_success.html',
				controller: 'order_successCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/order_success.js", "css/order_success.css"
						])
					}]
				}
			})
			.state('pay', {
				url: '/pay',
				templateUrl: 'Views/pay/pay.html',
				controller: 'payCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/pay.js", "css/pay.css"
						])
					}]
				}
			})
			.state('personal_info', {
				url: '/personal_info',
				templateUrl: 'Views/personal_info/personal_info.html',
				controller: 'personal_infoCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/personal_info.js", "css/personal_info.css"
						])
					}]
				}
			})
			.state('phone', {
				url: '/phone',
				templateUrl: 'Views/phone/phone.html',
				controller: 'phoneCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/phone.js", "css/phone.css"
						])
					}]
				}
			})
			.state('new_phone', {
				url: '/new_phone',
				templateUrl: 'Views/new_phone/new_phone.html',
				controller: 'new_phoneCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/new_phone.js", "css/phone.css"
						])
					}]
				}
			})
			.state('purchase_words', {
				url: '/purchase_words',
				templateUrl: 'Views/purchase_words/purchase_words.html',
				controller: 'purchase_wordsCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/purchase_words.js", "css/purchase_words.css"
						])
					}]
				}
			})
			.state('receipt_info', {
				url: '/receipt_info',
				templateUrl: 'Views/receipt_info/receipt_info.html',
				controller: 'receipt_infoCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/receipt_info.js", "css/receipt_info.css"
						])
					}]
				}
			})
			.state('receiver_address', {
				url: '/receiver_address',
				templateUrl: 'Views/receiver_address/receiver_address.html',
				controller: 'receiver_addressCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/receiver_address.js", "css/receiver_address.css"
						])
					}]
				}
			})
			.state('register', {
				url: '/register',
				templateUrl: 'Views/register/register.html',
				controller: 'registerCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/register.js", "css/register.css"
						])
					}]
				}
			})
			.state('register1', {
				url: '/register1',
				templateUrl: 'Views/register1/register1.html',
				controller: 'register1Ctlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/register1.js", "css/register1.css"
						])
					}]
				}
			})
			.state('return_goods', {
				url: '/return_goods',
				templateUrl: 'Views/return_goods/return_goods.html',
				controller: 'return_goodsCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/return_goods.js", "css/return_goods.css"
						])
					}]
				}
			})
			.state('returnOrderDetail', {
				url: '/returnOrderDetail',
				templateUrl: 'Views/returnOrderDetail/returnOrderDetail.html',
				controller: 'returnOrderDetailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/returnOrderDetail.js", "css/returnOrderDetail.css"
						])
					}]
				}
			})
			.state('revise_order', {
				url: '/revise_order',
				templateUrl: 'Views/revise_order/revise_order.html',
				controller: 'revise_orderCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/revise_order.js", "css/revise_order.css"
						])
					}]
				}
			})
			.state('searchPage', {
				url: '/searchPage',
				templateUrl: 'Views/searchPage/searchPage.html',
				controller: 'searchPageCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/searchPage.js", "css/searchPage.css"
						])
					}]
				}
			})
			.state('set', {
				url: '/set',
				templateUrl: 'Views/set/set.html',
				controller: 'setCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/set.js", "css/set.css"
						])
					}]
				}
			})
			.state('shop_list', {
				url: '/shop_list',
				templateUrl: 'Views/shop_list/shop_list.html',
				controller: 'shop_listCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/shop_list.js", "css/shop_list.css"
						])
					}]
				}
			})
			.state('split', {
				url: '/split',
				templateUrl: 'Views/split/split.html',
				controller: 'splitCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/split.js", "css/split.css"
						])
					}]
				}
			})
			.state('tel', {
				url: '/tel',
				templateUrl: 'Views/tel/tel.html',
				controller: 'telCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/tel.js", "css/tel.css"
						])
					}]
				}
			})
			.state('uniform_detail', {
				url: '/uniform_detail',
				templateUrl: 'Views/uniform_detail/uniform_detail.html',
				controller: 'uniform_detailCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/uniform_detail.js", "css/uniform_detail.css"
						])
					}]
				}
			})
			.state('uniform_manage', {
				url: '/uniform_manage',
				templateUrl: 'Views/uniform_manage/uniform_manage.html',
				controller: 'uniform_manageCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/uniform_manage.js", "css/uniform_manage.css"
						])
					}]
				}
			})
			.state('upload_license', {
				url: '/upload_license',
				templateUrl: 'Views/upload_license/upload_license.html',
				controller: 'upload_licenseCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/upload_license.js", "js/datePicker.js", "css/upload_license.css"
						])
					}]
				}
			})
			.state('username', {
				url: '/username',
				templateUrl: 'Views/username/username.html',
				controller: 'usernameCtlr',
				resolve: {
					deps: ["$ocLazyLoad", function($ocLazyLoad) {
						return $ocLazyLoad.load([
							"js/username.js", "css/username.css"
						])
					}]
				}
			})
	}])

})