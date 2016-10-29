$(function(){
	var browser=navigator.appName
	var b_version=navigator.appVersion
	var version=b_version.split(";");
	var trim_Version=version[1].replace(/[ ]/g,"");

	var classify = decodeURIComponent(window.location.search).replace("?","");
	var sel_mes = "";   //当前匹配的关键字
	var brand_mes = ""; //品牌
	var pageIndex = 0;  //当前页
	var pageNum = 16;   //一页16个
	var parSort = "销量"; //当前排序
	var height = $(window).height()/2;
	//设置title
	if(!(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")){
		$("title").html("麦考林--"+classify+"产品专区"); //Ie8不可以
	}
	$(".pro-brand h2").append("<span>></span><a href='###'>"+classify+"</a>");
	
	var user = "";
	if(sessionStorage.getItem("now")){
		user = sessionStorage.getItem("now");
		var total = parseInt(localStorage.getItem("total"+user)) || 0;
		if(localStorage.getItem("cart"+user)){
			var obj = JSON.parse(localStorage.getItem("cart"+user));
		}
		else{
			var obj = {};
		}
	}
	else{
		var total =parseInt(sessionStorage.getItem("total")) || 0;
		if(sessionStorage.getItem("cart"+user)){
			var obj = JSON.parse(sessionStorage.getItem("cart"));
		}
		else{
			var obj = {};
		}
	}
	
	//获取左侧品牌的数据
	$.get('../brandlist.json', function(data) {
		var data = data.result;
		var brand = "<div></div>";
		$.each(data,function(index, el) {
			if(el.banner){
				brand += "<li><a href='brand.html?"+el.cid+"'>"+el.className+"</a></li><div></div>";
			}
			$(".brandmenu").html(brand);
		});
	});
	//品牌数据
	$.get("../proinfo.json",function(data){
		var brandStr = "";
		var arr = {};
		var re = new RegExp(classify,"g");
		$.each(data.result,function(index,value){
			if(re.test(value.key_word)){
				if(arr[value.brand]){
					arr[value.brand] ++;
				}
				else{
					arr[value.brand] = 1;
				}
			}
		});
		$.each(arr,function(index,value){
			brandStr += "<span><a href='javascript:;'><i>"+index+"</i><b>("+value+")</b></a></span>";
		});
		$(".pro-brand-list li").eq(0).find("p").append(brandStr);
		
		var brandH = $(".pro-brand-list li").eq(0).height();
		$(".pro-brand-list li").css("height","42px");
		$(".more-hide").click(function(){
			$(this).parents("li").stop().animate({
				height: "42px"
			});
			$(".more-hide").hide();
			$(".more").show();
		});
		$(".more").click(function(){
			$(this).parents("li").stop().animate({
				height: brandH
			});
			$(".more-hide").show();
			$(".more").hide();
		})
	});
	
	//分类数据
	$.get("../proclass.json",function(data){
		var classifyStr = "";
		$.each(data.result,function(index,value){
			if(value.className == classify){
				$.each(value.classify,function(index,value){
					classifyStr +="<span><a href='javascript:;'><i>"+value.classifyN+"</i><b>("+value.classifyNum+")</b></a></span>";
				});
			}
		});
		if(classifyStr==""){
			$(".pro-brand-list li").eq(1).remove();
		}
		else{
			$(".pro-brand-list li").eq(1).find("p").append(classifyStr);
		}
	});
	
	$(".pro-brand h2 a:eq(1)").click(function(){
		brand_mes = "";
		sel_mes = "";
		$(this).nextAll().remove();
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	//点击品牌
	$(".brand p").on("click","span a",function(){
		brand_mes = $(this).find("i").html();
		pageIndex = 0;
		$(this).css({
			"color":"#888",
			"text-decoration":"none"
		});
		if($(".brand-jiao")){
			$(".brand-jiao").next().remove()
			$(".brand-jiao").remove();
		}
		$(".pro-brand h2").append("<span class='brand-jiao'>></span><a href='###'>"+brand_mes+"</a>");
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	
	//点击分类
	$(".selMes p").on("click","span a",function(){
		sel_mes = $(this).find("i").html();
		pageIndex = 0;
		$(this).css({
			"color":"#e8254a",
			"text-decoration":"none"
		});
		$(this).parent().siblings().find("a").css({
			color: "#888"
		});
		if($(".classify-jiao")){
			$(".classify-jiao").next().remove()
			$(".classify-jiao").remove();
		}
		$(".pro-brand h2").append("<span class='classify-jiao'>></span><a href='###'>"+sel_mes+"</a>");
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	//点击排序导航
	$(".subnaver li a").click(function(){
		parSort = $(this).text();
		pageIndex = 0;
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
		$(this).parent().siblings().find("a").removeClass("active");
		$(this).addClass("active");
		$(this).parent().siblings().find("a .down").removeClass("down-active");
		$(this).find(".down").addClass("down-active");
		if($(this).find(".up-down").hasClass("up-down-active1")){
			$(this).find(".up-down").removeClass("up-down-active1");
			$(this).parent().siblings().find("a .up-down").removeClass("up-down-active2");
			$(this).find(".up-down").addClass("up-down-active2");
		}
		else if($(this).find(".up-down").hasClass("up-down-active2")){
			$(this).find(".up-down").removeClass("up-down-active2");
			$(this).parent().siblings().find("a .up-down").removeClass("up-down-active1");
			$(this).find(".up-down").addClass("up-down-active1");
		}
		else{
			$(this).parent().siblings().find("a .up-down").removeClass("up-down-active1");
			$(this).find(".up-down").addClass("up-down-active1");
		}
	});
	//点击加入购物车
	$(".pro-list").on("click",".addCar",function(){
		total ++;
		var pnum = obj[$(this).attr("pid")] || 0;
		obj[$(this).attr("pid")] = ++pnum;
		var objToStr = JSON.stringify(obj);
		if(user==""){
			sessionStorage.setItem("cart",objToStr);
			sessionStorage.setItem("total"+user,total);
		}
		else{
			localStorage.setItem("cart"+user,objToStr);
			localStorage.setItem("total"+user,total);
		}
		
		$(".h_carnum").html(total);
		$(".mask").show();
		$(".mask-mes").animate({
			top: height
		})
	});
	$(".mask-close").click(function(){
		$(".mask").fadeOut();
	});
	$(".aigin").click(function(){
		$(".mask").fadeOut();
	});
	
	getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	//翻页功能
	$(".page-btn").on("click",".fp",function(){
		pageIndex=0;
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	$(".page-btn").on("click",".pre",function(){
		pageIndex--;
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	$(".page-btn").on("click",".next",function(){
		pageIndex++;
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	$(".page-btn").on("click",".lp",function(){
		pageIndex=num;
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	$(".page-btn").on("click","li",function(){
		pageIndex=$(this).index();
		getProlist(pageNum,pageIndex,parSort,sel_mes,brand_mes);
	});
	
	//获取列表数据
	function getProlist(pageNum,index,sort_mes,sel_mes,brand){
		var listStr = "";
		$(".page-btn").html("<a href='javascript:;' class='w60 fp'>首页</a>"+
				"<a href='javascript:;' class='w60 pre'>上一页</a>"+
				"<ul class='page-list p0'>"+
				"</ul>"+
				"<a href='javascript:;' class='w60 next'>下一页</a>"+
				"<a href='javascript:;' class='w60 lp'>尾页</a>");
		$.get('../proinfo.json', function(data) {
			var data = data.result;
			var pro = [];
			var match = classify+sel_mes;
			$.each(data, function(index,el) {
				var re = new RegExp(match);
				
				if(re.test(el.key_word.replace(/\s/gi,""))){
					if(brand != ""){
						if(brand == el.brand){
							if(!el.tel){
								pro.push(el);
							}
						}
					}
					else{
						if(!el.tel){
							pro.push(el);
						}
					}
				}
			});
			if(sort_mes == "销量"){
				soreMes("sellNum",pro,true);
			}
			else if(sort_mes == "价格"){
				if($(".subnaver li").find(".up-down").hasClass("up-down-active2")){
					soreMes("price",pro,true);
				}
				else{
					soreMes("price",pro,false);
				}
			}
			else{
				soreMes("proTime",pro,true);
			}
			num = Math.ceil(pro.length/pageNum);
			if(num == 0 || num == 1){
				$(".fp").remove();
				$(".pre").remove();
				$(".next").remove();
				$(".lp").remove();
			}
			var page = "";
			for(var i = 1; i <= num; i++){
				page += "<li><a href='javascript:;'>"+i+"</a></li>"
			}
			$(".page-list").html(page);
			$(".page-list li a").eq(index).addClass("active");
			if(index==0){
				$(".fp").remove();
				$(".pre").remove();
			}
			if(index == (num-1)){
				$(".next").remove();
				$(".lp").remove();
			}
			var max = Math.min(pro.length,(index+1)*pageNum)
			for(var i = index*pageNum; i<max ;i++){
				listStr += "<li><a href='info.html?"+pro[i].pid+"'>"+
						"<p><img src='"+pro[i].showimg+"'></p>"+
						"<h3>"+pro[i].title+"</h3></a>"+
						"<strong>￥"+pro[i].price+"</strong>"+
						"<span class='addCar index-bg' pid='"+pro[i].pid+"'></span>"+
						"</li>";
			}
			if(listStr == ""){
				$(".pro-list").html("<p class='no-pro m0'>对不起！暂无商品</p>");
			}
			else{
				$(".pro-list").html(listStr);
			}
		});
	}

	function soreMes(sort,pro,downSort){
		//从大到小
		if(downSort){
			for(var i = 0 ; i < pro.length-1; i++){
				for(var j = 0; j < pro.length-1-i;j++){
					if(sort=="proTime"){
						if(new Date(pro[j][sort]).getTime()<new Date(pro[j+1][sort]).getTime()){
							var temp = pro[j];
							pro[j] = pro[j+1];
							pro[j+1]=temp;
						}
					}
					else{
						if(parseInt(pro[j][sort])<parseInt(pro[j+1][sort])){
							var temp = pro[j];
							pro[j] = pro[j+1];
							pro[j+1]=temp;
						}
					}
				}
			}
		}
		else{
			for(var i = 0 ; i < pro.length-1; i++){
				for(var j = 0; j < pro.length-1-i;j++){
					if(parseInt(pro[j][sort])>parseInt(pro[j+1][sort])){
						var temp = pro[j];
						pro[j] = pro[j+1];
						pro[j+1]=temp;
					}
				}
			}
		}
		$.each(pro,function(index,value){
			//console.log(value[sort]);
		});
		return pro;
	}
});