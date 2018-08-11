
		app.controller("fill_orderCtlr",["$scope","$timeout","$state","SettlementService","OrderSubmitService","ImbuyService",function($scope,$timeout,$state,SettlementService,OrderSubmitService,ImbuyService){
		
		$("input").attr("onKeypress","javascript:if(event.keyCode == 32)event.returnValue = false;");
		$("input").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
		
		/*返回上一步*/
		$scope.myBack = function(){
			window.sessionStorage.removeItem("mysubmitdata");
			window.sessionStorage.removeItem("date_index");
			window.sessionStorage.removeItem("time_index");
			window.sessionStorage.removeItem("delivery");
			window.sessionStorage.removeItem("fillOrderRes");
			window.sessionStorage.removeItem("address");
			window.sessionStorage.removeItem("mySplitData");
			window.sessionStorage.removeItem("togetherid");
			window.sessionStorage.removeItem("paymode");
			window.sessionStorage.removeItem("distribution");
			window.sessionStorage.removeItem("mode_index");
			window.sessionStorage.removeItem("invoice");
			window.sessionStorage.removeItem("orderDetailData");
			window.history.go(-1);
		}
		
		var orderScroll;
		function orderLoaded(){
			orderScroll = new IScroll("#order_wrapper",{
				preventDefault:false,
				
			});
		}
		var orderTimer = $timeout(function(){
			orderLoaded();
			$(".fill_order")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
		},200);
		
		var noAddressFlag = sessionStorage.getItem("noAddressFlag");
		
		function reduce(res){
			/*--结算总价--*/
			$scope.totalfee = res.data.resources[0].totalfee;
			/*--商品总价--*/
			$scope.itemtotalfee = res.data.resources[0].cart.totalfee;
			/*--商品总数--*/
			$scope.qtytotal = res.data.resources[0].cart.qtytotal;
			/*--服务费--*/
			$scope.servicefee = res.data.resources[0].servicefee;
			/*--邮费--*/
			$scope.postfee = res.data.resources[0].postfee;
			/*--商品列表--*/
			$scope.cart = res.data.resources[0].cart;
			$scope.cart.items[0].itprice = {
				"big_price": "",
				"small_price": ""
			};
			
			$scope.cart.items[0].itprice.big_price = parseInt($scope.cart.items[0].price);
			$scope.cart.items[0].itprice.small_price = $scope.cart.items[0].price.toString().split(".")[1];
			/*--发票信息--*/
			$scope.invoice = res.data.resources[0].invoice;
			/*--发票种类--*/
			$scope.invoicename = res.data.resources[0].invoicename;
			/*--地址--*/
			$scope.receiveaddress = res.data.resources[0].receiveaddress;
			
			/*--送货类型--*/
			$scope.shiptype = "";
			/*--送货日期--*/
			$scope.shipdate = "";
			/*--送货时间--*/
			$scope.shiptime = "";
			
			/*--允许拆分--*/
			$scope.togethername = res.data.resources[0].togethername;
			
			$scope.istogether = res.data.resources[0].istogether;
			
			$scope.distributeid = res.data.resources[0].distributeid;
			
			
			$scope.myAddress = JSON.parse(sessionStorage.getItem("address"));
			if($scope.myAddress!=null){
				$scope.receiveaddress.addressid = $scope.myAddress.addressid;
				$scope.receiveaddress.organizeid = $scope.myAddress.organizeid;
				$scope.receiveaddress.fulladdress = $scope.myAddress.fulladdress;
				$scope.receiveaddress.organizename = $scope.myAddress.organizename;
				$scope.receiveaddress.receivername = $scope.myAddress.receivername;
				$scope.receiveaddress.postfee = $scope.myAddress.postfee;
				$scope.receiveaddress.receivertel = $scope.myAddress.receivertel;
				$scope.receiveaddress.receivermobile = $scope.myAddress.receivermobile;
				$scope.receiveaddress.isdefault = $scope.myAddress.isdefault;
				
				
				$scope.postfee = changeTwoDecimal_f($scope.myAddress.postfee);
				console.log("$scope.postfee",$scope.postfee,$scope.myAddress.postfee);
				if($scope.receiveaddress.receivermobile==null||$scope.receiveaddress.receivermobile==""){
					$scope.phone_flag =false;
				}else{
					$scope.phone_flag = true;
				}
			}else if($scope.receiveaddress.addressid==null||noAddressFlag=='true'){
				
				$(".cargo_receiver").css("display","none");
				$(".noAddress").css("display","block");
				$scope.postfee = changeTwoDecimal_f(0);
				console.log("---------------");
				$(".point").css("display","none");
				$(".order_box").css("padding-bottom","50px");
				$(".order_foot").css("height","50px");
			}
			
			/*--判断是否默认地址--*/
			if($scope.receiveaddress.isdefault==1){
				$(".info_default").css("display","block");
			}else if($scope.receiveaddress.isdefault==0){
				$(".info_default").css("display","none");
			}
			
			/*--选择合并拆分包裹--*/
			var istogether = sessionStorage.getItem("togetherid");
			if(istogether!=null){
				$scope.istogether = istogether;
				if($scope.istogether=="0"){
					$scope.togethername = "允许拆单";
				}else{
					$scope.togethername = "合并订单";
				}
			}
			
			/*--判断结算商品数量--*/
			if($scope.cart.items.length>1){
				$(".order_shop").css("display","none");
				$(".order_shop1").css("display","block");
			}else{
				$(".order_shop").css("display","block");
				$(".order_shop1").css("display","none");
			}
			
			/*--选择支付方式，配送方式--*/
			$scope.mydata = JSON.parse(sessionStorage.getItem("delivery"));
			console.log($scope.mydata);
			if($scope.mydata != null){
				$scope.shiptype = $scope.mydata.distributcname;
				$scope.shipdate = $scope.mydata.shipdate;
				$scope.shiptime = $scope.mydata.shiptime;
				$scope.distributeid = $scope.mydata.distributeid;
				$scope.servicefee  = changeTwoDecimal_f($scope.mydata.fee);
				$scope.totalfee = parseFloat($scope.itemtotalfee) + parseFloat($scope.postfee) + parseFloat($scope.servicefee);
				$scope.totalfee = changeTwoDecimal_f($scope.totalfee);
			}
			$scope.paymode = sessionStorage.getItem("paymode");
			if($scope.paymode==null){
				$scope.paymode = "";
			}else if($scope.paymode=="3"){
				$scope.paymode = "3";
				$(".pay_mode .mode_sel span").html("现结刷卡");
			}else if($scope.paymode == "2"){
				$(".pay_mode .mode_sel span").html("现金结账");
			}else{
				$scope.paymode = "1";
				$(".pay_mode .mode_sel span").html("合约结算");
			}
			
			/*--选择发票信息--*/
			var myInvoice = JSON.parse(sessionStorage.getItem("invoice"));
			if(myInvoice!=null){
				$scope.invoice.invoiceflag = myInvoice.invoiceflag;
				$scope.invoice.invoiceid = myInvoice.invoiceid;
				$scope.invoice.invoicecompany = myInvoice.invoicecompany;
				$scope.invoice.invoicetax = myInvoice.invoicetax;
				$scope.invoice.invoiceaddress = myInvoice.invoiceaddress;
				$scope.invoice.invoicetel = myInvoice.invoicetel;
				$scope.invoice.invoiceaccount = myInvoice.invoiceaccount;
				$scope.invoice.invoicebank = myInvoice.invoicebank;
				$scope.invoice.isdefault = myInvoice.isdefault;
				if($scope.invoice.invoiceflag=="0"){
					$scope.invoicename = "无需发票";
				}else if($scope.invoice.invoiceflag=="1"){
					$scope.invoicename = "普通发票";
				}else if($scope.invoice.invoiceflag=="2"){
					$scope.invoicename = "增值税发票";
				}
			}
			
			//获取备注信息
			var myPoint = JSON.parse(sessionStorage.getItem("myPointData"));
			if(myPoint!=null){
				$(".order_note").val(myPoint.msg);    
				$(".order_identifier").val(myPoint.pono); 
			}
			
			
			$scope.mySubmitData = {
			     "organizeid": $scope.receiveaddress.organizeid,
			      "addressid":$scope.receiveaddress.addressid,
				  "msg": $(".order_identifier").val(),
				  "pono": $(".order_note").val(),
				  "postfee": $scope.postfee,
				  "servicefee": $scope.servicefee,
				  "receivemodeid": "",
				  "receivemode": "",
				  "invoiceflag": $scope.invoice.invoiceflag,
				  "invoiceid": $scope.invoice.invoiceid,
				  "paymode": $scope.paymode,
				  "distributeid":  $scope.distributeid,
				  "shipdate": $scope.shipdate,
				  "shiptime": $scope.shiptime,
				  "istogether": $scope.istogether,
				  "receiverstate": "",
				  "receivercity": "",
				  "receiverdistrict": "",
				  "receiveraddress": "",
				  "receivername": "",
				  "receivertel": "",
				  "receivermobile": "",
			}
		}
		
		
		
		
		var res = JSON.parse(sessionStorage.getItem("fillOrderRes"));
		
		console.log(res);
		if(res==null){
			window.history.go(-1);
		}else{
			if(!(res.data.resources[0].receiveaddress.addressid==null||res.data.resources[0].receiveaddress.addressid=="")){
				NoAddress = false;
			}
			if(NoAddress==true){
				
				$(".maskBlack").css("display","block");
				$(".noAddressPrompt").css("display","block");
			}
			/*if(res.data.resources[0].receiveaddress.addressid==null||res.data.resources[0].receiveaddress.addressid==""){
				
			}else{
				$(".point").css("display","block");
				$(".order_box").css("padding-bottom","80px");
				$(".order_foot").css("height","80px");
			}*/
			reduce(res);
		}
		
		
		
		
		
		$scope.distribution = function(){
			$scope.keep();
			var myDistribution = {
				distributeid:$scope.distributeid,
				deliverydate:$scope.shipdate
			}
			sessionStorage.setItem("distribution",JSON.stringify(myDistribution));
		}
		
		$scope.splitData = function(){
			if($scope.shipdate==""){
				$(".prompt_fail .txt").html("请先选择配送信息");
				$(".prompt_fail").fadeIn(200);
				$timeout(function(){
					$(".prompt_fail").fadeOut(200);
				},1000);
			}else{
				$scope.keep();
				var mySplitData={};
				mySplitData.togetherid = "";
				mySplitData.shipdate = $scope.shipdate;
				sessionStorage.setItem("mySplitData",JSON.stringify(mySplitData));
				$state.go("split");
			}
			
		}
		
		//保存备注和贵司订单
		$scope.keep= function(){
			var myPointData={
				msg:$(".order_note").val(),
				pono:$(".order_identifier").val()
			};
			sessionStorage.setItem("myPointData",JSON.stringify(myPointData));
		}
		
		//只允许提交一次
		var onceSubmit = true;
		$scope.submit = function(){ 
			console.log($scope.receiveaddress.addressid);
			if(onceSubmit==true){
				if(!($scope.receiveaddress.addressid==""||$scope.mySubmitData.addressid==null)){
					if($scope.mySubmitData.paymode==""){
						$(".prompt_fail .txt").html("请选择支付方式");
						$(".prompt_fail").fadeIn(200);
						$timeout(function(){
							$(".prompt_fail").fadeOut(200);
						},1000);
					}else if($scope.mySubmitData.shiptime==""){
						$(".prompt_fail .txt").html("请选择配送信息");
						$(".prompt_fail").fadeIn(200);
						$timeout(function(){
							$(".prompt_fail").fadeOut(200);
						},1000);
					}else{
						onceSubmit = false;
						$(".is_load").css("display","block");
						$(".place_order").css("background","#f1f2f6");
						$scope.mySubmitData.msg = $(".order_note").val();    //备注信息
						$scope.mySubmitData.pono = $(".order_identifier").val();   //贵司订单
						var mySubmit =	$scope.mySubmitData;
						var mySubmitData = OrderSubmitData(mySubmit.organizeid,mySubmit.addressid,mySubmit.msg,mySubmit.pono,mySubmit.postfee,mySubmit.servicefee,mySubmit.receivemodeid,mySubmit.receivemode,mySubmit.invoiceflag,mySubmit.invoiceid,mySubmit.paymode,mySubmit.distributeid,mySubmit.shipdate,mySubmit.shiptime,mySubmit.istogether);
						OrderSubmitService.listData(mySubmitData).then(function(res){
							console.log(res);
							if(res.data.error==0){
								$(".is_load").css("display","none");
								SuccessInfo = res.data.resources;
								SuccessInfoOrderno = SuccessInfo[0].orderno;
								window.sessionStorage.removeItem("mysubmitdata");
								window.sessionStorage.removeItem("date_index");
								window.sessionStorage.removeItem("time_index");
								window.sessionStorage.removeItem("delivery");
								window.sessionStorage.removeItem("fillOrderRes");
								window.sessionStorage.removeItem("address");
								window.sessionStorage.removeItem("mySplitData");
								window.sessionStorage.removeItem("togetherid");
								window.sessionStorage.removeItem("paymode");
								window.sessionStorage.removeItem("distribution");
								window.sessionStorage.removeItem("mode_index");
								window.sessionStorage.removeItem("invoice");
								window.sessionStorage.removeItem("orderDetailData");
								$state.go("order_success");
							}else{
								alert(res.data.msg);
							}
						})
					}
				}else{
					$(".maskBlack").css("display","block");
					$(".noAddressPrompt").css("display","block");
				}
			}
		};
		
			
			//fillNewAddress填写订单新建地址参数，当从填写订单进入新建地址时，点击保存只返回历史记录一步
			$scope.newAddress = function(){
				sessionStorage.setItem("fillNewAddress","true");
				//window.sessionStorage.removeItem("noAddressFlag");
				$state.go("new_receiver");
			}
			
			//点击我知道了
			$scope.know = function(){
				$(".noAddressPrompt").css("display","none");
				$(".maskBlack").css("display","none");
				NoAddress = false;
			}
			
			
			$timeout(function(){
				orderScroll.refresh();
			},3000);
			$timeout(function(){
				orderScroll.refresh();
			},10000);
			
			
		
		
		}])
