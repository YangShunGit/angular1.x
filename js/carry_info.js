
		app.controller("carry_infoCtlr",["$scope","$state","$timeout","DeliveryService",function($scope,$state,$timeout,DeliveryService){
			
			
			$scope.go_back = function(){
				window.history.go(-1);
			}
			
			
			
			var date_index,time_index,mode_index,mydata;
			var myDistribution = JSON.parse(sessionStorage.getItem("distribution"));
			var myDeliveryData = DeliveryData(myDistribution.distributeid,myDistribution.shipdate);
			DeliveryService.listData(myDeliveryData).then(function(res){
				console.log(res);
				$scope.distributes = res.data.resources[0].distributes;
				$scope.distributecnote = res.data.resources[0].distributecnote;
				$scope.deliverytimes = res.data.resources[0].deliverytimes;
				$scope.distributcname = res.data.resources[0].distributcname;
				$scope.distributeid = res.data.resources[0].distributeid;
				$scope.shipdate = $scope.deliverytimes[0].shipdate;
				$scope.shiptime = $scope.deliverytimes[0].deliverytimes[0].shiptime;
				$scope.weekname = $scope.deliverytimes[0].weekname;
				$scope.fee = res.data.resources[0].fee;
				$scope.deliverytimess = res.data.resources[0].deliverytimes[0].deliverytimes;
				$scope.session_shipdate = $scope.shipdate;
				$scope.session_weekname = $scope.weekname;
				
				date_index = sessionStorage.getItem("date_index");
				time_index = sessionStorage.getItem("time_index");
				mydata = JSON.parse(sessionStorage.getItem("delivery"));
				if(date_index!=null){
					$scope.shipdate = $scope.deliverytimes[date_index].shipdate;
					$scope.weekname = $scope.deliverytimes[date_index].weekname;
					$timeout(function(){
						$(".myWeek li").css({"color":"#000"});
						var index = parseInt(date_index)+1;
						console.log($(".myWeek li:nth-child("+index+")"));
						$(".myWeek li:nth-child("+index+")").css({"color":"#f72e1a"});
					},100);
					
					$scope.deliverytimess = $scope.deliverytimes[date_index].deliverytimes;
				}
				if(time_index != null){
					$shiptime = $scope.deliverytimes[date_index].deliverytimes[time_index].shiptime;
					$timeout(function(){
						var index = parseInt(time_index)+1;
						console.log($(".myTime li:nth-child("+index+")"));
						$(".myTime li").children("span").css("color","#161616");
						$(".myTime li:nth-child("+index+")").children("span").css("color","#f72e1a");
						$(".myTime li").children(".checkmark").css("display","none");
						$(".myTime li:nth-child("+index+")").children(".checkmark").css("display","inline-block")
					},100);
				}
				if(mydata!=null){
					$scope.distributeid = mydata.distributeid;
					$.each($scope.distributes,function(index,obj){
						if(obj.distributeid == $scope.distributeid){
							obj.isselected == null;
						}else{
							obj.isselected == "1";
						}
					})
					$scope.distributcname = mydata.distributcname;
					$scope.distributecnote = mydata.distributecnote;
					$scope.shipdate = mydata.shipdate;
					$scope.shiptime = mydata.shiptime;
					/*var mode_li = $(".mode_sel li");
					mode_li.css({"border":"1px solid #9b9b9b","color":"#000"});*/
					/*for(var i=0;i<mode_li.length;i++){
						if(mode_li[i].attr("distributeid")==$scope.distributeid){
							mode_li[i].css({"border":"1px solid #f72e1a","color":"#f72e1a"});
						}
					}*/
				}
			
			})
			
			
			
			
			var carryInfoScroll;
			function carryInfoLoaded(){
				carryInfoScroll = new IScroll(".carry_wrap",{
					preventDefault:false
				});
				
			}
			
			var carryInfoTimer = $timeout(function(){
				carryInfoLoaded();
				$(".carry_wrap")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);
			
			/*--配送方式选择--*/
			$(".mode_sel").on("click","li",function(){
				mode_index = $(this).attr("data-index");
				$scope.distributeid = $(this).attr("distributeid");
				var myDeliveryData = DeliveryData($scope.distributeid,$scope.shipdate);
				DeliveryService.listData(myDeliveryData).then(function(res){
					console.log(res);
					$scope.distributes = res.data.resources[0].distributes;
					$scope.distributecnote = res.data.resources[0].distributecnote;
					$scope.deliverytimes = res.data.resources[0].deliverytimes;
					$scope.distributcname = res.data.resources[0].distributcname;
					$scope.distributeid = res.data.resources[0].distributeid;
					$scope.shipdate = res.data.resources[0].shipdate;
					$scope.shiptime = res.data.resources[0].shiptime;
					$scope.weekname = res.data.resources[0].weekname;
					$scope.session_shipdate = $scope.shipdate;
					$scope.session_weekname = $scope.weekname;
					$scope.fee = res.data.resources[0].fee;
					$scope.deliverytimess = res.data.resources[0].deliverytimes[0].deliverytimes;
				});
			});
			
			
			/*--弹窗收回--*/
			
			function fide(){
					$(".carry_flex").css({
						'bottom':'-436px',
						'transition':'all 300ms'
					})
					$timeout(function(){
						$(".maskBlack").css("display","none");
					},300);
				
				
			}
			$(".chacha").click(function(){
				fide();
			});
			$scope.mask = function(){
				fide();
			};
			/*----*/
			$(".time").click(function(){				
				$(".carry_mask").css("display","block");
				$(".carry_flex").css("bottom","-436px")
				$(".maskBlack").css("display","block");
				$(".carry_flex").css({
					'bottom':'0',
					'transition':'all 300ms'
				})
				
			});			
			
			/*--选择日期--*/
			$(".myWeek").on("click","li",function(event){
				$(this).siblings().children().css("color","#161616");
				$(this).children().css("color","#f72e1a");
				/*定义index*/
				date_index = $(this).attr("data-index");
				$scope.deliverytimess = $scope.deliverytimes[date_index].deliverytimes;
				/*选择日期时不默认选择具体时间*/
				console.log($scope.deliverytimess);
							
				$scope.session_shipdate = $(this).attr("shipdate");
				$scope.session_weekname = $(this).attr("weekname");
				$scope.shipdate_index = $(this).attr("data-index");
				$scope.$digest();
				$(".myTime li span").css("color","#161616");
				$(".myTime .checkmark").css("display","none");	
			});
			
			/*--选择时间段--*/
			$(".myTime").on("click","li",function(event){
				time_index = $(this).attr("data-index");console.log(time_index);
				$scope.shipdate = $scope.session_shipdate;
				$scope.weekname = $scope.session_weekname;
				$scope.shiptime = $(this).attr("shiptime");
				$scope.fee = $(this).attr("fee");
				console.log($(this));
				console.log($(this).parent().children());
				console.log($(this).parent().children().children(".checkmark"));
				console.log($(this).children());
				$(this).parent().children().children().css("color","#161616");
				$(this).parent().children().children(".checkmark").css("display","none");
				$(this).children().css("color","#f72e1a");
				$(this).children(".checkmark").css("display","inline-block");
				$(".time_sel .hours").html($scope.shiptime);
				//$scope.$digest();
				fide();
			});
			
			
			/*--确认--*/
			$(".carry_foot_box").click(function(){
				var obj = {
					distributcname:$scope.distributcname,
					distributeid:$scope.distributeid,
					distributecnote:$scope.distributecnote,
					shipdate:$scope.shipdate,
					shiptime:$scope.shiptime,
					fee:$scope.fee
				}
				console.log("dateindex",date_index);
				console.log("timeindex",time_index);
				console.log(obj);
				sessionStorage.setItem("mode_index",mode_index);
				sessionStorage.setItem("date_index",date_index);
				sessionStorage.setItem("time_index",time_index);
				sessionStorage.setItem("delivery",JSON.stringify(obj));
				window.history.go(-1);
			})
			
		}])
