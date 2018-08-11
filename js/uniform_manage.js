define(['uiRouter'],function(){
	var uniform_manageApp = angular.module('uniform_manageModule',['ui.router'])
		.config(function($stateProvider,$urlRouterProvider){
			$stateProvider.state('uniform_manage',{
				url:'/uniform_manage',
				templateUrl:'Views/uniform_manage/uniform_manage.html',
			
				controller:'uniform_manageCtlr',
			});
		})
		.directive('repeatFinish',function(){
		    return {
		        link: function(scope,element,attr){
		            console.log(scope.$index)
		            if(scope.$last == true){
		                console.log('ng-repeat执行完毕')
		                scope.$eval( attr.repeatFinish )
		            }
		        }
		    }
		})
		
		.controller("uniform_manageCtlr",["$scope","uniformData","$timeout","$state",function($scope,uniformData,$timeout,$state){
			
			var shopScroll;
			uniformData.listData().then(function(res){
				console.log(res.data.data);
				$scope.goods = res.data.data;
			})
		
			
			$scope.ch = true;
			
			$scope.brand=["惠普HP","EZ COPY","立信","卓联ZL","齐心","益而高Eagle","旗牌Artline","博士","富士施乐"];
			$scope.family =["礼品笔","中性笔/签字笔","钢笔","笔芯","白板笔","水彩笔","记号笔","荧光笔","毛笔"];
			$scope.right = false;
			var get_data = JSON.parse(sessionStorage.getItem("searchKey"));
			$scope.search_data = get_data.search;
			
			/*--接收搜索关键字--*/
			
			
			
			function shopLoaded(){
				shopScroll = new IScroll(".shop_wrapper",{
					preventDefault:false,
					checkDOMChanges:true
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
			$scope.shopTimer=function(){
				var shopTimer = $timeout(function(){
				shopLoaded();
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},100);
			}
			
			
			/*--切换列表模式和大图模式--*/
			$scope.changeList = function(){
				$scope.ch=!$scope.ch;
				$timeout(function(){
					shopScroll.refresh();	
				},100)
			};
			/*---价格排序图标变色--*/
			$(".price_sort_li").click(function(){
			($(".price_sort_li span").attr("class")=="gray")?$(".price_sort_li span").attr("class","ascend"):($(".price_sort_li span").attr("class")=="ascend")?$(".price_sort_li span").attr("class","descend"):$(".price_sort_li span").attr("class","ascend");	
			});
			
			
			/*--数据传递函数--*/
			$scope.getData = function($event){
				var sessionData = {};
				var myId =  $($event.target).attr("data-id");
				$scope.goods.map(function(item){
					if(item.goods_id == myId){	
						sessionData = item;	
					}
				});
				sessionData = JSON.stringify(sessionData);
				sessionStorage.setItem("shop_data",sessionData);
				$state.go("uniform_detail");
			}
			
			/*--返回上一步--*/
			$scope.myBack = function(){
				$state.go("home");
			}
			
			/*--点击add--*/
			$(".shop_list_ul").on("click",".list_li .del_add .add",function(){
				var old_count = $(this).siblings(".count").children("input").val();
				var new_count = parseInt(old_count)+1;
				$(this).siblings(".count").children("input").val(new_count);
				$(this).siblings(".del").children(".icon-del").css("color","#232227");
				
			})
			/*--点击del--*/
			$(".shop_list_ul").on("click",".list_li .del_add .del",function(){
				
				var old_count = $(this).siblings(".count").children("input").val();
				if(old_count>2){
					var new_count = parseInt(old_count)-1;
					$(this).siblings(".count").children("input").val(new_count);
				}else{
					$(this).siblings(".count").children("input").val(1);
					$(this).children(".icon-del").css("color","#bfbfbf");
				}
			})
			/*--点击count--*/
			$(".shop_list_ul").on("blur",".list_li .del_add .count input",function(){
				var myValue = $(this).val();
				console.log(myValue,"22222");
				if(myValue==1){
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#bfbfbf");
				}else{
					$(this).parent(".count").siblings(".del").children(".icon-del").css("color","#232227");
				}
			})
			/*--id遍历搜索商品函数--*/
			function id_search(id,count){
				for(var i = 0;i<$scope.goods.length;i++){
					if($scope.goods[i].goods_id == id){
						var myShop = $scope.goods[i];
						myShop.goods_count = count;
						return myShop;
					}
				}
			}
			
			/*--id查找相同的商品--*/
			function id_repeat(id,count,obj){
				var flag = true;
				for(var i =0;i<obj.data.length;i++){
					if(obj.data[i].goods_id==id && obj.data[i].goods_type =="制服领用"){
						obj.data[i].goods_count = parseInt(obj.data[i].goods_count)+parseInt(count);
						flag = false;
						break;
					}
				}
				if(flag){
					var newArr = id_search(id,count);
					console.log("---",newArr);
					newArr.goods_sel = true;
					newArr.goods_type = "制服领用";
					obj.data.push(newArr);
				}
				return obj;
			}
			function id_repeat2(id,count,obj){
				var flag = true;
				for(var i =0;i<obj.data.length;i++){
					if(obj.data[i].goods_id==id && obj.data[i].goods_type =="制服回收"){
						obj.data[i].goods_count = parseInt(obj.data[i].goods_count)+parseInt(count);
						flag = false;
						break;
					}
				}
				if(flag){
					var newArr = id_search(id,count);
					console.log("---",newArr);
					newArr.goods_sel = true;
					newArr.goods_type = "制服回收";
					obj.data.push(newArr);
				}
				return obj;
			}
			
			/*--制服领用--*/
			$(".shop_list_ul").on("click",".list_li .receive",function(){
				var cs = JSON.parse(sessionStorage.getItem("cart_shop"));
				var myId = $(this).attr("data-id");
				var myCount = 1;
				console.log(cs,myId,myCount);
				if(cs==null){
					var cart_obj = {};
					cart_obj.data = [];
					var myShop = id_search(myId,myCount);
					myShop.goods_type = "制服领用";
					myShop.goods_sel = true;
					cart_obj.data.push(myShop);
					sessionStorage.setItem("cart_shop",JSON.stringify(cart_obj));
				}else{
					//console.log(cs);
					
					var new_cart_obj = id_repeat(myId,myCount,cs);
					//console.log(new_cart_obj);
					sessionStorage.setItem("cart_shop",JSON.stringify(new_cart_obj));
				}
				
				/*领用成功提示框*/
				$(".receive_prompt").fadeIn(200);
				setTimeout(function(){
					$(".receive_prompt").fadeOut(200);
				},1000);
			
			});
			
			/*--制服回收--*/
			$(".shop_list_ul").on("click",".list_li .callback",function(){
				var cs = JSON.parse(sessionStorage.getItem("cart_shop"));
				var myId = $(this).attr("data-id");
				var myCount = 1;
				console.log(cs,myId,myCount);
				if(cs==null){
					var cart_obj = {};
					cart_obj.data = [];
					var myShop = id_search(myId,myCount);
					myShop.goods_type = "制服回收";
					myShop.goods_sel = true;
					cart_obj.data.push(myShop);
					sessionStorage.setItem("cart_shop",JSON.stringify(cart_obj));
				}else{
					//console.log(cs);
					
					var new_cart_obj = id_repeat2(myId,myCount,cs);
					//console.log(new_cart_obj);
					sessionStorage.setItem("cart_shop",JSON.stringify(new_cart_obj));
				}
				
				/*领用成功提示框*/
				$(".recover_prompt").fadeIn(200);
				setTimeout(function(){
					$(".recover_prompt").fadeOut(200);
				},1000);
			
			});
			
			
		}])
});