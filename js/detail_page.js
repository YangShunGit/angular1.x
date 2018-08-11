
		app.controller("detail_pageCtlr",["$scope","$timeout","$state","DetailDataService","AddCartService","CollectService","ImbuyService",function($scope,$timeout,$state,DetailDataService,AddCartService,CollectService,ImbuyService) {
		
		/*返回上一步*/
		$scope.myBack = function(){
			window.history.back();
		}
		
		$scope.searchFlag = function(){
			SearchFlag = true;
		}
		
		console.log(All_orders,Groupid);
		
		//给图片设置高度
		var bodyWidth = $("body").width();
		$(".detail_pic").css("height",$("body").width()+"px");
		
		/*--价格整数小数分割函数--*/
		function priceSplit(price){
			var big_price = parseInt(price);
			var small_price = price.toString().split(".")[1];
			return {
				"big_price":big_price,
				"small_price":small_price
			}
		}
		
		
		/*--获取数据--*/
		var datatype = sessionStorage.getItem("datatype");
		var myDetailSessionData = JSON.parse(sessionStorage.getItem("detail_data"));
		var myDetailData = DetailData(datatype,myDetailSessionData.eid,myDetailSessionData.itemid,myDetailSessionData.colorid,myDetailSessionData.sizeid);
		console.log(myDetailData);
		
		
		/*--绑定数据函数--*/
		function ngData(res){
			$scope.myData = res.data.resources;
			$scope.qtytotal = res.data.resources[0].qtytotal;
			$scope.fid = res.data.resources[0].fid;
			$scope.iscollec = res.data.resources[0].iscollec;
			myDetailSessionData.itemid = $scope.myData[0].item.itemid;
			myDetailSessionData.eid = $scope.myData[0].item.eid;
			$scope.myData[0].item.goodsno = 20171115;
			$scope.data = {
				shop_url:$scope.myData[0].item.middleurl,
				shop_itemno:$scope.myData[0].item.itemno,
				shop_goodsno:$scope.myData[0].item.goodsno,
				shop_title:$scope.myData[0].item.itemname,
				shop_price:$scope.myData[0].item.price,
				shop_color:$scope.myData[0].item.colorname,
				shop_size:$scope.myData[0].item.sizename,
				shop_count:$scope.myData[0].item.orderqty,
				shop_big_price:priceSplit($scope.myData[0].item.price).big_price,
				shop_small_price:priceSplit($scope.myData[0].item.price).small_price,
				itemcolors:$scope.myData[0].itemcolors,
				itemsizes:$scope.myData[0].itemsizes,
				pictrues:$scope.myData[0].item.images,
				pictrues_count:$scope.myData[0].item.images.length,
				eid : $scope.myData[0].item.eid,
				itemid :$scope.myData[0].item.itemid,
				itemdescription:$scope.myData[0].item.itemdescription,
				itempara:$scope.myData[0].item.itempara,
				colorid:$scope.myData[0].item.colorid,
				sizeid:$scope.myData[0].item.sizeid
			}
			$(".body2_content").append($scope.data.itemdescription);
			$(".body2_content2").append($scope.data.itempara);
			if($scope.iscollec=="1"){
				$(".bg_shoucang").css({
					"background-position":"-48px -233px"
				});
				$(".foot_shoucang span").html("已收藏");
			}else{
				$(".bg_shoucang").css({
					"background-position":"-8px -233px"	
				});
				$(".foot_shoucang span").html("收藏");
			}
			if($scope.data.shop_goodsno==""||$scope.data.shop_goodsno==null){
				$(".client_shop").css("display","none");
				$(".para_price_box").css("paddingTop","30px");
			}
		}
		
		DetailDataService.listData(myDetailData).then(function(res){
			console.log(res);
			if(res.data.error==0){
				ngData(res);
				/*--判断是否允许购买--*/
				if(res.data.resources[0].item.allowbuy=="0"){
					$scope.allow = false;
					$(".detail_foot .direct_pay").css("background","lightgray");
					$(".detail_foot .add_cart").css("background","lightgray");
					$(".to_cart").css("background","lightgray");
					$(".to_pay").css("background","lightgray");
				}else{
					$scope.allow = true;
				}
				//console.log($scope.allow);
			}else{
				//console.log(res.config.data);
				alert(res.data.msg);
			}
			var time = setTimeout(function(){
				detailScroll.refresh();
				clearTimeout(time);
			},100);
			
		})
		
		/*--点击颜色--*/
		$scope.getColor = function($event){
			var sizeid = $(".model_ul li.selected").attr("sizeid");
			var colorid = $($event.target).attr("colorid");
			myDetailData.colorid = colorid;
			myDetailData.sizeid = sizeid;
			myDetailData.itemid ="";
			console.log(myDetailData);
			DetailDataService.listData(myDetailData).then(function(res){
				console.log(res);
				ngData(res);
				console.log()
			});
		}
		/*--点击型号--*/
		$scope.getSize = function($event){
			var colorid =  $(".color_ul li.selected").attr("colorid");
			var sizeid =  $($event.target).attr("sizeid");
			myDetailData.colorid = colorid;
			myDetailData.sizeid = sizeid;
			myDetailData.itemid ="";
			DetailDataService.listData(myDetailData).then(function(res){
				console.log(res);
				ngData(res);
			});
		}
		
		/*--获取商品信息--*/
		var myData = sessionStorage.getItem("detail_data");
		$scope.myData = JSON.parse(myData);
		$scope.myData_collect = JSON.parse(myData);
		console.log("---",$scope.myData);
		
		
		/*--init--*/
		$scope.a = true;
		$scope.b = true;
		$scope.do_count=1;
		$scope.c = false;
		$scope.scFlag = false;
		$scope.content1 = function(){
			$scope.b = true;
			$timeout(function(){
				detailScroll2.refresh();
				detailScroll3.refresh();
			},200);
		}
		$scope.content2 =function(){
			$scope.b = false;
			$timeout(function(){
				detailScroll2.refresh();
				detailScroll3.refresh();
			},200);
			
		}
		
		/*--para_box弹出动画--*/
		function para_box_show(){
			$(".parameter").css("display","block");
			$(".bg_box").css("display","block");
			$(".para_foot").css("display","block");
			var time_para = setTimeout(function(){
				$(".para_box").css({
					'bottom':'0',
					'transition':'all 300ms'
				})
				clearTimeout(time_para);
				paraScroll.refresh();
			},100);
			
		};
		
		/*--para_box隐藏动画--*/
		function para_box_hide(){
			$(".para_box").css({
				'bottom':'-400px',
				'transition':'all 300ms'
			});
			$timeout(function(){
				$(".bg_box").css("display","none");
				$(".para_foot").css("display","none");
				$(".parameter").css("display","none");
				$("body").css("background","#f1f2f6");
			},300);
		};
		$scope.close_para = function(){
			para_box_hide();
		}
		$(".to_cart").on("click",function(){
			if($scope.allow){
				para_box_hide();
				$(".prompt_success .txt").html("加入购物车成功");
				$(".prompt_success").fadeIn(200);
				setTimeout(function() {
					$(".prompt_success").fadeOut(200);
					
				}, 1000);
			}
			
			
		})
		$scope.open_para = function(){
			para_box_show();
		}
		/*--youshangjiao--*/
		$scope.d = false;
		$scope.change_nav = function(){
			$scope.d =!$scope.d;
		}
		
		/*--获取购物车商品数量--*/
		function cart_shop_count(){
			var count;
			var myCart = JSON.parse(sessionStorage.getItem("cart_shop"));
			if(myCart==null){
				count = 0;
			}else{
				count = myCart.data.length;
			}
			return count;
		}
		$scope.cartShopCount = cart_shop_count();
		$(".cart_shop_count").html($scope.cartShopCount);
		
		
	
		/*--scroll--*/
		var detailScroll,detailScroll2,detailScroll3,paraScroll;
		function detailLoaded(){
			detailScroll = new IScroll(".body1_wrapper",{
				preventDefault:false
			});
			detailScroll2 = new IScroll(".body2_wrapper",{
				preventDefault:false
			});
			detailScroll3 = new IScroll(".body3_wrapper",{
				preventDefault:false
			});
			paraScroll = new IScroll(".para_wrapper",{
				preventDefault:false,
				bounce: false
			});
		}
		
		var detailTimer = $timeout(function(){
			detailLoaded();
			$(".detail")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},200);
		
		
		
		
		
		
		/*----详情页动画部分----*/
			$(".detail_body")[0].addEventListener("touchend",function(){
				var sY = shiftY();
				var shs = shop_height_shift();
				console.log("sY--",sY);
				if(sY < shs-50){
					up_to();
				}
			});
			$(".detail_body3")[0].addEventListener("touchend",function(){
				var sY2 = shiftY2();
				if(sY2 > 70){
					down_to();
				}
			});
			
			var c_start_x,c_end_x,s_x,s_y,swipeX,swipeY,xx,yy,XX,YY,myLeft=0,stop_start,stop_move,stop_left;
			var banner_success = true;
			
			var l_flag = true; // 左右滑动参数
			var myLeft_flag = true;
			$(".box1_content")[0].addEventListener("touchstart",function(event){
					banner_success = false;
					stop_start = true;
					stop_move = false;
					console.log("start触发");
					
					xx = event.targetTouches[0].screenX ;
		     		yy = event.targetTouches[0].screenY ;
					c_start_x = event.touches[0].clientX ;
					if(myLeft_flag==true){
						myLeft = parseInt($(".box1_content").css("left"));
						console.log("myLeft",myLeft);
						myLeft_flag=false;
					}
					swipeX = true;
					swipeY = true;
			});
			$(".box1_content")[0].addEventListener("touchmove",function(event){
					stop_move = true;
					console.log("move触发");
					XX = event.targetTouches[0].screenX ;
		      		YY = event.targetTouches[0].screenY ;
					s_x  = event.touches[0].clientX - c_start_x;
					if(swipeX && Math.abs(XX-xx)-Math.abs(YY-yy)>0){
						
						left_move(l_flag,s_x);
						event.stopPropagation();//阻止冒泡
		         		event.preventDefault();//阻止浏览器默认事件
		      			swipeY = false;
					}else if(swipeY && Math.abs(XX-xx)-Math.abs(YY-yy)<0){
						swipeX = false;
					}
			});
			
			$scope.goods_pic_index = 1;
			//$scope.goods_pic_count = $scope.pictrues.length;
			
			$timeout(function(){
				var mySwiper = new Swiper('.swiper-container', {
					observer: true,
					observeParents: true,
					resistance : true,
					touchMoveStopPropagation :true,
					onTouchEnd: function(swiper){
						console.log("swiper.swipeDirection=========",swiper.swipeDirection,swiper.activeIndex,$scope.data.pictrues.length);
						if(swiper.swipeDirection=="next"&&swiper.activeIndex==$scope.data.pictrues.length-1){
							banner_success = true;
							left_to();
							
							
						}
					},
					onSlideNextStart:function(swiper){	
						$scope.goods_pic_index++;
						$(".pic_index_span").html($scope.goods_pic_index);
					},
					onSlidePrevStart:function(swiper){
						$scope.goods_pic_index--;
						$(".pic_index_span").html($scope.goods_pic_index);
					}
				})
			}, 500);
			
			$(".box1_content")[0].addEventListener("touchend",function(event){
				moving = true;
				console.log("end触发");
				c_end_x = event.changedTouches[0].clientX;
				//盒子最后停留的位置
				var lastPosition = $(".box1_content").css("left");
				console.log("lastPosition",lastPosition,parseInt(lastPosition));
				if(stop_start && stop_move && swipeX&&l_flag && parseInt(c_end_x - c_start_x) <= -50){
					
					left_to();
					l_flag = false;
				}
				else if(stop_start && stop_move &&swipeX&&l_flag == false && parseInt(c_end_x - c_start_x) >= 50){
					right_to();
					l_flag = true;
				}else if(parseInt(lastPosition)>-50){
					if(banner_success == false){
						$(".box1_content").css("left",0);
					}
					
				}else{
					
					if(banner_success == false){
						$(".box1_content").css("left","-"+bodyWidth+"px");
						
					}
				}
			});
		
			// shiftY-->detail_body上移位置;
			function shiftY(){
				var trans_Y = $(".detail_body").css("transform");
				var trans_Y_arr = trans_Y.substr(0,trans_Y.length-1).split(",");
				var shiftY = trans_Y_arr[trans_Y_arr.length-1];
				
				return shiftY;
			}
			
			// shiftY-->detail_body2下移位置;
			function shiftY2(){
				var trans_Y = $(".detail_body3").css("transform");
				var trans_Y_arr = trans_Y.substr(0,trans_Y.length-1).split(",");
				var shiftY = trans_Y_arr[trans_Y_arr.length-1];
				return shiftY;
			}
		
			//  商品页减去容器高的差值
			function shop_height_shift(){
				var h1 = $(".detail_body").height();
				var h2 = $(".body1_wrapper").height();
				return h2 - h1;
			}
			
			// 上拉切换详情页
			function up_to(y){
				$(".max_box").css({"top":y});
				$scope.flag = false;
				$(".detail_body").css("transform","translateY("+y+")");
				$(".max_box").css({
					top:"-100%",
					transition:"all .5s"
				});
				$timeout(function(){
					$(".detail_title1").css("color","#3C444B");
					$(".detail_title2").css("color","#f62f28");
					$(".a1").css("display","none");
					$(".a2").css("display","block");
					var shs = shop_height_shift();
				},500);
				
			}
			// 下拉切换商品页
			function down_to(y){
				var h = $(".max_box").height();
				var sh = h/2 +y;
				$(".max_box").css({"top":sh});
				$scope.flag = false;
				$(".detail_body3").css("transform","translateY("+y+")");
				$(".max_box").css({
					top:"0",
					transition:"all .5s"
				});
				$timeout(function(){
					$(".detail_title1").css("color","#f62f28");
					$(".detail_title2").css("color","#3C444B");
					$(".a1").css("display","block");
					$(".a2").css("display","none");
				},500);
			}
			
			//  box1_content左右滑动盒子
			function left_move(flag,num){
				if(flag){
					//console.log("yes",num);
					$(".box1_content").css({"left":num});
				}else{
					var n = -($(".box1_content").width())/2+num;
					console.log("n---",n,"num---",num);
					$(".box1_content").css({"left":n});
				}	
			}
			function left_to(){
					
					$(".box1_content").css({
						"left":"-100%",
						"transition":"all .5s"
					});
					$(".detail_title1").css("color","#3C444B");
					$(".detail_title2").css("color","#f62f28");
					$(".a1").css("display","none");
					$(".a2").css("display","block");
					myLeft = "-100%";
					l_flag = false;
					
			}
			function right_to(){
					$(".box1_content").css({
						"left":"0",
						"transition":"all .5s"
					});
					$(".detail_title1").css("color","#f62f28");
					$(".detail_title2").css("color","#3C444B");
					$(".a1").css("display","block");
					$(".a2").css("display","none");
					myLeft = "0";
					l_flag = true;
				
			};
			
			/*--点击左右切换--*/
			$(".detail_title1").on("click",function(){
				$(this).css("color","#f62f28");
				$(".detail_title2").css("color","#3C444B");
				right_to();
				down_to();
			});
	
			$(".detail_title2").on("click",function(){
				$(this).css("color","#f62f28");
				$(".detail_title1").css("color","#3C444B");
				left_to();
			});
		
		
		
			/*--弹窗选型--*/
			/*--选择颜色--*/
			$(".color_ul").on("click","li",function(){
				$(this).siblings().css("border","1px solid #c3c3c3");
				$(this).css("border","1px solid #f32f30");
				$scope.myData.goods_color = $(this).html();
				$(".detail_color").html($scope.myData.goods_color+",");
			})
			/*--选择型号--*/
			$(".model_ul").on("click","li",function(){
				$(this).siblings().css("border","1px solid #c3c3c3");
				$(this).css("border","1px solid #f32f30");
				$scope.myData.goods_model = $(this).html();
				$(".detail_size").html($scope.myData.goods_model+",");
			})
			
			/*--点击add--*/
			/*$(".add").on("click",function(){
				var old_count = $(this).siblings(".count").children("input").val();
				var new_count = parseInt(old_count)+1;
				$(this).siblings(".count").children("input").val(new_count);
				$(".detail_count").html(new_count+"个");
				$(this).siblings(".del").children(".icon-del").css("color","#232227");
			})*/
			$(".add").on("click",function(){
				var old_count = $(this).siblings(".count").children("input").val();
				var new_count = parseInt(old_count)+1;
				if(new_count>9999){
					$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function(){
						$(".prompt_fail").fadeOut(200);
					},1000);
					$(this).siblings(".count").children("input").val(999);
					$(".detail_count").html(999+"个");
				}else{
					$(this).siblings(".count").children("input").val(new_count);
					$(".detail_count").html(new_count+"个");
					$(this).siblings(".del").children(".icon-del").css("color","#232227");
				}
			})
			
			/*--点击del--*/
			$(".del").on("click",function(){
				var old_count = $(this).siblings(".count").children("input").val();
				if(old_count>2){
					var new_count = parseInt(old_count)-1;
					$(this).siblings(".count").children("input").val(new_count);
					$(".detail_count").html(new_count+"个");
				}else{
					$(this).siblings(".count").children("input").val(1);
					$(".detail_count").html("1个");
					$(this).children(".icon-del").css("color","#bfbfbf");
				}
			})
			
			var oldValue;
			$(".count").on("click","input",function(){
				oldValue = $(this).val();
				console.log(oldValue);
			});
			/*--点击count--*/
			$(".count").on("keyup","input",function(){
				
				var myValue = $(this).val();
				if(myValue!=""){
					var reg = /^[1-9]\d*$/.test(myValue);
					console.log(myValue,reg);
					if(reg){
						if(parseInt(myValue)>9999){
							$(this).val(oldValue);
							if(oldValue==1){
								$(this).parent(".count").siblings(".add").children(".icon-add").css("color","#232227");
								$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#bfbfbf");
							}
							$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
							$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
							},1000);
						}else if(parseInt(myValue)==1){
							$(".detail_count").html("1个");
							$(this).parent(".count").siblings(".add").children(".icon-add").css("color","#232227");
							$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#bfbfbf");
						}else{
							$(".detail_count").html(myValue);
							$(this).parent(".count").siblings(".add").children(".icon-add").css("color","#232227");
							$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#232227");
						}
					}else{
						$(this).val(oldValue);
					}
				}
			});
			$(".count").on("blur","input",function(){
				var myValue = $(this).val();
				if(myValue==""){
					$(this).val(1);
					$(".detail_count").html("1个");
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#bfbfbf");
					$(this).parent(".count").siblings(".add").children(".icon-add").css("color","#232227");
				}
			});
			
			
			
			
			/*--id查找相同的商品--*/
			function id_repeat(id,obj,newArr){
				var flag = true;
				for(var i =0;i<obj.data.length;i++){
					if(obj.data[i].goods_id==id){
						obj.data[i].goods_count = parseInt(obj.data[i].goods_count)+parseInt(newArr.goods_count);
						flag = false;
						break;
					}
				}
				if(flag){
					obj.data.push(newArr);
				}
				return obj;
			}
			/*加入购物车成功提示框*/
			
			$(".addcar").click(function(event){
				if($scope.allow){
				var offset = $(".bg_gouwuche").offset();
				var start_left = ($(".detail_pic").width())/2-45;
				var start_top = (($(".detail_pic").height())/2);
				//console.log(offset,start_left,$(".detail_pic").width());
				var addcar = $(this);
				var img = $($(".detail_pic").find("img")[0]).attr("src");
				var flyer = $('<img class="u-flyer" src="'+img+'">');
				//console.log($(".detail_pic").pageX,$(".detail_pic").pageY);
				flyer.fly({
					start: {
						left:start_left, 
						top: start_top
					},
					end: {
						left: offset.left+10,
						top: offset.top+10,
						width: 0,
						height: 0
					},
					onEnd: function(){
						this.destory();
						$(".cart_prompt").fadeIn(200);
						setTimeout(function(){
							$(".cart_prompt").fadeOut(200);
						},2000);
					}
				});
				}
			});
			  
			
			function addCart(){
				var eid = myDetailSessionData.eid;
				var itemid = myDetailSessionData.itemid;
				var orderqty = $(".count input").val();
				var price = $scope.data.shop_price;
				var act = "add";
				var cartid ="";
				var myAddCartData = AddCartData(eid,itemid,orderqty,price,act,cartid);
				console.log(myAddCartData);
				AddCartService.listData(myAddCartData).then(function(res){
					console.log("111",res);
					$scope.qtytotal = res.data.resources[0].qtytotal;
				})
			}
			
			$(".add_cart").click(function(){
				if($scope.allow){
					addCart();
				}
			});
			$(".to_cart").click(function(){
				if($scope.allow){
					addCart();
					$(".cart_prompt").fadeIn(200);
					setTimeout(function(){
						$(".cart_prompt").fadeOut(200);
					},1000);
				}
				
			});
			
			
			
			$(".foot_shoucang").on("click",function(){
				var iscollec = $scope.iscollec;
				var act = "add";
				if(iscollec == "1"){
					$scope.iscollec = "0";
					act = "del"
				}else{
					$scope.iscollec = "1";
					act = "add";
				}
				var cartid = "";
				var fids = $scope.fid;
				var eid = $(this).attr("eid");
				var itemid = $(this).attr("itemid");
				var myCollectData = CollectData(act,cartid,eid,itemid,fids);
				console.log(myCollectData);
				CollectService.listData(myCollectData).then(function(res){
					console.log(res);
					if(res.data.error==0){
						DetailDataService.listData(myDetailData).then(function(res){
							console.log(res);
							ngData(res);
							
						})
						if(iscollec=="1"){
							$(".prompt_success .txt").html("已取消收藏");
							$(".foot_shoucang span").html("收藏");
							$(".bg_shoucang").css({
								"background-position":"-8px -233px"	
							});
						}else{
							$(".prompt_success .txt").html("已加入收藏");
							$(".foot_shoucang span").html("已收藏");
							$(".bg_shoucang").css({
								"background-position":"-48px -233px"	
							});
						}
						$(".prompt_success").fadeIn(200);
						setTimeout(function() {
							$(".prompt_success").fadeOut(200);
						}, 1000);
					}else{
						$(".prompt_fail .txt").html("操作失败");
						$(".prompt_fail").fadeIn(200);
						setTimeout(function() {
							$(".prompt_fail").fadeOut(200);
						}, 1000);
					}
				})
			});
			
			/*--立即购买--*/
			$scope.immediate_pay = function(){
				if($scope.allow){
					$(".is_load").css("display","block");
					var myImbuy = {
						price:$scope.data.shop_price,
						eid:$scope.data.eid,
						itemid:$scope.data.itemid,
						colorid:$scope.data.colorid,
						sizeid:$scope.data.sizeid
					}
					myImbuyData = ImBuyData(myImbuy.price,myImbuy.eid,myImbuy.itemid,myImbuy.colorid,myImbuy.sizeid);
					ImbuyService.listData(myImbuyData).then(function(res){
						console.log(res);
						if(res.data.resources[0].receiveaddress.addressid==null){
							NoAddress = true;
						}
						sessionStorage.setItem("fillOrderRes",JSON.stringify(res));
						$state.go("fill_order");
					})
					//BuyFlag = true;
				}
				
			};
			
			
			
		}])

