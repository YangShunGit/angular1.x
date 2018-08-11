
		app.controller("email_detailCtlr", ["$scope","$state","$timeout","EditorderService","OrderauditService", function($scope,$state,$timeout,EditorderService,OrderauditService) {
			
			let orderno =  GetQueryString("orderno");
			//console.log(orderno);
			let packageid = "";
			let myOrderData = OrderData(packageid,orderno);
			let lookScroll;
			let apid = GetQueryString("apid");
			let canaudit="0";
			
			$("textarea").attr("onkeyup","this.value=this.value.replace(/^ +| +$/g,'')");
			function lookLoaded() {
				lookScroll = new IScroll(".look_wrapper", {
					preventDefault: false
				});
			}

			function time() {
				lookLoaded();
				$(".email_detail")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			}
			
			setTimeout(time, 500);
			$.ajax({
				url: "/api/b2b/order",
				type: "POST",
				data:myOrderData,
				dataType: "json",
				success: function(data) {
					//console.log(myOrderData);
					console.log(data);
					let datas = data.resources[0];
					canaudit = datas.canaudit;
					if(canaudit=="1"){
						$(".refuse").css("background", "#ffb12e");
						$(".pass").css("background","#f52f2c");
					}
					$(".billno").html(datas.billno);
					$(".status").html(datas.statename);
					$(".cost_center").html(datas.receive.organizename);
					$(".name").html(datas.receive.receivername);
					$(".number").html(datas.receive.receivermobile);
					$(".d").html(datas.receive.fulladdress);
					$(".pay_mode").html(datas.paymodename);
					$(".carry_mode").html(datas.distributename);
					$(".carry_info .day").html(datas.shipdate);
					$(".unit_order_box span").html(datas.pono);
					$(".point span").html(datas.msg);
					$(".fare span").html(datas.postfee);
					$(".serve span").html(datas.servicefee);
					$(".refuse_submit").attr("apid",apid);
					$(".order_time_box .day span").html(datas.shipdate);
					//判断发票信息
					if(datas.invoice.invoiceflag=="1"){
						$(".fold_li").css("display","none");
						$(".fold_box2").css("display","block");
						$(".add_receipt").html("普通发票");
						$(".fold_box2 .unit_name_b").html(datas.invoive.invoicecompany);
						
					}else if(datas.invoice.invoiceflag=="2"){
						$(".fold_li").css("display","none");
						$(".fold_box1").css("display","block");
						$(".add_receipt").html("增值税发票");
						$(".fold_box1 .unit_name_b").html(datas.invoice.invoicecompany);
						$(".fold_box1 .code_b").html(datas.invoice.invoicetax);
						$(".fold_box1 .address_b").html(datas.invoice.invoiceaddress);
						$(".fold_box1 .number_b").html(datas.invoice.invoicetel);
						$(".fold_box1 .bank_b").html(datas.invoice.invoicebank);
						$(".fold_box1 .acount_b").html(datas.invoice.invoiceaccount);
					}else{
						$(".fold_li").css("display","none");
						$(".fold_box3").css("display","block");
						$(".add_receipt").html("无需发票");
					}
					
					let goods, delGoods = [],
						undelGoods = [];

					//console.log("打印数据", data);
					//原始商品数据goods
					//goods = data.details;
					
					
					//将多个包裹里面的商品合并成一个数组
					function dataConcat(arr){
						let newArr = [];
						for(let k=0;k<arr.length;k++){
							newArr =  newArr.concat(arr[k].items);
						}
						return newArr;
					}
					goods = dataConcat(datas.packages);
					
					
					//给数组添加属性
					function addAttr(arr){
						for(i = 0; i < arr.length; i++) {
							arr[i].isdeleted = "0";
							arr[i].inx = i;
						}
						return arr;
					}
					goods = addAttr(goods);
					
					
					
					//删除和未删除商品分离函数
					function dataSplit(arr) {
						let obj = {
							delGoods: [],
							undelGoods: []
						}
						for(let i = 0; i < arr.length; i++) {
							if(arr[i].isdeleted == "0") {
								obj.undelGoods.push(arr[i]);
							} else {
								obj.delGoods.push(arr[i]);
							}
						}
						//console.log(obj);
						return obj;
					}
					
					//计算商品金额
					function shopTotalFee(arr){
						let total = 0;
						for(let i=0;i<arr.length;i++){
							if(arr[i].isdeleted=="0"){
								total = parseFloat(total) + parseFloat(arr[i].price)*parseFloat(arr[i].orderqty);
								
							}
						}
						total = changeTwoDecimal_f(total);
						return total;
					}
					//商品金额函数
					function totalFeeFn(arr){
						let totalfee = shopTotalFee(arr);
						$(".shop_number span").html(totalfee);
					}
					totalFeeFn(goods);
					
					//计算实付款
					function realFee(arr){
						let totalfee = shopTotalFee(arr);
						let realfee = parseFloat(totalfee)+parseFloat(datas.postfee)+parseFloat(datas.servicefee);
						realfee = changeTwoDecimal_f(realfee);
						return realfee;
					}
					//实付款函数
					function realFeeFn(arr){
						let realfee = realFee(arr);
						$(".money_number span").html(realfee);
					}
					realFeeFn(goods);
					
					//遍历未删除的商品函数
					function undelData(arr) {
						for(let j = 0; j < arr.length; j++) {
							let myLi = $(".list_undel #list_li").clone(true);
							$(myLi).removeAttr("id");
							$(myLi).attr("class", "list_li");
							$(myLi).find(".para .shop_title").html(arr[j].itemname);
							$(myLi).find(".para .shop_size").html(arr[j].sizename);
							$(myLi).find(".para .shop_color").html(arr[j].colorname);
							$(myLi).find(".para .shop_price span").html(arr[j].price);
							$(myLi).find(".para .count_input .count").val(arr[j].orderqty);
							$(myLi).find(".del").attr("inx", arr[j].inx);
							$(myLi).find(".add").attr("inx", arr[j].inx);
							$(myLi).find("input").attr("inx", arr[j].inx);
							$(myLi).find(".del").attr("orderqty", arr[j].orderqty);
							$(myLi).find(".add").attr("orderqty", arr[j].orderqty);
							$(myLi).find("input").attr("orderqty", arr[j].orderqty);
							$(myLi).find(".del_it").attr("inx", arr[j].inx);
							if(parseInt(arr[j].orderqty) == 1) {
								$(myLi).find(".del").find("i").css("background-position", "0 -140px");
							} else if(parseInt(arr[j].orderqty) == 9999) {
								$(myLi).find(".add").find("i").css("background-position", "-20px -140px");
							}
							$(myLi).appendTo(".list_undel");
						}
					}
					//遍历已删除的商品函数
					function delData(arr) {
						for(let j = 0; j < arr.length; j++) {
							let myLi = $(".list_del #list_li").clone(true);
							$(myLi).removeAttr("id");
							$(myLi).attr("class", "list_li");
							$(myLi).find(".para .shop_title").html(arr[j].itemname);
							$(myLi).find(".para .shop_size").html(arr[j].sizename);
							$(myLi).find(".para .shop_color").html(arr[j].colorname);
							$(myLi).find(".para .shop_price span").html(arr[j].price);
							$(myLi).find(".para .count_input .count").val(arr[j].orderqty);
							$(myLi).find(".del").attr("inx", arr[j].inx);
							$(myLi).find(".add").attr("inx", arr[j].inx);
							$(myLi).find("input").attr("inx", arr[j].inx);
							$(myLi).find(".del").attr("orderqty", arr[j].orderqty);
							$(myLi).find(".add").attr("orderqty", arr[j].orderqty);
							$(myLi).find("input").attr("orderqty", arr[j].orderqty);
							$(myLi).find(".rec_it").attr("inx", arr[j].inx);
							if(parseInt(arr[j].orderqty) == 1) {
								$(myLi).find(".del").find("i").css("background-position", "0 -140px");
							} else if(parseInt(arr[j].orderqty) == 9999) {
								$(myLi).find(".add").find("i").css("background-position", "-20px -140px");
							}
							$(myLi).appendTo(".list_del");
						}
					}
					//商品重新渲染函数
					function freshFn(inx, arr, n) {
						arr[inx].isdeleted = n;
						totalFeeFn(arr);
						realFeeFn(arr);
						let obj = dataSplit(arr);
						$(".list_ul .list_li").remove();
						undelData(obj.undelGoods);
						delData(obj.delGoods);
						if(obj.delGoods.length > 0) {
							$(".del_shop").css("display", "block");
						} else {
							$(".del_shop").css("display", "none");
						}
						lookScroll.refresh();
					}

					//商品初始化
					undelData(goods);
					//del
					$(".list_ul").on("click", ".del", function() {
						let inx = $(this).attr("inx");
						let oldVal = parseInt(goods[inx].orderqty);
						//console.log(oldVal);
						//数量等于2的时候点击减号变灰
						if(oldVal == 2) {
							$(this).find("i").css("background-position", "0 -140px");
						}
						//只有数量大于1的时候可以减
						if(oldVal > 1) {
							//console.log("111");
							let newVal = oldVal - 1;
							$(this).siblings(".count_input").find("input").val(newVal);
							goods[inx].orderqty = newVal;
							totalFeeFn(goods);
							realFeeFn(goods);
							$(this).siblings(".add").find("i").css("background-position", "-20px -123px");
						}

					});
					//add
					$(".list_ul").on("click", ".add", function() {
						let inx = $(this).attr("inx");
						//console.log(goods[inx]);
						let oldVal = parseInt(goods[inx].orderqty);
						if(oldVal == 9998) {
							$(this).find("i").css("background-position", "-20px -140px");
						}
						if(oldVal < 9999) {
							let newVal = oldVal + 1;
							$(this).siblings(".count_input").find("input").val(newVal);
							goods[inx].orderqty = newVal;
							totalFeeFn(goods);
							realFeeFn(goods);
							$(this).siblings(".del").find("i").css("background-position", "0 -123px");
						}
					});
					//删除
					$(".list_ul").on("click", ".del_it", function() {
						let inx = $(this).attr("inx");
						freshFn(inx, goods, "1");
					});
					//恢复
					$(".list_ul").on("click", ".rec_it", function() {
						let inx = $(this).attr("inx");
						freshFn(inx, goods, "0");
					})
					//input输入控制
					let oldInput;
					$(".list_ul").on("focus", "input", function() {
						let inx = $(this).attr("inx");
						oldInput = parseInt(goods[inx].orderqty);
					});
					$(".list_ul").on("keyup", "input", function() {
						let inx = $(this).attr("inx");
						let newInput = $(this).val();
						if(newInput != "") {
							let reg = /^[1-9]\d*$/.test(newInput);
							//console.log(newInput, reg);
							if(reg) {
								newInput = parseInt(newInput);
								if(newInput > 9999) {
									$(this).val(oldInput);
									if(oldInput == 1) {
										$(this).parent(".count_input").siblings(".add").children("i").css("background-position", "-20px -123px");
										$(this).parent(".count_input").siblings(".del").children("i").css("background-position", "0 -140px");
									}
									$(".prompt_fail .txt").html("单件商品最多不能超过9999件哦！");
									$(".prompt_fail").fadeIn(200);
									setTimeout(function() {
										$(".prompt_fail").fadeOut(200);
									}, 1000);
								} else if(newInput == 1) {
									goods[inx].orderqty = 1;
									$(this).parent(".count_input").siblings(".add").children("i").css("background-position", "-20px -123px");
									$(this).parent(".count_input").siblings(".del").children("i").css("background-position", "0 -140px");
								} else if(newInput == 9999) {
									goods[inx].orderqty = 9999;
									$(this).parent(".count_input").siblings(".add").children("i").css("background-position", "-20px -140px");
									$(this).parent(".count_input").siblings(".del").children("i").css("background-position", "0 -123px");
								} else {
									goods[inx].orderqty = newInput;
									$(this).parent(".count_input").siblings(".add").children("i").css("background-position", "-20px -123px");
									$(this).parent(".count_input").siblings(".del").children("i").css("background-position", "0 -123px");
								}
							} else {
								$(this).val(oldInput);
							}
						}
					});
					$(".list_ul").on("blur", "input", function() {
						let inx = $(this).attr("inx");
						let newInput = goods[inx];
						totalFeeFn(goods);
						realFeeFn(goods);
						if(newInput == "") {
							$(this).val(oldInput);
							$(".prompt_fail .txt").html("单件商品不能少于1件");
							$(".prompt_fail").fadeIn(200);
							setTimeout(function() {
								$(".prompt_fail").fadeOut(200);
							}, 1000);
						}
					})
					
					//遍历数据里面获取参数
					function getData(arr){
						let newArr =[];
						for(let i=0;i<arr.length;i++){
							let obj = {};
							obj.orderid = arr[i].orderid;
							obj.orderqty = arr[i].orderqty;
							obj.isdeleted = arr[i].isdeleted;
							newArr.push(obj);
						}
						return newArr;
					}
					
					//通过提交
					$(".pass").on("click",function(){
						if(canaudit=="1"){
						$(".is_load").css("display","block");
						let orderno = datas.orderno;
						let details =getData(goods);
						let myEditOrderData = EditOrderData(orderno,details);
						EditorderService.listData(myEditOrderData).then(function(res){
							//console.log(res);
							$(".is_load").css("display","none");
							if(res.data.error==0){
								SuccessInfo = res.data.resources;
								SuccessInfoOrderno = SuccessInfo[0].orderno;
								ReviseDetails="";
								$state.go("order_success");
							}else{
								//console.log("报错",res.config.data);
								alert(res.data.msg);
							}
						})
						}
					})
					
					//拒绝审批
					$(".refuse").on("click",function(){
						if(canaudit=="1"){
						$(".refuse_mask").css("display","block");
						$(".refuse_window").css("display","block");
						}
					});
					$(".cc").on("click",function(){
						$(".refuse_window").css("display","none");
						$(".refuse_mask").css("display","none");
					});
					$(".refuse_submit").on("click",function(){
						let resion = $(".refuse_box2 textarea").val();
						let act = "0";
						if(resion.length>0){
							$(".is_load").css("display","block");
							var myOrderauditData = OrderauditData(act,resion,apid);
							OrderauditService.listData(myOrderauditData).then(function(res){
								//console.log(res);
								if(res.data.error == 0){
									$(".is_load").css("display","none");
									$(".prompt_success .txt").html("订单审核成功");
									$(".prompt_success").fadeIn(200);
									setTimeout(function(){
										$(".prompt_success").fadeOut(200);
										$state.go("home");
									},1000);
								}else{
									$(".is_load").css("display","none");
									//console.log(res.config.data);
									alert(res.data.msg);
								}
							})
						}else{
							$(".prompt_fail .txt").html("请填写拒绝理由");
							$(".prompt_fail").fadeIn(200);
							setTimeout(function(){
								$(".prompt_fail").fadeOut(200);
								//$state.go("home");
							},1000);
						}
					})
					
					setTimeout(function(){
						lookScroll.refresh();
					},500);
				}
			})
		}])
