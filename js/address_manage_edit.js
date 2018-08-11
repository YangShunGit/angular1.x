
		app.controller("address_manage_editCtlr", ["$scope","$timeout", "$state","AreaService","EditaddrService", function($scope,$timeout, $state,AreaService,EditaddrService) {
			/*返回上一步*/
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			
			
			$scope.myBack = function(){
				console.log($(".fixed_number").val());
				if($scope.flag_address.receivername==$(".cargo_people").val()
				&&$scope.flag_address.receivermobile==$(".phone_number").val()
				&&$scope.flag_address.receiveraddress== $(".detail_address").val()
				&&$scope.flag_address.zip==$(".postalcode").val()
				&&$scope.flag_address.receiverstatename==$scope.all_address.receiverstatename
				&&$scope.flag_address.receivercityname==$scope.all_address.receivercityname
				&&$scope.flag_address.receiverdistrictname==$scope.all_address.receiverdistrictname
				){
					if($scope.flag_address.receivertel==null&&$(".fixed_number").val()==""){
						window.history.go(-1);
					}else if($scope.flag_address.receivertel==$(".fixed_number").val()){
						window.history.go(-1);
					}else{
						$(".mask_confirm .txt").html("修改的信息还未保存，确认现在返回么？");
						$(".mask_confirm").css("display", "block");
						$(".mask_confirm").on("click",".yes",function(){
							$(".mask_confirm").css("display", "none");
							window.history.go(-1);
						});
						$(".mask_confirm").on("click",".no",function() {
							$(".mask_confirm").css("display", "none");
						});
					}
				}else{
					$(".mask_confirm .txt").html("修改的信息还未保存，确认现在返回么？");
					$(".mask_confirm").css("display", "block");
					$(".mask_confirm").on("click",".yes",function(){
						$(".mask_confirm").css("display", "none");
						window.history.go(-1);
					});
					$(".mask_confirm").on("click",".no",function() {
						$(".mask_confirm").css("display", "none");
					});
				}
			}
			
			
			var placeScroll;
			function placeLoaded() {
				placeScroll = new IScroll(".place_wrapper", {
					preventDefault: false
				});
			}
	
			
			var placeTimer = $timeout(function() {
				placeLoaded();
			}, 200);
			
			var addressScroll;
			function addressLoaded() {
				addressScroll = new IScroll(".address_body_box", {
					preventDefault: false
				});
			}
	
			
			var addressTimer = $timeout(function() {
				addressLoaded();
				$(".address_body_box")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}, 200);
				
			$(".postalcode").on("focus",function(){
				$timeout(function(){
					addressScroll.refresh();
				},200);
				
			})
			
			/*--获取地址信息--*/
			$scope.all_address = AddressEdit;
			$scope.flag_address = $scope.all_address;
			//console.log($scope.all_address,AddressEdit);
			$scope.province = $scope.all_address.receiverstatename;
			$scope.city = $scope.all_address.receivercityname;
			$scope.area =  $scope.all_address.receiverdistrictname;
			/*--switchery--*/
			var elem = document.querySelector('.js-switch');

			/*--判断是否默认，开关显示--*/
			if($scope.all_address.isdefault == 1) {
				$(elem).attr("checked", "checked");
				var switchery = new Switchery(elem);
			} else {
				$(elem).removeAttr("checked");
				var switchery = new Switchery(elem);
			}
			
			$(".switch").on("click",function(){
				if($scope.all_address.isdefault == 1) {
					$scope.all_address.isdefault = 0;
				} else {
					$scope.all_address.isdefault = 1;
				}
			})
			
			
			//=============
			//地址选择
			//=============
			var session_address;
			$scope.store_address = function(){
				
				session_address={};
				var myPlace = AreaData(1);
				AreaService.listData(myPlace).then(function(res){
					console.log(res);
					$scope.placeInfo = res.data.resources[0].areas;
					
					$timeout(function(){
						placeScroll.refresh();
						$(".place").css({
							'top':'0'
						});
						$(".place_mask").css({
							'bottom':'0px',
							'transition':'all 300ms'
						});
						
					},200);
				})
			}
			
			$scope.place = function($event){
				$timeout(function(){
				placeScroll.refresh();
			},200);
				var areaid = $($event.target).attr("areaid");
				var parentid = $($event.target).attr("parentid");
				var areaname = $($event.target).attr("areaname");
				console.log(areaid);
				$(".box_li").removeAttr("id");
				var myPlace = AreaData(areaid);
				
				if(parentid == "1"){
					session_address.receiverstate = areaid;
					session_address.receiverstatename = areaname;
					$scope.province = session_address.receiverstatename;
					$scope.city ="请选择";
					$(".city").attr("id","placeSel");
					$scope.area ="";
				}else if(parentid.length == 3){
					session_address.receivercity = areaid;
					session_address.receivercityname = areaname;
					$scope.city = session_address.receivercityname;
					$scope.area ="请选择";
					$(".area").attr("id","placeSel");
				}else{
					session_address.receiverdistrict = areaid;
					session_address.receiverdistrictname = areaname;
					$scope.area = session_address.receiverdistrictname;
				}
				AreaService.listData(myPlace).then(function(res){
					console.log(res);
					
					$scope.placeInfo = res.data.resources[0].areas;
					if($scope.placeInfo.length==0){
						$scope.all_address.receiverstate = session_address.receiverstate;
						$scope.all_address.receiverstatename = session_address.receiverstatename;
						$scope.all_address.receivercity = session_address.receivercity;
						$scope.all_address.receivercityname = session_address.receivercityname;
						$scope.all_address.receiverdistrict = session_address.receiverdistrict;
						$scope.all_address.receiverdistrictname = session_address.receiverdistrictname;
						$(".place_mask").css({
							'bottom':"-400px",
							"transition":"all 300ms"
						});
						$timeout(function(){
							$(".place").css("top","100%");
						},300);
						
					}
				})
			}
			
			$scope.cancel_place = function(){
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
				$scope.province = $scope.all_address.receiverstatename;
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
			}
			//点击蒙版地址选择消失
			$(".addressPage").on("click",".placeCancelMask",function(){
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
				$scope.province = $scope.all_address.receiverstatename;
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
			})
			
			/*--点击删除地址--*/
			$scope.go_edit = function(){
				$(".mask_confirm .txt").html("确定要删除此地址？");
				$(".mask_confirm").css("display", "block");
				$(".mask_confirm").on("click",".yes",function() {
					$(".mask_confirm").css("display", "none");
					$(".is_load").css("display","block");
					
					var isDel = {
					  "act": "del",
					  "addressid": $scope.all_address.addressid,
					  "receivername": "",
					  "receivertel": "",
					  "receivermobile": "",
					  "receiverstate": "",
					  "receivercity": "",
					  "receiverdistrict": "",
					  "receiveraddress":"",
					  "organizeid":"",
					  "isdefault": "",
					  "zip":"",
					}
		        	var myEditaddrData = EditaddrData(isDel.act,isDel.addressid,isDel.receivername,isDel.receivertel,isDel.receivermobile,isDel.receiverstate,isDel.receivercity,isDel.receiverdistrict,isDel.receiveraddress,isDel.organizeid,isDel.isdefault,isDel.zip);
		        	EditaddrService.listData(myEditaddrData).then(function(res){
		        		console.log(res);
		        		if(res.data.error==0){
		        			$(".is_load").css("display","none");
		        			window.history.go(-1);
		        		}
		        	})
				})
				$(".mask_confirm").on("click",".no",function() {
					$(".mask_confirm").css("display","none");
				})
	        }
			
			/*--点击保存--*/
			$(".address_foot").on("click", function() {
				$(".is_load").css("display","block");
				$scope.all_address.fulladdress = $scope.all_address.receiverstatename+$scope.all_address.receivercityname+$scope.all_address.receiverdistrictname+$scope.all_address.receiveraddress;
				$scope.all_address.receivername = $(".cargo_people").val();
				$scope.all_address.receivermobile = $(".phone_number").val();
				$scope.all_address.receivertel = $(".fixed_number").val();
				$scope.all_address.receiveraddress = $(".detail_address").val();
				$scope.all_address.zip = $(".postalcode").val();
				
				/*验证*/
				var phone_reg;
				var Mob_reg = /^(010|02\d|0[3-9]\d{2,3})-\d{7,8}$/.test($scope.all_address.receivertel);
				var postcode_reg = /^[1-9][0-9]{5}$/.test($scope.all_address.zip);
				if(!($scope.all_address.receivermobile == ""&&$scope.all_address.receivertel == "")){
					if($scope.all_address.receivermobile != ""){
						phone_reg = /^(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9])[0-9]{8}$/.test($scope.all_address.receivermobile);
					}else{
						phone_reg = true;
					}
				}
				console.log($scope.all_address.receivermobile == "",$scope.all_address.receivertel == "",/^(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9])[0-9]{8}$/.test($scope.all_address.receivermobile))
				if($scope.all_address.receivername == "") {
					$(".is_load").css("display","none");
					$(".prompt .txt").html("填写收货人");
					$(".prompt").fadeIn(200);
					setTimeout(function() {
						$(".prompt").fadeOut(200)
					}, 1000);
					
				} else if(!phone_reg) {
					$(".is_load").css("display","none");
					$(".prompt .txt").html("手机号和固话必须填写一项");
					$(".prompt").fadeIn(200);
					setTimeout(function(){
						$(".prompt").fadeOut(200)
					}, 1000);
					
				}else if($scope.all_address.receiveraddress == "") {
					$(".is_load").css("display","none");
					$(".prompt .txt").html("填写详细地址")
					$(".prompt").fadeIn(200);
					setTimeout(function() {
						$(".prompt").fadeOut(200)
					}, 1000);
					
				}/* else if($scope.all_address.zip != "" && !postcode_reg) {
					$(".prompt").fadeIn(200);
					setTimeout(function() {
						$(".prompt").fadeOut(200)
					}, 1000);
					$(".prompt .txt").html("邮编有误");
				}*/ else {
		        	
		        	
		        	var isEdit = {
					  "act": "up",
					  "addressid": $scope.all_address.addressid,
					  "receivername": $scope.all_address.receivername,
					  "receivertel": $scope.all_address.receivertel,
					  "receivermobile": $scope.all_address.receivermobile,
					  "receiverstate": $scope.all_address.receiverstate,
					  "receivercity": $scope.all_address.receivercity,
					  "receiverdistrict": $scope.all_address.receiverdistrict,
					  "receiveraddress": $scope.all_address.receiveraddress,
					  "organizeid": $scope.all_address.organizeid,
					  "isdefault": $scope.all_address.isdefault,
					  "zip": $scope.all_address.zip,
					}
		        	var myEditaddrData = EditaddrData(isEdit.act,isEdit.addressid,isEdit.receivername,isEdit.receivertel,isEdit.receivermobile,isEdit.receiverstate,isEdit.receivercity,isEdit.receiverdistrict,isEdit.receiveraddress,isEdit.organizeid,isEdit.isdefault,isEdit.zip);
		        	EditaddrService.listData(myEditaddrData).then(function(res){
		        		console.log(res);
		        		$(".is_load").css("display","none");
		        		console.log($scope.all_address);
		        		sessionStorage.setItem("address",JSON.stringify($scope.all_address));
		        		sessionStorage.removeItem("editAddressing");
		        		window.history.go(-1);
		        	})
        	
        	
        		}
					
			});
			
			//==================输入框限制输入=================
			
			var oldVal,pressFlag=true;
	        //限制固话input的输入
	        $(".fixed_number").on("keydown",function(){
	        	if(pressFlag){
	        		oldVal = $(this).val();
	        		pressFlag = false;
	        	}
	        })
	        $(".fixed_number").on("keyup",function(){
	        	var newVal = $(this).val();
	        	var reg = /^\d*-{0,1}\d*$/.test(newVal);
	        	console.log(reg);
	        	if(reg==false){
	        		$(".fixed_number").val(oldVal);
	        	}
	        	pressFlag = true;
	        });
	        //手机号码input的输入
	        $(".phone_number").on("keydown",function(){
	        	if(pressFlag){
	        		oldVal = $(this).val();
	        		pressFlag = false;
	        	}
	        })
	        $(".phone_number").on("keyup",function(){
	        	var newVal = $(this).val();
	        	var reg = /^\d*$/.test(newVal);
	        	console.log(reg);
	        	if(reg==false){
	        		$(".phone_number").val(oldVal);
	        	}
	        	pressFlag = true;
	        });
	        //邮编input的输入
	        $(".postalcode").on("keydown",function(){
	        	if(pressFlag){
	        		oldVal = $(this).val();
	        		pressFlag = false;
	        	}
	        })
	        $(".postalcode").on("keyup",function(){
	        	var newVal = $(this).val();
	        	var reg = /^\d*$/.test(newVal);
	        	console.log(reg);
	        	if(reg==false){
	        		$(".postalcode").val(oldVal);
	        	}
	        	pressFlag = true;
	        });

				
			
			

		}])
