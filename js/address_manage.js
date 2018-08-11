app.controller("address_manageCtlr",["$scope","$state","$timeout","AddressService",function($scope,$state,$timeout,AddressService){
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			var key = "";
			
			$timeout(function(){
				$(".if_empty p").html("您暂无收货地址");
			},300);
			
			
			/*滑动*/
			var address_manageScroll;
			function address_manageLoaded(){
				address_manageScroll=new IScroll(".receiver_wrapper",{
					preventDefault:false,
					probeType:3
				});
				address_manageScroll.on("scroll",function(){
					
				})
			}
			
			var address_manageTimer=$timeout(function(){
				address_manageLoaded();
				$(".receiver_wrapper")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},100);	
			
			//填入地址为空时显示文字
			
			//判断接收到的数据是否为空
			function judgeRes(res){
				if(res.data.resources[0].address.length==0){
					$(".if_empty p").html("未能找到相关地址");
					$(".receiver_body_box>ul").css("display","none");
					$(".if_empty").css("display","block");
				}else{
					$(".if_empty").css("display","none");
					$(".receiver_body_box>ul").css("display","block");
					reduce(res);
					$scope.mask();
				}
			}
			
			//数据处理函数
			function reduce(res){
				$scope.all_address = res.data.resources[0].address;
				$(".receiver_body_box ul li.receiver_li").remove();
				for(var i=0;i<$scope.all_address.length;i++){
					var myLi = $("#receiver_li").clone(true);
					$(myLi).removeAttr("id").attr({"class":"receiver_li ab","data-index":i});
					$(myLi).find(".info_place").html($scope.all_address[i].organizename);
					$(myLi).find(".info_name").html($scope.all_address[i].receivername);
					$(myLi).find(".fullAddress").html($scope.all_address[i].fulladdress);
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
					address_manageScroll.refresh();
				},200);
			}
			
			var myAddressData = AddressData("");
			AddressService.listData(myAddressData).then(function(res){
				console.log(111,res);
				if(res.data.resources[0].address.length==0){
					$(".receiver_body_box>ul").css("display","none");
					$(".if_empty").css("display","block");
				}else{
					$(".if_empty").css("display","none");
					$(".receiver_body_box>ul").css("display","block");
					reduce(res);
					$scope.mask();
				}
				reduce(res);
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
			
			
			/*--点击编辑地址--*/
			$(".receiver_body_box").on("click",".receiver_li",function(){
				var index = $(this).attr("data-index");
				AddressEdit = $scope.all_address[index];
				console.log(AddressEdit);
				$state.go("address_manage_edit");
			})
			
			
			
			
			
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
		
		}])
