
		app.controller("uniform_detailCtlr", ["$scope","$timeout","$state",function($scope,$timeout,$state) {
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}	
		/*--进入购物车--*/
		$scope.to_cart = function(){
			sessionStorage.setItem("tabIndex",2);
		}
		
		/*--获取商品信息--*/
		var myData = sessionStorage.getItem("shop_data");
		$scope.myData = JSON.parse(myData);
		$scope.myData_collect = JSON.parse(myData);
		console.log("---",$scope.myData);
		$scope.data = {
				shop_url:$scope.myData.goods_url,
				shop_title:$scope.myData.goods_title,
				shop_price:$scope.myData.goods_price,
				shop_color:$scope.myData.goods_color,
				shop_size:$scope.myData.goods_model,
				shop_count:$scope.myData.goods_count,
				shop_colors:$scope.myData.goods_colors,
				shop_models:$scope.myData.goods_models
		}
		
		
		/*--init--*/
		$scope.a = true;
		$scope.b = true;
		$scope.do_count=1;
		$scope.c = false;
		$scope.scFlag = false;
		$scope.title1 = function(){
			right_to();
			
		}
		$scope.title2 = function(){
			left_to();
		
		}
		$scope.content1 = function(){
			$scope.b = true;	
		}
		$scope.content2 =function(){
			$scope.b = false;
		}
		
		
		
		
		/*--para_box弹出动画--*/
		function para_box_show(){
			$(".parameter").css("display","block");
			$(".bg_box").css("display","block");
			$(".para_foot").css("display","block");
			$(".para_box").css({
				"display":"block",
				"bottom":"-355px"
			});
			$(".para_box").animate({bottom:"0"},500);
		};
		
		/*--para_box隐藏动画--*/
		function para_box_hide(){
			$(".para_box").animate({bottom:"-400px"},500,function(){
				$(".bg_box").css("display","none");
				$(".para_foot").css("display","none");
				$(".parameter").css("display","none");
			})
		};
		$scope.close_para = function(){
			para_box_hide();
		}
		$scope.open_para = function(){
			para_box_show();
		}
		/*--youshangjiao--*/
		$scope.d = false;
		$scope.change_nav = function(){
			$scope.d =!$scope.d;
		}
		$scope.back_home = function(){
			sessionStorage.setItem("tabIndex",0);
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
		var detailScroll,detailScroll2,detailScroll3;
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
		}
		function isPassive() {
			    var supportsPassiveOption = false;
			    try {
			        addEventListener("test", null, Object.defineProperty({}, 'passive', {
			            get: function () {
			                supportsPassiveOption = true;
			            }
			        }));
			    } catch(e) {}
			    return supportsPassiveOption;
			}
		var detailTimer = $timeout(function(){
			detailLoaded();
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
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
			
			var c_start_x,c_end_x,s_x,s_y,swipeX,swipeY,xx,yy,XX,YY,myLeft=0;
			var l_flag = true; // 左右滑动参数
			$(".box1_content")[0].addEventListener("touchstart",function(event){
				xx = event.targetTouches[0].screenX ;
	     		yy = event.targetTouches[0].screenY ;
				c_start_x = event.touches[0].clientX ;
				myLeft = parseInt($(".box1_content").css("left"));
				swipeX = true;
				swipeY = true;
			});
			$(".box1_content")[0].addEventListener("touchmove",function(event){
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
			$(".box1_content")[0].addEventListener("touchend",function(event){
				c_end_x = event.changedTouches[0].clientX;
				if(swipeX&&l_flag && parseInt(c_end_x - c_start_x) <= -50){
					left_to();
					l_flag = false;
				}
				else if(swipeX&&l_flag == false && parseInt(c_end_x - c_start_x) >= 50){
					right_to();
					l_flag = true;
				}else{
					$(".box1_content").animate({"left":myLeft},500,function(){	
					});
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
				$(".detail_body").css("transform","translateY("+y+")")
				$(".max_box").animate({top:"-100%"},500,function(){
					$(".a1").css("display","none");
					$(".a2").css("display","block");
					var shs = shop_height_shift();
					//shs = shs+50+"px";
					//$(".detail_body").css("transform","translateY("+shs+")")
				})
			}
			// 下拉切换商品页
			function down_to(y){
				var h = $(".max_box").height();
				var sh = h/2 +y;
				$(".max_box").css({"top":sh});
				$scope.flag = false;
				$(".detail_body3").css("transform","translateY("+y+")")
				$(".max_box").animate({top:"0"},500,function(){
					$(".a1").css("display","block");
					$(".a2").css("display","none");
					//$(".detail_body3").css("transform","translateY(-25)")
				})
			}
			
			//  box1_content左右滑动盒子
			function left_move(flag,num){
				if(flag){
					console.log("yes",num);
					$(".box1_content").css({"left":num});
				}else{
					var n = -($(".box1_content").width())/2+num;
					console.log("n---",n,"num---",num);
					$(".box1_content").css({"left":n});
				}	
			}
			function left_to(){
				$(".box1_content").animate({"left":"-100%"},500,function(){	
					});
					$(".a1").css("display","none");
					$(".a2").css("display","block");
			}
			function right_to(){
				$(".box1_content").animate({"left":"0"},500,function(){	
					});
					$(".a1").css("display","block");
					$(".a2").css("display","none");
			};
		
		
		
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
			$(".add").on("click",function(){
				var old_count = $(this).siblings(".count").children("input").val();
				var new_count = parseInt(old_count)+1;
				$(this).siblings(".count").children("input").val(new_count);
				$(".detail_count").html(new_count+"个");
				$(this).siblings(".del").children(".icon-del").css("color","#232227");
				
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
			
			$(".count").on("focus","input",function(){
				$(".max_box").css("height","100%");
			});
			
			/*--点击count--*/
			$(".count").on("blur","input",function(){
				$(".max_box").css("height","200%");
				var myValue = $(this).val();
				if(myValue==1){
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#bfbfbf");
				}else{
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#232227");
				}
			});
			
			
			
			
			/*--id查找相同的商品--*/
			function id_repeat1(id,obj,newArr){
				var flag = true;
				for(var i =0;i<obj.data.length;i++){
					if(obj.data[i].goods_id==id&&obj.data[i].goods_type =="制服领用"){
						obj.data[i].goods_count = parseInt(obj.data[i].goods_count)+parseInt(newArr.goods_count);
						flag = false;
						break;
					}
				}
				if(flag){
					newArr.goods_type = "制服领用";
					obj.data.push(newArr);
				}
				return obj;
			}
			function id_repeat2(id,obj,newArr){
				var flag = true;
				for(var i =0;i<obj.data.length;i++){
					if(obj.data[i].goods_id==id&&obj.data[i].goods_type =="制服回收"){
						console.log(obj.data[i].goods_count,newArr.goods_count);
						obj.data[i].goods_count = parseInt(obj.data[i].goods_count)+parseInt(newArr.goods_count);
						flag = false;
						break;
					}
				}
				if(flag){
					newArr.goods_type = "制服回收";
					obj.data.push(newArr);
				}
				return obj;
			}
			/*加入购物车成功提示框*/
			function addCart(e){
				
				var myType = $(event.target).html();
				console.log(myType);
				var type;
				if(myType =="领用"){
					type = "制服领用";
					$(".receive_prompt").fadeIn(200);
				setTimeout(function(){
					$(".receive_prompt").fadeOut(200);
				},1000);
				}else{
					type = "制服回收";
					$(".recover_prompt").fadeIn(200);
				setTimeout(function(){
					$(".recover_prompt").fadeOut(200);
				},1000);
				};
				
				$scope.myData.goods_count = $(".count input").val();
				$scope.myData.goods_sel = true;
				$scope.myData.goods_type = type;
				console.log("sel",$scope.myData);
				var cs = JSON.parse(sessionStorage.getItem("cart_shop"));
				var myId = $scope.myData.goods_id;
				if(cs==null){
					var cart_obj = {};
					cart_obj.data = [];
					cart_obj.data.push($scope.myData);
					sessionStorage.setItem("cart_shop",JSON.stringify(cart_obj));
				}else{
					//console.log(cs);
					if(type == "制服领用"){
						var new_cart_obj = id_repeat1(myId,cs,$scope.myData);
					}else{
						var new_cart_obj = id_repeat2(myId,cs,$scope.myData);
					}
					
					sessionStorage.setItem("cart_shop",JSON.stringify(new_cart_obj));
				}
				$scope.cartShopCount = cart_shop_count();
				console.log($scope.cartShopCount);
				$(".cart_shop_count").html($scope.cartShopCount);
			}
			
			
			$(".add_cart").click(function(){
				addCart();
			});
			$(".direct_pay").click(function(){
				addCart();
			});
			$(".to_cart").click(function(){
				addCart();
			});
			$(".to_pay").click(function(){
				addCart();
			})
			
			/*--载入判断是否收藏--*/
			$scope.collect_obj = JSON.parse(sessionStorage.getItem("collect_shop"));
			//console.log($scope.collect_obj);
			function　myCollect(){
				console.log("myCollect执行成功",$scope.collect_obj);
				if($scope.collect_obj!=null){
					if($scope.collect_obj.length !=0){
						for(var i=0;i<$scope.collect_obj.length;i++){
							if($scope.collect_obj[i].goods_id==$scope.myData_collect.goods_id){
								$scope.scFlag =true;
								$(".bg_shoucang").css({
								// 取消
									"background-position":"-48px -233px"
								});
								return i;
							}
						}
					}
				}else{
					$scope.collect_obj=[];
				}
				
			}
			$scope.index = myCollect();
			
			
			/*--点击收藏--*/
			
			
			$(".foot_shoucang").on("click",function(){
				if($scope.scFlag==false){
					$(".bg_shoucang").css({
						"background-position":"-48px -233px"	
					});
					$scope.collect_obj.push($scope.myData_collect);
					sessionStorage.setItem("collect_shop",JSON.stringify($scope.collect_obj));
					/*var test_cs =JSON.parse(sessionStorage.getItem("collect_shop"));
					console.log(test_cs);*/
					$scope.scFlag=true;
				}else{
					$(".bg_shoucang").css({
						"background-position":"-8px -233px"
					});
					console.log($scope.index);
					$scope.collect_obj.splice($scope.index,1);
					sessionStorage.setItem("collect_shop",JSON.stringify($scope.collect_obj));
					$scope.scFlag=false;
				}
			});
			
			
		}])
