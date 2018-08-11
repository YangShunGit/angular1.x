
		app.controller("receiver_addressCtlr",["$scope","$timeout","$state","AddressService",function($scope,$timeout,$state,AddressService){
			/*返回上一步*/
			$scope.myBack = function(){
				
				window.history.go(-1);
			}
			
			var key="";
			
			$timeout(function(){
				$(".if_empty p").html("您暂无收货地址");
			},300);
			
			var receiverScroll;
	
			function receiverLoaded() {
				receiverScroll = new IScroll(".receiver_body_box", {
					preventDefault: false
				});
			}
	
			
			var receiverTimer = $timeout(function() {
				receiverLoaded();
				$(".receiverAddress")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 0);
			
			
			
			//判断接收到的数据是否为空
			function judgeRes(res){
				if(res.data.resources[0].address.length==0){
					$(".receiver_body_box>ul").css("display","none");
					$(".if_empty").css("display","block");
				}else{
					$(".if_empty").css("display","none");
					$(".receiver_body_box>ul").css("display","block");
					reduce(res);
					$scope.mask();
				}
			}
			
			function reduce(res){
				$scope.all_address = res.data.resources[0].address;
				$(".receiver_body_box ul li.receiver_li").remove();
				for(var i=0;i<$scope.all_address.length;i++){
					var myLi = $("#receiver_li").clone(true);
					$(myLi).removeAttr("id").attr({"class":"receiver_li ab"});
					$(myLi).find(".info_place").html($scope.all_address[i].organizename);
					$(myLi).find(".info_name").html($scope.all_address[i].receivername);
					$(myLi).find(".fullAddress").html($scope.all_address[i].fulladdress);
					$(myLi).find(".cargo_receiver_sel i").attr("data-index",i);
					$(myLi).find(".info_box").attr("data-index",i);
					if($scope.all_address[i].receivermobile==null||$scope.all_address[i].receivermobile==""){
						$(myLi).find(".info_phone").css("display","none");
						$(myLi).find(".info_tel").css("display","block");
						$(myLi).find(".info_tel").html($scope.all_address[i].receivertel);
					}else{
						$(myLi).find(".info_phone").css("display","block");
						$(myLi).find(".info_tel").css("display","none");
						
						$(myLi).find(".info_phone").html($scope.all_address[i].receivermobile);
					}
					if($scope.all_address[i].isdefault==1){
						$(myLi).find(".info_default").css("display","inline-block");
					}else{
						$(myLi).find(".info_default").css("display","none");
					}
					$(myLi).appendTo(".receiver_body_box ul");
				}
				$timeout(function(){
					receiverScroll.refresh();
				},200);
			}
			
			
			
			
			
			var myAddressData = AddressData("");
			AddressService.listData(myAddressData).then(function(res){
				console.log(111,res);
				if(res.data.resources[0].address.length==0){
					$(".receiver_body_box>ul").css("display","none");
					$(".if_empty").css("display","block");
					sessionStorage.setItem("noAddressFlag",'true');
					sessionStorage.removeItem("address");
				}else{
					$(".if_empty").css("display","none");
					$(".receiver_body_box>ul").css("display","block");
					reduce(res);
					$scope.mask();
					//当发现缓存的地址被删除了，则清理掉缓存；
					var sameAddressFlag = true;
					var oldAddress = JSON.parse(sessionStorage.getItem("address"));
					if(oldAddress!=null){
						for(var k=0;k<res.data.resources[0].address.length;k++){
							if(res.data.resources[0].address[k].addressid==oldAddress.addressid){
								sameAddressFlag =false;
							}
						}
						if(sameAddressFlag){
							sessionStorage.removeItem("address");
						}
					}
					
				}
				
			})
			
				
			/*--点击默认地址--*/
			$(".receiver_body_box").on("click","li .info_box",function(){
				var index = $(this).attr("data-index");
				$scope.myAddress = {
					addressid:$scope.all_address[index].addressid,
					organizeid:$scope.all_address[index].organizeid,
					fulladdress:$scope.all_address[index].fulladdress,
					organizename:$scope.all_address[index].organizename,
					receivername:$scope.all_address[index].receivername,
					postfee:$scope.all_address[index].postfee,
					receivertel:$scope.all_address[index].receivertel,
					receivermobile:$scope.all_address[index].receivermobile,
					isdefault:$scope.all_address[index].isdefault
				}
				sessionStorage.setItem("address",JSON.stringify($scope.myAddress));
				$(this).parents("li").siblings().find(".default_sel").css("background-position","-411px -233px");
				$(this).find(".default_sel").css("background-position","-378px -233px");
				window.history.go(-1);
			})
			
			
			
		
			
			
			//点击搜索地址
			$scope.sou = function(){
				key = $(".search_it").val();
				if(key!=""){
					$(".is_load").css("display","block");
					myAddressData = AddressData(key);
					AddressService.listData(myAddressData).then(function(res){
						console.log(111,res);
						$(".search_it").val("");
						judgeRes(res);
						reduce(res);
						$(".is_load").css("display","none");
						$scope.mask();
					})
				}
			}
			
			$scope.mask = function(){
				$(".search_it").val("");
				$(".maskBlack").css("display","none");
				$(".search_go").css("display","none");
				$(".search_input input").attr("placeholder","");
				$(".receiver_right").css({
					'width':'20%',
					'transition':'all 300ms'
				});
			}
		
			$scope.is_search = function(){
				$(".maskBlack").css("display","block");
				$(".receiver_right").css({
					'width':'97%',
					'transition':'all 300ms'
				});
				$timeout(function(){
					$(".search_input input").attr("placeholder","请填写关键字");
					$(".search_go").css("display","block");
					$(".search_it").val(key);
				},300);
			}
			
			$scope._addressEdit = function($event){
				var that_index = $($event.target).attr("data-index");
				console.log("=========",that_index,$scope.all_address);
				sessionStorage.setItem("editAddress",JSON.stringify($scope.all_address[that_index]));
				$(".is_load").css("display","block");
				$state.go("address_edit");
			}
		
	}])
