
		app.controller("categorykaCtlr",["$scope","$timeout","$state","CategoryDataService","SearchDataService", function($scope,$timeout,$state,CategoryDataService,SearchDataService){
			
			sessionStorage.setItem("datatype","0");
			
			//商品列表数据初始化
			ShopHistory = {
				scrollTop:0,
				sortStatus:"",
				by:0,
				brandid:"",
				brandText:"",
				page:1,
				ch:true,
				res:""
			}
			
			if(ka){
				$(".tab_table1").css("display","none");
				$(".tab_table2").css("display","flex");
			}else{
				$(".tab_table2").css("display","none");
				$(".tab_table1").css("display","flex");
			};
			
			
			var mycategorydata = CategoryPostData("0");
			
			//console.log(mycategorydata);
	        CategoryDataService.listData(mycategorydata).then(function(res){
            	$scope.arrList = res.data.resources[0].itemclass;
            	$scope.arrCategory = res.data.resources[0].itemclass[0].children;
            	$scope.qtytotal = res.data.resources[0].qtytotal;
            	var that_id = res.data.resources[0].itemclass[0].categoryid;
            	var categoryChangeData = mycategorydata;
				categoryChangeData.categoryid = that_id;
	            CategoryDataService.listData(categoryChangeData).then(function(res){	
	            	console.log(res.data);	
	            	$scope.arrCategory=res.data.resources[0].itemclass;
	            	$scope.reset_scroll();
			 	})	
		 	})
        	
        	
			/*-----菜单列表点击变色-------*/
			$("#cate_left").on("click",".left_list_li",function(){
				$(".left_list_li").css({"background":"#fff","color":"#262729"});
				$(this).css({"background":"#f1f2f6","color":"#dd3b48"});
				var that_id = $(this).attr("data-id");
				var categoryChangeData = mycategorydata;
				categoryChangeData.categoryid = that_id;
		        CategoryDataService.listData(categoryChangeData).then(function(res){    	          	
		            	$scope.arrCategory=res.data.resources[0].itemclass;
		            	$scope.reset_scroll();
				});
			})
			
			
			/*返回上一步*/
			$scope.myBack = function(){
				window.history.go(-1);
			}
			
			
			var cateScroll,cateScroll2;
			function cateLoaded(){
				cateScroll = new IScroll("#cate_left",{
					preventDefault:false
					
				});
				cateScroll2 = new IScroll("#cate_right",{
					preventDefault:false,
					probeType:3
				});
				cateScroll2.on("scroll",function(){
					$("#cate_right").trigger('scroll');
				});
			}
			
			var cateTimer = $timeout(function(){
				cateLoaded();
				$(".category_box")[0].addEventListener('touchmove',
				prevent
				, isPassive() ? {
					capture: false,
					passive: false
				} : false);
			},200);
			
			$scope.reset_scroll = function(){
				$timeout(function(){
					cateScroll2.refresh();
					cateScroll2.scrollTo(0,0);
				},500)
			}
			
			
			/*--点击传参--*/
			$(".list_detail").on("click","li",function(){
				
				var myId = $(this).attr("categoryid");
				var myNo = $(this).attr("categoryno");
				
				SearchKey = "";
				sessionStorage.setItem("groupid","");
				sessionStorage.setItem("categoryid",myId);
				sessionStorage.setItem("categoryno",myNo);
				IsSearch =false;
				$state.go("shop_list");	
			});
			$(".list_detail").on("click",".cell_title",function(){
				
				var myId = $(this).attr("categoryid");
				var myNo = $(this).attr("categoryno");
				
				SearchKey = "";
				sessionStorage.setItem("groupid","");
				sessionStorage.setItem("categoryid",myId);
				sessionStorage.setItem("categoryno",myNo);
				IsSearch =false;
				$state.go("shop_list");
			})
			
			$(".search_div").on("click",function(){
				SearchFlag=true;
			})
			
			
		}])
			
