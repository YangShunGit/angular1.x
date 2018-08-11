
		app.controller("application_process2Ctlr",["$scope","$timeout","AreaService","ReturnsubmitService",function($scope,$timeout,AreaService,ReturnsubmitService){
			
			
			
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			$scope.receiver = AppreturnsResources.receive;
			$scope.number = $scope.receiver.receivermobile?$scope.receiver.receivermobile:$scope.receiver.receivertel;
			var process2Scroll,placeScroll;
			function process2Loaded(){
				process2Scroll = new IScroll(".process2_wrapper",{
					preventDefault:false
				});
				placeScroll = new IScroll(".place_wrapper", {
					preventDefault: false
				});
			}
			
			var process2Timer = $timeout(function(){
				process2Loaded();
				$(".process2_wrapper")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);
			
			/*--youshangjiao--*/
			$scope.d = false;
			$scope.change_nav = function(){
				$scope.d =!$scope.d;
			};
			$scope.searchFlag = function(){
				SearchFlag = true;
			}
			
			/*---类型选择----*/
			$scope.type_sel=function($event){
				Returnsubmit.operatetype = $($event.target).text();
				$(".service_type_li").css({
					"border":"1px solid #cacaca",
					"color":"#2a2a2c"
				});
				$($event.target).css({
					"border":"1px solid #f82e2a",
					"color":"#f82e2a"
				});
				if($($event.target).attr("id")=="go_pickup"){
					$(".date_sel").css("display","block");
				}else{
					$(".date_sel").css("display","none");
					$scope.is_date = "";
				}
			};
			
			
			/*--后七天的时间获取--*/
			function GetDateStr(AddDayCount) { 
				var dd = new Date(); 
				var week_arr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
				dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
				var y = dd.getFullYear(); 
				var m = dd.getMonth()+1;//获取当前月份的日期 
				var d = dd.getDate();
				var w = dd.getDay();
				console.log(d<9);
				if(d<10){
					d = "0"+d;
				}
				if(m<10){
					m = "0"+m;
				}
				return y+"-"+m+"-"+d+"["+week_arr[w]+"]"; 
			} 
			$scope.myDate = [];
			
			for(i=1;i<8;i++){
				$scope.myDate.push(GetDateStr(i));
			}
			
			$scope.is_date = $scope.myDate[0];
			
			$(".date_sel").on("click",function(){
				$(".maskBlack").css("display","block");
				$(".carry_flex").css({
					'transform':'translate3d(0,-330px,0)'
                
				});
			})
			
			$(".myWeek").on("click","li",function(){
				$(".is_sel").css("display","none");
				var index = $(this).attr("data-index");
				$(".myWeek li").css("color","black");
				$(this).css("color","#f82e2a");
				$(this).find(".is_sel").css("display","block");
				$(".carry_flex").css({
					'transform':'translate3d(0,330px,0)'
					
				});
				$timeout(function(){
					$(".maskBlack").css("display","none");
				},300);
				$scope.is_date = $scope.myDate[index];
				Returnsubmit.taketime = $scope.is_date;
				$scope.$digest();
			});
			
			$(".chacha").on("click",function(){
				$(".carry_flex").css({
					'transform':'translate3d(0,330px,0)'
					
				});
				$timeout(function(){
					$(".maskBlack").css("display","none");
				},300);
				
			});
			
			$(".next").on("click",function(){
				$(".is_load").css("display","block");
				var name = $(".people_name").val();
				var phone = $(".phone_number").val();
				if(name==""){
					$(".is_load").css("display","none");
					$(".prompt_fail .txt").html("联系人不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
						
					}, 1000);
				}else if(phone==""){
					$(".is_load").css("display","none");
					$(".prompt_fail .txt").html("联系电话不能为空");
					$(".prompt_fail").fadeIn(200);
					setTimeout(function() {
						$(".prompt_fail").fadeOut(200);
					}, 1000);
				}else {
					Returnsubmit.taketime = $scope.is_date.substr(0,10);
					Returnsubmit.contactname = name;
					Returnsubmit.phone = phone;
					var myReturnsubmit = ReturnsubmitData(Returnsubmit.taketime,Returnsubmit.contactname, Returnsubmit.phone, Returnsubmit.operatetype, Returnsubmit.memo, Returnsubmit.logisticstype, Returnsubmit.reason, Returnsubmit.orderno, Returnsubmit.details, Returnsubmit.images);
					ReturnsubmitService.listData(myReturnsubmit).then(function(res){
						console.log(res);
						if(res.data.error==0){
							$(".is_load").css("display","none");
							
							$(".prompt_success .txt").html(res.data.msg);
							$(".prompt_success").fadeIn(200);
							setTimeout(function() {
								$(".prompt_success").fadeOut(200);
								window.history.go(-2);
							}, 1000);
						}else{
							
							alert(res.data.msg);
						}
					})
				}
			})
			
			
		}])
