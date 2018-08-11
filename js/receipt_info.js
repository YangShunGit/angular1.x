
		app.controller("receipt_infoCtlr", ["$scope", "$state","$timeout","InvoiceService",function($scope, $state,$timeout,InvoiceService) {
			$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");

			/*返回上一步*/
			$scope.myBack = function() {
				if($scope.invoice.invoiceflag == "0") {
					window.history.go(-1);
				}else if($scope.invoice.invoiceflag == "1") {
					if($(".common_content .receipt_name").val()==""&&$(".common_content .receipt_code").val()==""){
						window.history.go(-1);
					}else{
						$(".mask_confirm .txt").html("填写的信息还未保存，确认现在返回么？");
						$(".mask_confirm").css("display", "block");
						$(".mask_confirm").on("click",".yes",function(){
							$(".mask_confirm").css("display", "none");
							window.history.go(-1);
						});
						$(".mask_confirm").on("click",".no",function() {
							$(".mask_confirm").css("display", "none");
						});
					}
				}else if($scope.invoice.invoiceflag == "2") {
						if($(".appre_ul .receipt_name").val()==""
						&&$(".appre_ul .receipt_code").val()==""
						&&$(".appre_ul .receipt_address").val()==""
						&&$(".appre_ul .receipt_number").val()==""
						&&$(".appre_ul .receipt_bank").val()==""
						&&$(".appre_ul .receipt_account").val()==""){
							window.history.go(-1);
						}else{
							$(".mask_confirm .txt").html("填写的信息还未保存，确认现在返回么？");
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
				
			}
			
			/*滚动*/
			var receipt_infoScroll;
			function receipt_infoLoaded(){
				receipt_infoScroll=new IScroll(".receipt_info_wrapper",{
					preventDefault:false
				});
			}
			
			var receipt_infoTimer=$timeout(function(){
				receipt_infoLoaded();
				$(".receipt")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);
			
			var myInvoice = JSON.parse(sessionStorage.getItem("invoice"));
			if(myInvoice!=null){
				$scope.invoice = {
					"invoiceflag": myInvoice.invoiceflag,
					"invoiceid":  myInvoice.invoiceid,
					"invoicecompany":  myInvoice.invoicecompany,
					"invoicetax":  myInvoice.invoicetax,
					"invoiceaddress":  myInvoice.invoiceaddress,
					"invoicetel":  myInvoice.invoicetel,
					"invoiceaccount":  myInvoice.invoiceaccount,
					"invoicebank":  myInvoice.invoicebank,
					"isdefault":  myInvoice.isdefault
				}
			}else{
				$scope.invoice = {
					"invoiceflag": "",
					"invoiceid": "",
					"invoicecompany": "",
					"invoicetax": "",
					"invoiceaddress": "",
					"invoicetel": "",
					"invoiceaccount": "",
					"invoicebank": "",
					"isdefault": ""
				}
			}
			console.log($scope.invoice);
			if($scope.invoice.invoiceflag=="2"){
				$(".mode_sel li").css({
					"border": "1px solid #9b9b9b",
					"color": "#000"
				});
				$(".mode_sel li.add_receipt").css({
					"border": "1px solid #f72e1a",
					"color": "#f72e1a"
				});
				$(".common").css("display","none");
				$(".appreciation").css("display","block");
			   	$(".appre_ul .receipt_name").val($scope.invoice.invoicecompany);
			   	$(".appre_ul .receipt_code").val($scope.invoice.invoicetax);
			   	$(".appre_ul .receipt_address").val($scope.invoice.invoiceaddress);
			   	$(".appre_ul .receipt_number").val($scope.invoice.invoicetel);
			   	$(".appre_ul .receipt_bank").val($scope.invoice.invoicebank);
			   	$(".appre_ul .receipt_account").val($scope.invoice.invoiceaccount);
			}else if($scope.invoice.invoiceflag=="1"){
				$(".mode_sel li").css({
					"border": "1px solid #9b9b9b",
					"color": "#000"
				});
				$(".mode_sel li.normal_receipt").css({
					"border": "1px solid #f72e1a",
					"color": "#f72e1a"
				});
				$(".common").css("display","block");
				$(".appreciation").css("display","none");
				$(".common_content .receipt_name").val($scope.invoice.invoicecompany);
				$(".common_content .receipt_code").val($scope.invoice.invoicetax);
			}else{
				$scope.invoice.invoiceflag = "0";
				$(".mode_sel li").css({
					"border": "1px solid #9b9b9b",
					"color": "#000"
				});
				$(".mode_sel li.no_receipt").css({
					"border": "1px solid #f72e1a",
					"color": "#f72e1a"
				});
				$(".common").css("display","none");
				$(".appreciation").css("display","none");
			}
			
			
			
			
			

			$(".no_receipt").on("click", function() {
				$scope.invoice.invoiceflag = "0";
				var it = this;
				change_receipt(it);
				$(".common").css("display","none");
				$(".appreciation").css("display","none");
				receipt_infoScroll.refresh();
			})
			$(".normal_receipt").on("click", function() {
				$scope.invoice.invoiceflag = "1";
				var it = this;
				change_receipt(it);
				$(".common").css("display","block");
				$(".appreciation").css("display","none");
				//$scope.receipt_info_detail.receipt_name = $scope.receipt_page.receipt_info_detail.receipt_name;
				//$scope.receipt_info_detail.receipt_code = $scope.receipt_page.receipt_info_detail.receipt_code;	
				receipt_infoScroll.refresh();
			})
			$(".add_receipt").on("click", function() {
				$scope.invoice.invoiceflag = "2";
				var it = this;
				change_receipt(it);
				$(".common").css("display","none");
				$(".appreciation").css("display","block");
				//$scope.receipt_info_detail.receipt_name = $scope.receipt_page.receipt_info_detail.receipt_name;
				//$scope.receipt_info_detail.receipt_code = $scope.receipt_page.receipt_info_detail.receipt_code;	
				receipt_infoScroll.refresh();
			})

			/*--点击变色函数--*/
			function change_receipt(it) {
				$(it).siblings().css({
					"border": "1px solid #9b9b9b",
					"color": "#000"
				});
				$(it).css({
					"border": "1px solid #f72e1a",
					"color": "#f72e1a"
				});
				//$scope.receipt_page.receipt_info = $(it).html();
			}
			/*--条件满足跳转函数--*/
			function over_go() {
				var myInvoiceData = InvoiceData($scope.invoice.invoiceflag,$scope.invoice.invoiceid,$scope.invoice.invoicecompany,$scope.invoice.invoicetax,$scope.invoice.invoiceaddress,$scope.invoice.invoicetel,$scope.invoice.invoiceaccount,$scope.invoice.invoicebank,$scope.invoice.isdefault);
				InvoiceService.listData(myInvoiceData).then(function(res){
					console.log(res);
					sessionStorage.setItem("invoice",JSON.stringify(res.data.resources[0]));
					window.history.go(-1);
				})
			}

			/*点击确定*/
			$(".receipt_foot_box").click(function() {
				$(".is_load").css("display","block");
				var code_reg=/^\d{15}|\d{18}|\d{20}$/.test($(".common_content .receipt_code").val());
				var code_reg2=/^\d{15}|\d{18}|\d{20}$/.test($(".appre_ul .receipt_code").val());
				var Mob_reg=/^010|02\d|0[39]\d{2,3}-\d{7,8}$/.test($(".appre_ul .receipt_number").val());
				var bank_reg=/^\d{16,19}$/.test($(".appre_ul .receipt_account").val());
				console.log($(".common_content .receipt_code").val(),code_reg,Mob_reg,bank_reg);
				if($scope.invoice.invoiceflag == "0") {
					$(".is_load").css("display","none");
					over_go();
				} else if($scope.invoice.invoiceflag == "1") {
					if($(".common_content .receipt_name").val() == "") {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
					} else if($(".common_content .receipt_code").val() == ""||!code_reg) {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("纳税人识别号有误");
					}else{
						$(".is_load").css("display","none");
						$scope.invoice.invoicecompany = $(".common_content .receipt_name").val();
						$scope.invoice.invoicetax = $(".common_content .receipt_code").val();
						over_go();
					}
				}else if($scope.invoice.invoiceflag == "2") {
					if($(".appre_ul .receipt_name").val() == "") {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
					} else if($(".appre_ul .receipt_code").val() == ""||!code_reg2) {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("纳税人识别号有误");
					}else if($(".receipt_address").val() == "") {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("填写单位注册地址");
					}else if($(".receipt_number").val() == ""||!Mob_reg) {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("单位注册电话有误");
					}else if($(".receipt_bank").val() == "") {
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("填写单位开户银行");
					}else if($(".receipt_account").val() == ""||!bank_reg){
						$(".is_load").css("display","none");
						$(".prompt").fadeIn(200);
						setTimeout(function() {
							$(".prompt").fadeOut(200)
						}, 1000);
						$(".prompt .txt").html("单位银行账户有误");
					}else{		
						$(".is_load").css("display","none");
						$scope.invoice.invoicecompany = $(".appre_ul .receipt_name").val();
						$scope.invoice.invoicetax = $(".appre_ul .receipt_code").val();
						$scope.invoice.invoiceaddress = $(".appre_ul .receipt_address").val();
						$scope.invoice.invoicetel = $(".appre_ul .receipt_number").val();
						$scope.invoice.invoicebank = $(".appre_ul .receipt_bank").val();
						$scope.invoice.invoiceaccount = $(".appre_ul .receipt_account").val();
						over_go();
					}
					
				}				

			})
				
			
		}])
