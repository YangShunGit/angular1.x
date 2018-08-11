
		app.controller("register1Ctlr",[ "$scope","$state","$timeout","AreaService",function($scope,$state,$timeout,AreaService) {
			/*返回上一步*/
			$scope.myBack = function() {
				window.history.go(-1);
			}
			$scope.myClose = function() {
				window.history.go(-1);
			}
			
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
			$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			
			
			$(".company_name").val(ApplyVip.companyname);
			$(".company_more_address").val(ApplyVip.address);
			$(".link_man").val(ApplyVip.contacts);
			$(".link_number").val(ApplyVip.phone);
			$(".link_email").val(ApplyVip.email);
			$(".telephone").val(ApplyVip.tel);
			
			
			var myAllAddress =sessionStorage.getItem("all_address");
			console.log(myAllAddress);
			if(myAllAddress!=null){
				myAllAddress = JSON.parse(myAllAddress);
				$scope.all_address={
					receiverstate:ApplyVip.province,
					receiverstatename:myAllAddress.receiverstatename,
					receivercity:ApplyVip.city,
					receivercityname:myAllAddress.receivercityname,
					receiverdistrict:ApplyVip.area,
					receiverdistrictname:myAllAddress.receiverdistrictname
				};
			}else{
				$scope.all_address={
					receiverstate:"",
					receiverstatename:"",
					receivercity:"",
					receivercityname:"",
					receiverdistrict:"",
					receiverdistrictname:""
				};
			}
			
			var register1Scroll,placeScroll;
			function register1Loaded(){
				register1Scroll=new IScroll(".register1_wrapper",{
					preventDefault:false,
					onBeforeScrollStart:null
				});
				placeScroll = new IScroll(".place_wrapper", {
					preventDefault: false
				});
			}
			
			var register1Timer=$timeout(function(){
				register1Loaded();
				$(".register1")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);

			/*下一步的判断*/
		
			$scope.company_sub = function() {
				//$state.go("upload_license");
				var company_name = $(".company_name").val();
				var company_more_address = $(".company_more_address").val();
				var link_man = $(".link_man").val();
				var link_number = $(".link_number").val();
				var link_email = $(".link_email").val();
				var telephone = $(".telephone").val();
				var link_number_reg = /^(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9])[0-9]{8}$/.test(link_number);
				
				//var telephone_reg = /^(010|02\d|0[3-9]\d{2,3})-\d{7,8}$/.test(telephone);				
				var telephone_reg = true;	
				
				
				
				/*判断是否为空*/
				if(company_name == "") {					
						$(".tips").html("公司名称不能为空");
						$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);				
				}
				else if($scope.all_address.receiverdistrictname == "") {					
						$(".tips").html("请选择公司所在地")
						$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);					
				}
				else if(company_more_address == "") {					
						$(".tips").html("公司详细地址不能为空")
						$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);					
				}
				else if(link_man == "") {					
						$(".tips").html("联系人姓名不能为空");
						$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);					
				}
				else if(link_number == "") {					
						$(".tips").html("手机号码不能为空");
						$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);					
								
				}/*判断所填信息格式是否正确*/
				else if(link_number_reg==false){
					$(".tips").html("请输入11位的手机号码");
					$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);	
				}
				else if(link_email==""){
					$(".tips").html("邮箱不能为空");
					$(".tips").fadeIn(200);
						setTimeout(function() {
							$(".tips").fadeOut(200);
						}, 1000);	
				}
				else{
					ApplyVip.companyname = company_name;
					ApplyVip.address = company_more_address;
					ApplyVip.contacts = link_man;
					ApplyVip.phone = link_number;
					ApplyVip.email = link_email;
					ApplyVip.tel = telephone;
					ApplyVip.province = $scope.all_address.receiverstate;
					ApplyVip.city = $scope.all_address.receivercity;
					ApplyVip.area = $scope.all_address.receiverdistrict;
					sessionStorage.setItem("all_address",JSON.stringify($scope.all_address));
					console.log(ApplyVip);
					$state.go("upload_license");
				}
			}
			
			
			$scope.clear_value = function($event) {
				/*清除所在行的信息*/
				console.log($($event.target).siblings(".set_input"));
				$($event.target).siblings(".set_input").val("");
			}
			
			var session_address;
			$scope.province="请选择";
			$scope.city="";
			$scope.area ="";
			$(".province").attr("id","placeSel");
			$scope.store_address = function(){
				$("input").blur();
				if($scope.area==""){
					$(".province").attr("id","placeSel");
				}
				var myPlace = AreaData(1);
				AreaService.listData(myPlace).then(function(res){
					console.log(res);
					$scope.placeInfo = res.data.resources[0].areas;
					$timeout(function(){
						placeScroll.refresh();
					},200);
				});
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
				if($scope.all_address.receiverstatename==""){
					$scope.province = "请选择";
				}else{
					$scope.province = $scope.all_address.receiverstatename;
				}
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
				if($scope.area==""){
					$(".box_li").removeAttr("id");
					$(".province").attr("id","placeSel");
				}
			}
			$(".register1").on("click",".placeCancelMask",function(){
				$(".place_mask").css({
					'bottom':"-400px",
					"transition":"all 300ms"
				});
				$timeout(function(){
					$(".place").css("top","100%");
				},300);
				if($scope.all_address.receiverstatename==""){
					$scope.province = "请选择";
				}else{
					$scope.province = $scope.all_address.receiverstatename;
				}
				$scope.city =  $scope.all_address.receivercityname;
				$scope.area = $scope.all_address.receiverdistrictname;
				if($scope.area==""){
					$(".box_li").removeAttr("id");
					$(".province").attr("id","placeSel");
				}
			})
			
			
			$(".empty").on("click",function(){
				$(this).siblings("input").val("");
			});
			
		}])
