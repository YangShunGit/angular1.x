
		app.controller("application_processCtlr", ["$scope", "$timeout", "$state", function($scope, $timeout, $state) {

			$("input").attr("onKeypress", "javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup", "this.value=this.value.replace(/^ +| +$/g,'')");

			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}
			console.log("测试上传照片");
			/*--获取数据--*/
			$scope.goods = AppreturnsResources;
			console.log($scope.goods);
			$scope.details = $scope.goods.details;
			var submitData = angular.copy($scope.details);
			
			if(Returnsubmit.details.length>0){
				for(var j=0;j<Returnsubmit.images.length;j++){
					var myLi = $(".pic_img #pic_li").clone(true);
					$(myLi).removeAttr("id").attr({
						"class": "pic_li",
						"imageurl":Returnsubmit.images[j].imageurl
					})
					$(myLi).find("img").attr("src", Returnsubmit.images[j].imageurl);
					$(".upload_box").before($(myLi));
				}
				
				$scope.font_count = Returnsubmit.memo;
				$(".reason_content").html(Returnsubmit.reason);
				if(Returnsubmit.operatetype=="0"){
					$(".type_ul li").css({
					    "border": "1px solid rgb(202, 202, 202)",
    					"color": "rgb(42, 42, 44)"
					})			
					$(".type_ul li:last-child").css({
						"border": "1px solid #f82e2a",
    					"color":"#f82e2a"
					})
				}else{
					$(".type_ul li").css({
					    "border": "1px solid rgb(202, 202, 202)",
    					"color": "rgb(42, 42, 44)"
					})			
					$(".type_ul li:first-child").css({
						"border": "1px solid #f82e2a",
    					"color":"#f82e2a"
					})
				}
			}else{
				/*----输入字数检测----*/
				$scope.font_count = "";

			}
			
			function processLoaded() {
				processScroll = new IScroll(".process_wrapper", {
					preventDefault: false
				});
			}

			
			var processTimer = $timeout(function() {
				processLoaded();
				$(".process_wrapper")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 200);

			/*--youshangjiao--*/
			$scope.d = false;
			$scope.change_nav = function() {
				$scope.d = !$scope.d;
			};
			$scope.searchFlag = function(){
				SearchFlag = true;
			}

			$scope.type_sel = function($event) {
				$(".service_type_li").css({
					"border": "1px solid #cacaca",
					"color": "#2a2a2c"
				});
				$($event.target).css({
					"border": "1px solid #f82e2a",
					"color": "#f82e2a"
				});
				Returnsubmit.operatetype = $($event.target).attr("data-index");
			};
			$scope.voucher_sel = function($event) {
				$(".draw").css({
					"background-position": "-443px -289px"
				});
				$($($event.target)).css({
					"background-position": "-260px -83px"
				})
			};

			
			/*--找到商品--*/
			function search_shop(id) {
				for(var i = 0; i < $scope.goods.shop.length; i++) {
					if(id == $scope.goods.shop[i].goods_id) {
						return i;
					}
				}
			}

			/*--点击add--*/
			$(".shop_list_ul").on("click", ".add", function() {
				var index = $(this).attr("data-index");
				var myId = $(this).parent().attr("data-id");
				var old_count = $(this).siblings(".count").children("input").val();
				console.log($scope.details, old_count, $scope.details[index].orderqty);
				if(old_count < $scope.details[index].orderqty) {
					var new_count = parseInt(old_count) + 1;
					$(this).siblings(".count").children("input").val(new_count);
					submitData[index].orderqty = new_count;
					$(this).siblings(".del").children(".icon-del").css("color", "#232227");
					if(new_count == $scope.details[index].orderqty) {
						$(this).children(".icon-add").css("color", "#bfbfbf");
					}
				}
			});

			/*--点击del--*/
			$(".shop_list_ul").on("click", ".del", function() {
				var index = $(this).attr("data-index");
				var old_count = $(this).siblings(".count").children("input").val();
				if(old_count > 0) {
					var new_count = parseInt(old_count) - 1;
					$(this).siblings(".count").children("input").val(new_count);
					submitData[index].orderqty = new_count;
					console.log(submitData, $scope.details);
					$(this).siblings(".add").children(".icon-add").css("color", "#232227");
					if(new_count == 0) {
						$(this).children(".icon-del").css("color", "#bfbfbf");
					}
				}
			});

			var oldValue;
			$(".shop_list_ul").on("click", ".count input", function() {
				oldValue = $(this).val();
			});
			/*--点击count--*/
			$(".shop_list_ul").on("keyup", ".count input", function() {

				var index = $(this).attr("data-index");
				var myValue = $(this).val();
				if(myValue != "") {
					var reg = /^\d*$/.test(myValue);
					//console.log(myValue,reg);
					if(reg) {
						if(parseInt(myValue) > $scope.details[index].orderqty) {
							$(this).val(oldValue);
						} else if(parseInt(myValue) == $scope.details[index].orderqty) {
							submitData[index].orderqty = myValue;
							$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#bfbfbf");
							$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#232227");
						} else if(parseInt(myValue) == 0) {
							submitData[index].orderqty = myValue;
							$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
							$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#bfbfbf");
						} else {
							submitData[index].orderqty = parseInt(myValue);
							$(this).val(parseInt(myValue));
							$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
							$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#232227");
						}
					} else {
						submitData[index].orderqty = $scope.details[index].orderqty;
						$(this).val($scope.details[index].orderqty);
						$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#bfbfbf");
						$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#232227");
					}
				}
			});
			$(".shop_list_ul").on("blur", ".count input", function() {
				var index = $(this).attr("data-index");
				var myValue = $(this).val();
				if(myValue == "") {
					submitData[index].orderqty = 0;
					$(this).val(0);
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color", "#bfbfbf");
					$(this).parent(".count").siblings(".add").children(".icon-add").css("color", "#232227");
				}
			});

			//select reason
			$(".appReason").on("click", function() {
				$(".maskBlack").css({
					'display': 'block'
				})
				$(".reason_list").css({
					'bottom': '0',
					'transition': 'all 300ms'
				});
			})

			$(".reason_iscroll").on("click", "li", function() {
				Returnsubmit.reason = $(this).text();
				$(".reason_content").html(Returnsubmit.reason);
				$(".reason_iscroll li span").css("display", "none");
				$(this).find("span").css("display", "inline-block");
				$(".reason_list").css({
					'bottom': '-325px',
					'transition': 'all 300ms'
				});
				$timeout(function() {
					$(".maskBlack").css("display", "none");
				});
			})
			//cancel reason
			$(".reasonCancel").on("click", function() {
				$(".reason_list").css({
					'bottom': '-325px',
					'transition': 'all 300ms'
				});
				$timeout(function() {
					$(".maskBlack").css("display", "none");
				});
			})
			//mask cancel
			$scope.mask = function() {
				$(".reason_list").css({
					'bottom': '-325px',
					'transition': 'all 300ms'
				});
				$timeout(function() {
					$(".maskBlack").css("display", "none");
				});
			}

			//点击下一步
			$(".next").on("click", function() {
				//-----订单编号
				Returnsubmit.orderno = $scope.goods.orderno;
				Returnsubmit.operatetype = "0";

				//--商品信息--
				Returnsubmit.details = [];
				$.each(submitData, function(index, obj) {
					var item = {};
					item.itemid = obj.itemid;
					item.qty = obj.orderqty;
					if(item.qty != 0) {
						Returnsubmit.details.push(item);
					}
				});
				console.log("details", Returnsubmit.details);
				//--备注说明--
				Returnsubmit.memo = $("textarea").val();

				//上传照片信息
				var imgArr = [];
				console.log($(".pic_li"));
				$.each($(".pic_li img"),function(index,obj){
					var cell = {
						imageurl: $(obj).attr("src"),
						returnno:""
					}
					imgArr.push(cell);
				})
				Returnsubmit.images = imgArr;
				console.log(Returnsubmit);
				if(Returnsubmit.details.length == 0) {
					$(".prompt_fail .txt").html("请选择商品！");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				} else if(Returnsubmit.reason == "") {
					$(".prompt_fail .txt").html("请选择理由！");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				} else {
					if(Returnsubmit.memo==""){
						Returnsubmit.memo="无";
					}
					AppreturnsResources.details = submitData;
					console.log(Returnsubmit);
					$state.go("application_process2");
				}

			})

			
			$scope.del_pic = function($event){
				console.log('111');
				console.log($($event.target));
				$($event.target).parent().detach();
			}
			
			$(".pic_img").on("click",".pic_li img",function(){
				$(".magnifier-img").attr("src",$(this).attr("src"));
				$(".magnifier").css("display","block");
			})
			
			$scope.magCancel = function(){
				$(".magnifier").css("display","none");
			}
			

		}])
