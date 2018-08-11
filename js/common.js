//====================全局变量======================

//填写订单数据
var FillOrderData = "";
/*--提交成功(orderid和orderno)--*/
var SuccessInfo, SearchKey, SuccessInfoOrderno;

/*--用户信息--*/
var UserInfo;

/*--判断去结算还是立即购买--*/
var BuyFlag;
/*--立即购买传参变量--*/
var myImbuyData;

//无地址提示框参数：只有去结算和提交无地址时候提示
var NoAddress = true;

/*--地址管理编辑--*/
var AddressEdit;

/*--申请售后数据--*/
var AppreturnsResources;

//订单修改数据
var ReviseDetails = "";

//查看物流订单
var All_orders = [],
	Order_index, Package_index, State_index;

//点击后返回回到原来的位置参数请求page和scrollTop位置(我的订单myOrder)；
var MyOrderPage = 1,
	MyOrderScrollTop="";

//我的收藏cache;
var Groupid = "";
var Favoritgroup = [];
var AllPage = 1;
//订单状态数据
var Sdstates = "";

//返回到搜索页则继续返回参数
var SearchFlag = false;
//在商品列表页搜索返回上一级参数
var SearchFlagShopList = false;
//搜索接口判断参数
var IsSearch = false;

//判断是否是从订单详情查看物流还是从订单列表查看物流，true从订单列表进入，false从详情进入；
var OrderFollowFlag = true;
var TheOrder;

/*--退货提交参数数据--*/

var Returnsubmit;
//注册参数
var ApplyVip;
//退单详情数据
var ReturnDetail;
//申请售后数据
var AppReturnRes;
//审批中心勾选状态缓存
var SectionArr,EmArr;
var ShopHistory = {
	scrollTop:0,
	sortStatus:"",
	by:0,
	brandid:"",
	brandText:"",
	page:1,
	ch:true,
	res:""
}
//上传之后需刷新页面，故设为全局变量，方便使用;
var uploadScroll;

//==========================全局函数============================
//价格整数小数分割函数
var app;

//2级事件绑定第三个参数兼容函数
function isPassive() {
	var supportsPassiveOption = false;
	try {
		addEventListener("test", null, ObjectProperty({}, 'passive', {
			get: function() {
				supportsPassiveOption = true;
			}
		}));
	} catch(e) {}
	return supportsPassiveOption;
}
//左右滑动只有第一次触发有效判断参数；
var touchflag = true;

var prevent = function(e){
	console.log("禁用啦");
	e.preventDefault();
}


function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURI(r[2]);
	return null;
}
var Companyid = GetQueryString("companyid");
var Customerid = GetQueryString("customerid");
var Userid = GetQueryString("userid");
var Openid = GetQueryString("openid");
var Pageurl =location.href;

//上传图片
function upload() {
	var companyid = "";
	var customerid = "";
	var userid = "";
	var openid = Openid;
	var mydata = "companyid=" + companyid + "&customerid=" + customerid + "&userid=" + userid + "&openid=" + openid;
	var mymd5 = CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex);
	var wordArr = CryptoJS.enc.Utf8.parse(mymd5);
	var sign = CryptoJS.enc.Base64.stringify(wordArr);
	return {
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	};
}
/*--首页--*/
function GetPostData() {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "companyid=" + companyid + "&customerid=" + customerid + "&userid=" + userid + "&openid=" + openid;
	var mymd5 = CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex);
	var wordArr = CryptoJS.enc.Utf8.parse(mymd5);
	var sign = CryptoJS.enc.Base64.stringify(wordArr);
	return {
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	};
}
/*--分类--*/
function CategoryPostData(datatype) {
	var categoryid = GetQueryString("categoryid");
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype + "&categoryid=" + "categoryid" + "&companyid=" + "companyid" + "&customerid=" + "customerid" + "&userid=" + "userid" + "&openid=" + "openid";
	//var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	var mymd5 = CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)
	var wordArr = CryptoJS.enc.Utf8.parse(mymd5);
	var sign = CryptoJS.enc.Base64.stringify(wordArr);
	return {
		datatype: datatype,
		categoryid: categoryid,
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	}
}
/*--商品列表--*/
function ShopListData(datatype, categoryid, dictionaryid, categoryno, brandid, key, page, pagesize, order, by, groupid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype +
		"&categoryid=" + categoryid +
		"&dictionaryid=" + dictionaryid +
		"&categoryno=" + categoryno +
		"&brandid=" + brandid +
		"&key=" + key +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&order=" + order +
		"&by=" + by +
		"&groupid=" + groupid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		datatype: datatype,
		categoryid: categoryid,
		dictionaryid: dictionaryid,
		categoryno: categoryno,
		brandid: brandid,
		key: key,
		page: page,
		pagesize: pagesize,
		order: order,
		by: by,
		groupid: groupid,
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	}
}

/*--详情页参数--*/
function DetailData(datatype, eid, itemid, colorid, sizeid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype +
		"&eid=" + eid +
		"&itemid=" + itemid +
		"&colorid=" + colorid +
		"&sizeid=" + sizeid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		datatype: datatype,
		eid: eid,
		itemid: itemid,
		colorid: colorid,
		sizeid: sizeid,
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	}
}

/*--购物车勾选参数--*/
function CartEditData(cartid, isselect) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "cartid=" + cartid +
		"&isselect=" + isselect +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		cartid: cartid,
		isselect: isselect,
		companyid: companyid,
		customerid: customerid,
		userid: userid,
		openid: openid,
		sign: sign
	}
}
/*--购物车数量--*/
function AddCartData(eid, itemid, orderqty, price, act, cartid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "eid=" + eid +
		"&itemid=" + itemid +
		"&orderqty=" + orderqty +
		"&price=" + price +
		"&act=" + act +
		"&cartid=" + cartid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"eid": eid,
		"itemid": itemid,
		"orderqty": orderqty,
		"price": price,
		"act": act,
		"cartid": cartid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--收藏--*/
function CollectData(act, cartid, eid, itemid, fids) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "act=" + act +
		"&cartid=" + cartid +
		"&eid=" + eid +
		"&itemid=" + itemid +
		"&fids=" + fids +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"act": act,
		"cartid": cartid,
		"eid": eid,
		"itemid": itemid,
		"fids": fids,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--订单提交--*/
function OrderSubmitData(organizeid, addressid, msg, pono, postfee, servicefee, receivemodeid, receivemode, invoiceflag, invoiceid, paymode, distributeid, shipdate, shiptime, istogether) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "organizeid=" + organizeid +
		"&addressid=" + addressid +
		"&msg=" + msg +
		"&pono=" + pono +
		"&postfee=" + postfee +
		"&servicefee=" + servicefee +
		"&receivemodeid=" + receivemodeid +
		"&receivemode=" + receivemode +
		"&invoiceflag=" + invoiceflag +
		"&invoiceid=" + invoiceid +
		"&paymode=" + paymode +
		"&distributeid=" + distributeid +
		"&shipdate=" + shipdate +
		"&shiptime=" + shiptime +
		"&istogether=" + istogether +
		"&receiverstate=" + "" +
		"&receivercity=" + "" +
		"&receiverdistrict=" + "" +
		"&receiveraddress=" + "" +
		"&receivername=" + "" +
		"&receivertel=" + "" +
		"&receivermobile=" + "" +
		"&companyid=" + "companyid" +
		"&customerid=" + "customerid" +
		"&userid=" + "userid" +
		"&openid=" + "openid";
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"organizeid": organizeid,
		"addressid": addressid,
		"msg": msg,
		"pono": pono,
		"postfee": postfee,
		"servicefee": servicefee,
		"receivemodeid": receivemodeid,
		"receivemode": receivemode,
		"invoiceflag": invoiceflag,
		"invoiceid": invoiceid,
		"paymode": paymode,
		"distributeid": distributeid,
		"shipdate": shipdate,
		"shiptime": shiptime,
		"istogether": istogether,
		"receiverstate": "",
		"receivercity": "",
		"receiverdistrict": "",
		"receiveraddress": "",
		"receivername": "",
		"receivertel": "",
		"receivermobile": "",
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--配送方式--*/
function DeliveryData(distributeid, deliverydate) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "distributeid=" + distributeid +
		"&deliverydate=" + deliverydate +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"distributeid": distributeid,
		"deliverydate": deliverydate,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--拆单包裹--*/
function PackageData(togetherid, shipdate) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "togetherid=" + togetherid +
		"&shipdate=" + shipdate +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"togetherid": togetherid,
		"shipdate": shipdate,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--发票信息--*/
function InvoiceData(invoiceflag, invoiceid, invoicecompany, invoicetax, invoiceaddress, invoicetel, invoiceaccount, invoicebank, isdefault) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "invoiceflag=" + invoiceflag +
		"&invoiceid=" + invoiceid +
		"&invoicecompany=" + invoicecompany +
		"&invoicetax=" + invoicetax +
		"&invoiceaddress=" + invoiceaddress +
		"&invoicetel=" + invoicetel +
		"&invoiceaccount=" + invoiceaccount +
		"&invoicebank=" + invoicebank +
		"&isdefault=" + isdefault +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"invoiceflag": invoiceflag,
		"invoiceid": invoiceid,
		"invoicecompany": invoicecompany,
		"invoicetax": invoicetax,
		"invoiceaddress": invoiceaddress,
		"invoicetel": invoicetel,
		"invoiceaccount": invoiceaccount,
		"invoicebank": invoicebank,
		"isdefault": isdefault,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--地区选择--*/
function AreaData(areaid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "areaid=" + areaid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"areaid": areaid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--管理收货地址--*/
function EditaddrData(act, addressid, receivername, receivertel, receivermobile, receiverstate, receivercity, receiverdistrict, receiveraddress, organizeid, isdefault, zip) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "act=" + act +
		"&addressid=" + addressid +
		"&receivername=" + receivername +
		"&receivertel=" + receivertel +
		"&receivermobile=" + receivermobile +
		"&receiverstate=" + receiverstate +
		"&receivercity=" + receivercity +
		"&receiverdistrict=" + receiverdistrict +
		"&receiveraddress=" + receiveraddress +
		"&organizeid=" + organizeid +
		"&isdefault=" + isdefault +
		"&zip=" + zip +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"act": act,
		"addressid": addressid,
		"receivername": receivername,
		"receivertel": receivertel,
		"receivermobile": receivermobile,
		"receiverstate": receiverstate,
		"receivercity": receivercity,
		"receiverdistrict": receiverdistrict,
		"receiveraddress": receiveraddress,
		"organizeid": organizeid,
		"isdefault": isdefault,
		"zip": zip,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--筛选商品列表--*/
function SearchData(datatype, categoryid, dictionaryid, categoryno, brandid, key, page, pagesize, order, by) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype +
		"&categoryid=" + categoryid +
		"&dictionaryid=" + dictionaryid +
		"&categoryno=" + categoryno +
		"&brandid=" + brandid +
		"&key=" + key +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&order=" + order +
		"&by=" + by +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"datatype": datatype,
		"categoryid": categoryid,
		"dictionaryid": dictionaryid,
		"categoryno": categoryno,
		"brandid": brandid,
		"key": key,
		"page": page,
		"pagesize": pagesize,
		"order": order,
		"by": by,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--查看订单--*/
function OrderData(packageid, orderno) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "packageid=" + packageid +
		"&orderno=" + orderno +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"packageid": packageid,
		"orderno": orderno,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--立即购买--*/
function ImBuyData(price, eid, itemid, colorid, sizeid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "price=" + price +
		"&eid=" + eid +
		"&itemid=" + itemid +
		"&colorid=" + colorid +
		"&sizeid=" + sizeid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"price": price,
		"eid": eid,
		"itemid": itemid,
		"colorid": colorid,
		"sizeid": sizeid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--修改用户信息--*/
function UpuserData(act, usernick, usermail, usertel, usermobile) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "act=" + act +
		"&usernick=" + usernick +
		"&usermail=" + usermail +
		"&usertel=" + usertel +
		"&usermobile=" + usermobile +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"act": act,
		"usernick": usernick,
		"usermail": usermail,
		"usertel": usertel,
		"usermobile": usermobile,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--我的订单--*/
function OrdersData(startdate, enddate, sdstate, page, pagesize, key) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "startdate=" + startdate +
		"&enddate=" + enddate +
		"&sdstate=" + sdstate +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&key=" + key +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"startdate": startdate,
		"enddate": enddate,
		"sdstate": sdstate,
		"page": page,
		"pagesize": pagesize,
		"key": key,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--再次审批--*/
function AppagainData(orderno, billno, billtype) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&billno=" + billno +
		"&billtype=" + billtype +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"billno": billno,
		"billtype": billtype,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--取消订单--*/
function CancelorderData(orderno, billno) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&billno=" + billno +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"billno": billno,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--再次购买--*/
function BugagainData(orderno, packageid, billno) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&packageid=" + packageid +
		"&billno=" + billno +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"packageid": packageid,
		"billno": billno,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--申请售后--*/
function ReturnfororderData(orderno) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--退换货订单--*/
function ReturnsData(sdstate, page, pagesize) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "sdstate=" + sdstate +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"sdstate": sdstate,
		"page": page,
		"pagesize": pagesize,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--确定收货(订单签收)--*/
function OrdersignData(orderno, billno, packageid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&billno=" + billno +
		"&packageid=" + packageid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"billno": billno,
		"packageid": packageid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--我的收藏--*/
function FavoritesData(groupid, page, pagesize) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "groupid=" + groupid +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"groupid": groupid,
		"page": page,
		"pagesize": pagesize,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--审批中心--*/
function AuditordersData(datatype, startdate, enddate, sdstate, page, pagesize, key) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype +
		"&startdate=" + startdate +
		"&enddate=" + enddate +
		"&sdstate=" + sdstate +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&key=" + key +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"datatype": datatype,
		"startdate": startdate,
		"enddate": enddate,
		"sdstate": sdstate,
		"page": page,
		"pagesize": pagesize,
		"key": key,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--退货审批列表--*/
function AppreturnsData(key, sdstate, page, pagesize, startdate, enddate) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "key=" + key +
		"&sdstate=" + sdstate +
		"&page=" + page +
		"&pagesize=" + pagesize +
		"&startdate=" + startdate +
		"&enddate=" + enddate +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"key": key,
		"sdstate": sdstate,
		"page": page,
		"pagesize": pagesize,
		"startdate": startdate,
		"enddate": enddate,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--订单状态列表--*/
function StatesData(datatype) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "datatype=" + datatype +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"datatype": datatype,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--退货提交--*/
function ReturnsubmitData(taketime, contactname, phone, operatetype, memo, logisticstype, reason, orderno, details, images) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "taketime=" + taketime +
		"&contactname=" + contactname +
		"&phone=" + phone +
		"&operatetype=" + operatetype +
		"&memo=" + memo +
		"&logisticstype=" + logisticstype +
		"&reason=" + reason +
		"&orderno=" + orderno +
		"&details=" + details +
		"&images=" + images +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"taketime": taketime,
		"contactname": contactname,
		"phone": phone,
		"operatetype": operatetype,
		"memo": memo,
		"logisticstype": logisticstype,
		"reason": reason,
		"orderno": orderno,
		"details": details,
		"images": images,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--审批(同意，拒绝，修改)--*/
function OrderauditData(act, resion, apid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "act=" + act +
		"&resion=" + resion +
		"&apid=" + apid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"act": act,
		"resion": resion,
		"apid": apid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--地址列表信息--*/
function AddressData(key) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "key=" + key +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"key": key,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--修改订单提交--*/
function EditOrderData(orderno, details,act,approvalid) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "orderno=" + orderno +
		"&details=" + details +
		"&act=" + act +
		"&approvalid=" + approvalid +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"orderno": orderno,
		"details": details,
		"act": act,
		"approvalid": approvalid,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

/*--findpwd找回密码--*/
function FindpwdData(userno, email) {
	var openid = Openid;
	var mydata = "userno=" + userno +
		"&email=" + email +
		"&companyid=" + "" +
		"&customerid=" + "" +
		"&userid=" + "" +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"userno": userno,
		"email": email,
		"companyid": "",
		"customerid": "",
		"userid": "",
		"openid": openid,
		"sign": sign
	}
}
/*--申请会员--*/
function LoginData(companyname, address, province, city, area, contacts, phone, tel,  email,  licenceurl,validdate) {
	var openid = Openid;
	var mydata = "companyname=" + companyname +
		"&address=" + address +
		"&province=" + province +
		"&city=" + city +
		"&area=" + area +
		"&contacts=" + contacts +
		"&phone=" + phone +
		"&tel=" + tel +
		"&email=" + email +
		"&licenceurl=" + licenceurl +
		"&validdate=" + validdate +
		"&companyid=" + "" +
		"&customerid=" + "" +
		"&userid=" + "" +
		"&openid=" + openid;

	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"companyname": companyname,
		"address": address,
		"province": province,
		"city": city,
		"area": area,
		"contacts": contacts,
		"phone": phone,
		"tel": tel,
		"email": email,
		"licenceurl": licenceurl,
		"validdate": validdate,
		"companyid": "",
		"customerid": "",
		"userid": "",
		"openid": openid,
		"sign": sign
	}
}
/*--采购留言--*/
function SendmsgData(person, phone, customername, areaid, message) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "person=" + person +
		"&phone=" + phone +
		"&customername=" + customername +
		"&areaid=" + areaid +
		"&message=" + message +

		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"person": person,
		"phone": phone,
		"customername": customername,
		"areaid": areaid,
		"message": message,

		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--取消退货(售后)or退货详情--*/
function CancelreturnData(returnno) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "returnno=" + returnno +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"returnno": returnno,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}
/*--压缩上传图片--*/
function Upload2Data(filedata,filename) {
	var companyid = Companyid;
	var customerid = Customerid;
	var userid = Userid;
	var openid = Openid;
	var mydata = "filedata=" + filedata +
		"&filename=" + filename +
		"&companyid=" + companyid +
		"&customerid=" + customerid +
		"&userid=" + userid +
		"&openid=" + openid;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"filedata": filedata,
		"filename":filename,
		"companyid": companyid,
		"customerid": customerid,
		"userid": userid,
		"openid": openid,
		"sign": sign
	}
}

//扫一扫获取参数
function code() {
	var companyid = Companyid;
	var pageurl = Pageurl;
	
	var mydata = "&companyid=" + companyid +
		"&pageurl=" + pageurl;
	var sign = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(CryptoJS.MD5(mydata).toString(CryptoJS.enc.Hex)));
	return {
		"companyid": companyid,
		"pageurl": pageurl,
		"sign": sign
	}
}


/*--判断是否是大客户--*/
var ka = true;
var timer = function() {};
var myIndexData = GetPostData();
var myCartData = GetPostData();
var mySearchData = GetPostData();
var mySettlementData = GetPostData();
//var myAddressData = AddressData();
var myPaymodesData = GetPostData();
/*--强制关闭浏览器地址栏--*/
//上传照片
var uploadData = upload();
window.onload = function() {
	setTimeout(function() {
		window.scrollTo(0, 1)
	}, 0);
};

/*--价格整数小数分割函数--*/
function priceSplit(arr) {
	for(var i = 0; i < arr.length; i++) {
		//价格整数、小数部分
		arr[i].itprice = {
			"big_price": "",
			"small_price": ""
		};
		//for循环体
		arr[i].itprice.big_price = parseInt(arr[i].price);
		arr[i].itprice.small_price = arr[i].price.toString().split(".")[1];
	};
	return arr;
}
//保留两位小数函数
function changeTwoDecimal_f(x) {　　
	var f_x = parseFloat(x);　　
	if(isNaN(f_x))　　 {　　　　
		return 0;　　
	}　　
	var f_x = Math.round(x * 100) / 100;　　
	var s_x = f_x.toString();　　
	var pos_decimal = s_x.indexOf('.');　　
	if(pos_decimal < 0)　　 {　　　　
		pos_decimal = s_x.length;　　
		s_x += '.';　　
	}　　
	while(s_x.length <= pos_decimal + 2)　　 {　　　　
		s_x += '0';　　
	}　　
	return s_x;
}

var processScroll;

//=====================上传图片====================
function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

function uploadPic(obj) {
	alert("test",$(".pic_look1").attr("src"));
	var objUrl = getObjectURL(obj.files[0]);
	console.log(objUrl);

	if($(".pic_li").length < 5) {
		//$(".is_load").css("display", "block");
		var _that = obj;
		var index = $(obj).attr("qnumber");
		var newIndex = parseInt(index) + 1;
		var newId = "upload" + newIndex;
		console.log(newId, newIndex);
		//add为1新增，为0修改
		var add = $(obj).attr("add");
		var id = $(obj).attr("id");

		$.ajaxFileUpload({
			type: "post",
			url: "/api/b2b/upload",
			data: myIndexData,
			secureuri: false,
			fileElementId: id,
			datatype: "json",
			success: function(data, status) {
				$(".is_load").css("display", "none");
				var jsonData = JSON.parse(data);
				$(".prompt_success .txt").html("上传成功");
				$(".prompt_success").fadeIn(200);
				setTimeout(function() {
					$(".prompt_success").fadeOut(200);
				}, 1000);
				console.log(jsonData);
				if(jsonData.error == 0) {
					if(add == "1") {

						$(".upload_box input").attr("name", newId);
						$(".upload_box input").attr("id", newId);
						$(".upload_box input").attr("qnumber", newIndex);
						var myLi = $(".pic_img #pic_li").clone(true);
						$(myLi).removeAttr("id").attr({
							"picIndex": index,
							"class": "pic_li",
							"imageurl": jsonData.resources[0]
						})
						$(myLi).find("input").attr("name", id);
						$(myLi).find("input").attr("id", id);
						$(myLi).find("input").attr("qnumber", index);
						$(myLi).find("img").attr("src", jsonData.resources[0]);
						$(".upload_box").before($(myLi));
						setTimeout(function() {
							processScroll.refresh();
						}, 200);
					} else if(add == "0") {
						//console.log($(".pic_img li[picIndex=" + index + "]"));
						//$(".pic_img li[picIndex=" + index + "]").find("img").attr("src", jsonData.resources[0]);
					}
				}

			},
			error: function(data) {
				$(".is_load").css("display", "none");
				$(".prompt_fail .txt").html("上传失败");
				$(".prompt_fail").fadeIn(200);
				setTimeout(function() {
					$(".prompt_fail").fadeOut(200);
					console.log(data);
					alert(data);
				}, 1000);
			}
		});
	} else {
		$(".prompt_fail .txt").html("图片最多不能超过5张");
		$(".prompt_fail").fadeIn(200);
		setTimeout(function() {
			$(".prompt_fail").fadeOut(200);
			console.log(data);
			alert(data);
		}, 1000);
	}
}

function uploadPic2(obj) {
	$(".is_load .txt").html("正在上传...");
	$(".is_load").css("display", "block");
	var _that = obj;
	var id = $(obj).attr("id");
	var name = $(obj).attr("name");
	console.log(name);
	$.ajaxFileUpload({
		type: "post",
		url: "/api/b2b/upload",
		data: uploadData,
		secureuri: false,
		fileElementId: id,
		datatype: "json",
		success: function(data, status) {
			$(".is_load").css("display", "none");
			var jsonData = JSON.parse(data);
			$(".prompt_success .txt").html("上传成功");
			$(".prompt_success").fadeIn(200);
			setTimeout(function() {
				$(".prompt_success").fadeOut(200);
			}, 1000);
			console.log(jsonData);
			if(jsonData.error == 0) {
					$("img.pic_look1").attr("src", jsonData.resources[0]);
					$(".pic1Img").css("height","auto");
					$(".uploadAgain").css("display","flex");
					$(".pic1 input").removeAttr("id");
					$(".space3 input").attr("id","businessLicence");
					ApplyVip.licenceurl = jsonData.resources[0];
					
					var time = setTimeout(function(){
						console.log("=========刷新成功");
						uploadScroll.refresh();
					},5000);
			}

		},
		error: function(data) {
			$(".is_load").css("display", "none");
			$(".prompt_fail .txt").html("上传失败");
			$(".prompt_fail").fadeIn(200);
			setTimeout(function() {
				$(".prompt_fail").fadeOut(200);
				console.log(data);
				alert(data);
			}, 1000);
		}
	});

}

function handleFileSelect(evt) {
	// var filebtn = document.getElementById(id);
	// console.log(filebtn);
	// var files = filebtn.target.files;
	// console.log(filebtn.target);
	console.log(files);
	var files = evt.target.files;
	for(var i = 0, f; f = files[i]; i++) {

		// Only process image files.
		if(!f.type.match('image.*')) {
			continue;
		}

		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// Render thumbnail.
				// console.log(evt.target.files[0]);
				// console.log(e.target);
				console.log(e.target.result);
				var i = document.getElementById("test");
				i.src = event.target.result;
				console.log($(i).width());
				console.log($(i).height());
				$(i).css('width', $(i).width() / 10 + 'px');
				//$(i).css('height',$(i).height()/10+'px');
				console.log($(i).width());
				console.log($(i).height());
				var quality = 50;
				i.src = jic.compress(i, quality).src;
				console.log(i.src);
				i.style.display = "block";
			};
		})(f);

		// Read in the image file as a data URL.
		reader.readAsDataURL(f);
	}
}

//======================h5压缩图片上传(不超过5张)==========================
var uploadFlag = "";
//申请售后上传相应函数
function uploadBtnChange() {
	
	if($(".pic_li .is_img").length<5){
		uploadFlag = "return";
		$(".is_load .txt").html("正在上传...");
		$(".is_load").css("display","block");
		var scope = this;
		if(window.File && window.FileReader && window.FileList && window.Blob) {
			//获取上传file
			var filefield = document.getElementById('fileToUpload'),
				file = filefield.files[0];
			//获取用于存放压缩后图片base64编码
	
			var compressValue = document.getElementById('compressValue');
			console.log("file and compressValue", file, compressValue);
			processfile(file, compressValue,"/api/b2b/upload2");
		
		} else {
			alert("此浏览器不完全支持压缩上传图片");
		}
	}else{
		$(".prompt_fail .txt").html("上传照片数量不能超过5张!");
			$(".prompt_fail").fadeIn(200);
			setTimeout(function() {
				$(".prompt_fail").fadeOut(200);
			}, 1000);
	}
}
//上传证件相应函数
function uploadLicense(){
	uploadFlag = "license"
	$(".is_load .txt").html("正在上传...");
	$(".is_load").css("display","block");
	var scope = this;
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		//获取上传file
		var filefield = document.getElementById('businessLicence'),
			file = filefield.files[0];
		//获取用于存放压缩后图片base64编码

		var compressValue = document.getElementById('compressValue');
		console.log("file and compressValue", file, compressValue);
		processfile(file, compressValue,"/api/b2b/upload");
	
	} else {
		alert("此浏览器不完全支持压缩上传图片");
	}
}

function processfile(file, compressValue,url) {
	var filename = file.name;
	console.log("filename",filename);
	var reader = new FileReader();
	reader.onload = function(event) {
		var blob = new Blob([event.target.result]);
		window.URL = window.URL || window.webkitURL;
		var blobURL = window.URL.createObjectURL(blob);
		var image = new Image();
		image.src = blobURL;
		image.onload = function() {
			var resized = resizeMe(image);
			//console.log("resized是", resized);
			var myUpload2Data = Upload2Data(resized,filename);
			
			//图片上传
			$.ajax({
				url:url,
				type:"POST",
				data:myUpload2Data,
				dataType:"JSON",
				success:function(res){
					console.log(res);
					if(uploadFlag=="return"){
						appreturn(resized);
					}else{
						license(resized);
					}
					
					
				},error:function(res){
					alert(res.resources[0].msg);
				}
			})
			setTimeout(function() {
				processScroll.refresh();
			}, 200);
		}
	};
	reader.readAsArrayBuffer(file);
}

function resizeMe(img) {
	//压缩的大小
	var max_width = 1920;
	var max_height = 1080;

	var canvas = document.createElement('canvas');
	var width = img.width;
	var height = img.height;
	if(width > height) {
		if(width > max_width) {
			height = Math.round(height *= max_width / width);
			width = max_width;
		}
	} else {
		if(height > max_height) {
			width = Math.round(width *= max_height / height);
			height = max_height;
		}
	}

	canvas.width = height;
	canvas.height = width;

	var ctx = canvas.getContext("2d");
	ctx.save();
	ctx.translate(height,0);
	ctx.rotate(90*Math.PI/180);
	ctx.drawImage(img, 0, 0, width, height);
	ctx.restore();
	//压缩率
	return canvas.toDataURL("image/jpeg", 0.92);
}

function appreturn(src){
	$(".is_load").css("display","none");
	var myLi = $(".pic_img #pic_li").clone(true);
	$(myLi).removeAttr("id").attr({
		"class": "pic_li"
	})
	$(myLi).find("img").attr("src", src);
	$(".upload_box").before($(myLi));
}

function license(src){
	$(".is_load").css("display", "none");
	$(".prompt_success .txt").html("上传成功");
	$(".prompt_success").fadeIn(200);
	setTimeout(function() {
		$(".prompt_success").fadeOut(200);
	}, 1000);
	$("img.pic_look1").attr("src", src);
	$(".pic1Img").css("height","auto");
	$(".uploadAgain").css("display","flex");
	$(".pic1 input").removeAttr("id");
	$(".space3 input").attr("id","businessLicence");
	ApplyVip.licenceurl = src;
}

//===================调用微信扫一扫功能======================
var codeData = code();
$.ajax({
	type:"POST",
	url:"http://m.shop-box.com.cn/api/b2b/GetJsSdkConfig",
	data:codeData,
	success:function(res){
		console.log("微信扫一扫获取参数",res);
		var data = res.resources[0];
		wxConfig(data.appId,data.timestamp,data.nonceStr,data.signature);
	}
})


function wxConfig(appId,timestamp,nonceStr,signature){
	wx.config({
		debug:false,
		appId:appId,
		timestamp:timestamp,
		nonceStr:nonceStr,
		signature:signature,
		jsApiList:["scanQRCode"]
	})
}

function scanCode(){
	wx.scanQRCode({
		needResult:1,
		scanType:["qrCode"],
		success:function(res){
			//console.log(res);
			//alert(JSON.stringify(res));
			$("#openId").val(GetQueryString("openid"));
			$("#authcode").val(res.resultStr);
			document.getElementById("formId").submit();
			
		}
	})
}



//wxConfig("1516872131","YIFENGWECHAT","7E5FA83C32D6A5FA5BC10F6CFA0E5342BDBB1976");

