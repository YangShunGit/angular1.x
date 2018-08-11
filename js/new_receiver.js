
		app.controller("new_receiverCtlr",["$scope","$timeout","$state","EditaddrService","OrganizesService","AreaService",function($scope,$timeout,$state,EditaddrService,OrganizesService,AreaService){
			/*返回上一步*/
		$scope.myBack = function(){
			window.history.go(-1);
		}
		
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		
		var addressScroll,placeScroll,costScroll;
		function addressLoaded() {
			addressScroll = new IScroll(".address_body_box", {
				preventDefault: false
				
			});
			placeScroll = new IScroll(".place_wrapper", {
				preventDefault: false
				
			});
			costScroll = new IScroll(".cost_sel_wrapper", {
				preventDefault: false
				
			});
		}

		$scope.province = "请选择";
		$scope.city = "";
		$scope.area = "";
		$timeout(function(){
			$(".province").attr("id","placeSel");
		},200);
		
		var addressTimer = $timeout(function() {
			addressLoaded();
			$(".addressPage")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		}, 200);
		
		$scope.all_address={
			organizename:"",
			organizeid:"",
			receivername:"",
			receivermobile:"",
			receivertel:"",
			receiverstate:"",
			receiverstatename:"",
			receivercity:"",
			receivercityname:"",
			receiverdistrict:"",
			receiverdistrictname:"",
			receiveraddress:"",
			fulladdress:"",
			isdefault:0,
			zip:""
		}
		$scope.edit_address = JSON.parse(sessionStorage.getItem("editAddressing"));
		if($scope.edit_address!=null){
			$scope.all_address={
				organizename:$scope.edit_address.organizename,
				organizeid:$scope.edit_address.organizeid,
				receivername:$scope.edit_address.receivername,
				receivermobile:$scope.edit_address.receivermobile,
				receivertel:$scope.edit_address.receivertel,
				receiverstate:$scope.edit_address.receiverstate,
				receiverstatename:$scope.edit_address.receiverstatename,
				receivercity:$scope.edit_address.receivercity,
				receivercityname:$scope.edit_address.receivercityname,
				receiverdistrict:$scope.edit_address.receiverdistrict,
				receiverdistrictname:$scope.edit_address.receiverdistrictname,
				receiveraddress:$scope.edit_address.receiveraddress,
				fulladdress:$scope.edit_address.fulladdress,
				isdefault:$scope.edit_address.isdefault,
				zip:$scope.edit_address.zip
			}
		}
		
		OrganizesService.listData(myIndexData).then(function(res){
			console.log(res);
			$scope.cost_data = res.data.resources[0].organizes;
		})
		
		$scope.change_check = function(){
			if($scope.all_address.isdefault==1){
				$scope.all_address.isdefault=0;
			}else{
				$scope.all_address.isdefault=1;
			}
		}
		
		$scope.organize_sel = function(){
			$(".place").css("z-index","200");
			$(".cost_sel").css("z-index","300");
			$(".maskBlack").css("display","block");
			$(".cost_sel").css({
				"bottom":"0",
				"transition":"all 300ms"
			});
		}
		
		$timeout(function(){
		$(".cost_sel_wrapper").on("click",".sel_list li", function() {
			console.log("chenggong");
			$scope.all_address.organizename = $(this).attr("organizename");
			$scope.all_address.organizeid = $(this).attr("organizeid");
			$(".sel_draw").css({
				"display": "none"
			});
			$(this).children(".sel_draw").css({
				"display": "block"
			});	
			$(".cost_sel").css({
				"bottom":"-400px",
				"transition":"all 300ms"
			});
			$timeout(function(){
				$(".maskBlack").css("display","none");
			},300);
			$scope.$digest();
		})
		},500);
		
		var session_address;
		$scope.store_address = function(){
			var myPlace = AreaData(1);
			AreaService.listData(myPlace).then(function(res){
				console.log(res);
				$scope.placeInfo = res.data.resources[0].areas;
				$timeout(function(){
					placeScroll.refresh();
				},200);
			})
			if($scope.all_address.receiverdistrictname!=""){
				$(".box_li").removeAttr("id");
			}
			$(".place").css("z-index","300");
			$(".cost_sel").css("z-index","200");
			session_address={};
			$(".place").css({
				'top':'0'
			});
			$(".place_mask").css({
				'bottom':'0px',
				'transition':'all 300ms'
			});
		}
		
		$scope.place = function($event){
			$timeout(function(){
				placeScroll.refresh();
			},200);
			
			var areaid = $($event.target).attr("areaid");
			var parentid = $($event.target).attr("parentid");
			var areaname = $($event.target).attr("areaname");
			$(".box_li").removeAttr("id");
			console.log(areaid);
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
				$timeout(function(){
					placeScroll.refresh();
				},200);
			})
		}
		
		$scope.cancel_cost = function(){
			$(".cost_sel").css({
				"bottom":"-400px",
				"transition":"all 300ms"
			});
			$timeout(function(){
				$(".maskBlack").css("display","none");
			},300);
		}
		$scope.mask = function(){
			$(".cost_sel").css({
				"bottom":"-400px",
				"transition":"all 300ms"
			});
			$timeout(function(){
				$(".maskBlack").css("display","none");
			},300);
		}
		
		$scope.cancel_place = function(){
			$(".place_mask").css({
				'bottom':"-400px",
				"transition":"all 300ms"
			});
			$timeout(function(){
				$(".place").css("top","100%");
			},300);
			if($scope.all_address.receiverstatename==""){
				$(".box_li").removeAttr("id");
				$(".province").attr("id","placeSel");
				$scope.province="请选择";
				$scope.city="";
				$scope.area ="";
			}else{
				$scope.province = $scope.all_address.receiverstatename;
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
			}
			
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
			if($scope.all_address.receiverstatename==""){
				$(".box_li").removeAttr("id");
				$(".province").attr("id","placeSel");
				$scope.province="请选择";
				$scope.city="";
				$scope.area ="";
			}else{
				$scope.province = $scope.all_address.receiverstatename;
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
			}
		})
		
		
		
		var elems = document.querySelectorAll('.js-switch');
        for (var i = 0; i < elems.length; i++) {
          var switchery = new Switchery(elems[i]);
        }
		
		$scope.add = function(){
			
			$scope.all_address.receivername = $(".cargo_people").val();
			$scope.all_address.receivermobile = $(".phone_number").val();
			$scope.all_address.receivertel = $(".fixed_number").val();
			$scope.all_address.receiveraddress = $(".detail_address").val();
			$scope.all_address.zip = $(".postalcode").val();
			$scope.all_address.fulladdress = $scope.all_address.receiverstatename+$scope.all_address.receivercityname+$scope.all_address.receiverdistrictname+$scope.all_address.receiveraddress;
			console.log($scope.all_address.fulladdress);
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
			
			if($scope.all_address.organizename == "") {
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
				$(".prompt .txt").html("请选择成本中心");
			} else if($scope.all_address.receivername == "") {
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
				$(".prompt .txt").html("填写收货人");
			} else if(!phone_reg) {
				$(".prompt .txt").html("手机号和固话必须填写一项");
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
			}else if($scope.all_address.receiverdistrict == "") {
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
				$(".prompt .txt").html("请选择地址")
				
			}else if($scope.all_address.receiveraddress == "") {
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
				$(".prompt .txt").html("填写详细地址")
			}/* else if($scope.all_address.zip != "" && !postcode_reg) {
				$(".prompt").fadeIn(200);
				setTimeout(function() {
					$(".prompt").fadeOut(200)
				}, 1000);
				$(".prompt .txt").html("邮编有误");
			}*/ else {
				$(".is_load").css("display","block");
				var isAdd ={
						  "act": "add",
						  "addressid": "",
						  "receivername": $scope.all_address.receivername,
						  "receivertel": $scope.all_address.receivertel,
						  "receivermobile":$scope.all_address.receivermobile,
						  "receiverstate": $scope.all_address.receiverstate,
						  "receivercity": $scope.all_address.receivercity,
						  "receiverdistrict": $scope.all_address.receiverdistrict,
						  "receiveraddress": $scope.all_address.receiveraddress,
						  "organizeid": $scope.all_address.organizeid,
						  "isdefault": $scope.all_address.isdefault,
						  "zip": $scope.all_address.zip,
						  "postfee":"0"
						}
				var myEditaddrData = EditaddrData(isAdd.act,isAdd.addressid,isAdd.receivername,isAdd.receivertel,isAdd.receivermobile,isAdd.receiverstate,isAdd.receivercity,isAdd.receiverdistrict,isAdd.receiveraddress,isAdd.organizeid,isAdd.isdefault,isAdd.zip);
				EditaddrService.listData(myEditaddrData).then(function(res){
					console.log(res);
					if(res.data.error==1){
						alert(res.data.msg);
					}else{
						var fillNewAddress = sessionStorage.getItem("fillNewAddress");
						$(".is_load").css("display","none");
						$scope.all_address.addressid = res.data.resources[0].addressid;
						$scope.all_address.postfee = res.data.resources[0].postfee;
						sessionStorage.setItem("address",JSON.stringify($scope.all_address));
		        		sessionStorage.removeItem("editAddressing");
		        		if(fillNewAddress=='true'){
		        			sessionStorage.removeItem("fillNewAddress");
		        			sessionStorage.removeItem("noAddressFlag");
		        			window.history.go(-1);
		        		}else{
		        			window.history.go(-2);
		        		}
		        		
	        		}
				})
			}
		}
		
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
