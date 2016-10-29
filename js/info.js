$(function() {
	//设置title
	var browser=navigator.appName
	var b_version=navigator.appVersion
	var version=b_version.split(";");
	var trim_Version=version[1].replace(/[ ]/g,""); 
	
	var pid = window.location.search.replace("?", "");
	var height = $(window).height()/2;
	
	//当前用户
	var user = "";
	if(sessionStorage.getItem("now")){
		user = sessionStorage.getItem("now");
		var total = parseInt(localStorage.getItem("total"+user)) || 0;
		//购物车cookie
		if(localStorage.getItem("cart"+user)){
			var obj = JSON.parse(localStorage.getItem("cart"+user));
		}
		else{
			var obj = {};
		}
		//历史cookie
		if(localStorage.getItem("his"+user)){
			var his = JSON.parse(localStorage.getItem("his"+user));
		}
		else{
			var his = {};
			his.length =0;
		}
	}
	else{
		var total = parseInt(sessionStorage.getItem("total")) || 0;
		//购物车cookie
		if(sessionStorage.getItem("cart")){
			var obj = JSON.parse(sessionStorage.getItem("cart"));
		}
		else{
			var obj = {};
		}
		
		//历史cookie
		if(sessionStorage.getItem("his")){
			var his = JSON.parse(sessionStorage.getItem("his"));
		}
		else{
			var his = {};
			his.length =0;
		}
	}
	$(".h_carnum").html(total);
	//所有用户
	if(localStorage.getItem("user")){
		var objUser = JSON.parse(localStorage.getItem("user"));
		if(sessionStorage.getItem("pre")){
			$(".userName").val(sessionStorage.getItem("pre"));
		}
	}
	else{
		var objUser = {};
	}
	//设置样式
	setStyle();
	
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
	
	$.get("../proinfo.json", function(data) {
		var data = data.result;
		var flag = false;
		$.each(data, function(index, el) {
			if (pid == el.pid) {
				setHistory();
				getProInfo(data,el);
				flag = true;
			}
		});
		if(!flag){
			window.location="../index.html";
		}
	});
	//存入历史记录
	function setHistory(){
		var hFlag = true;
		$.each(his, function(index,value) {
			if(value==pid){
				hFlag = false;	
			}
		});
		if(hFlag){
			if(his.length<6){
				his[his.length]=pid;
			}
			else{
				his[5]=pid;
			}
			his.length++;
			var hisToStr = JSON.stringify(his);
			if(user){
				localStorage.setItem("his"+user,hisToStr);
			}
			else{
				sessionStorage.setItem("his",hisToStr);
			}
			
		}
	}
	//点击缩略图切换图片
	$(".smallImg").on("click", "a", function() {
		$(".banImg").find("img").attr("src", $(this).find("img").attr("ban_src"));
		$(".cloudzoom-lens").find("img").attr("src", $(this).find("img").attr("ban_src"));
		$(".bigImg").find("img").attr("src", $(this).find("img").attr("big_src"));
	});
	
	//点击加入购物车
	$(".content").on("click",".addCar,.addCar-info",function(){
		var n = parseInt($(".pro_num").find("input[type=text]").val());
		console.log(n)
		total += n;
		var pnum = obj[$(this).attr("pid")] || 0;
		obj[$(this).attr("pid")] = pnum+n;
		var objToStr = JSON.stringify(obj);
		if(user==""){
			sessionStorage.setItem("cart",objToStr);
			sessionStorage.setItem("total",total);
		}
		else{
			localStorage.setItem("cart"+user,objToStr);
			localStorage.setItem("total"+user,total);
		}
		$(".h_carnum").html(total);
		$(".mask-car").show();
		$(".mask-mes").animate({
			top: height
		})
		
	});
	$(".aigin").click(function(){
		$(".mask-car").fadeOut(function(){$(".mask-mes").css("top","-200px")});
	});
	$(".mask-close").click(function(){
		$(".mask-car").fadeOut(function(){$(".mask-mes").css("top","-200px")});
	});
	$(".aigin").click(function(){
		$(".mask-car").fadeOut(function(){$(".mask-mes").css("top","-200px")});
	});
	//放大镜功能
	$(".banImg").hover(function(ev) {
		var ev = ev || window.event;
		$(this).css("cursor", "crosshair");
		$(this).find(".cloudzoom-blank").stop().fadeIn();
		$(".bigImg").stop().show();
		$(".bigImg").stop().animate({
			top: "0",
			left: "110%",
			width: "50%",
			height: "213px"
		});
		var bigW = $(".bigImg img").width();
		var bigH = $(".bigImg img").height();
		
		//鼠标滚动放大
		$(this).on("mousewheel", function(ev) {
			var ev = ev || window.event;
			var temp = 0;
			var l = $(".cloudzoom-lens").position().left;
			var t = $(".cloudzoom-lens").position().top;
			if (ev.originalEvent.wheelDelta < 0) {
				temp = $(".cloudzoom-lens").height() + 10;
				if (temp > 300) {
					temp = 300;
				} else {
					l -= 5;
					t -= 5;
				}
			} else {
				temp = $(".cloudzoom-lens").height() - 10;
				if (temp < 100) {
					temp = 100;
				} else {
					l += 5;
					t += 5;
				}
			}
			$(".cloudzoom-lens").css({
				width: temp + "px",
				height: temp + "px",
				left: l + "px",
				top: t + "px"
			});
			$(".bigImg img").css({
				width: bigW / (temp / 100) + "px",
				height: bigH / (temp / 100) + "px"
			})
			var maxL = $(".banImg").innerWidth() - $(".cloudzoom-lens").outerWidth();
			var maxT =$(".banImg").innerHeight() - $(".cloudzoom-lens").outerHeight();
			glass(l,t,maxL,maxT)
			return false;
		});
		$(".banImg").mousemove(function(ev) {
			var ev = ev || window.event;
			var l = ev.pageX - $(this).offset().left - $(".cloudzoom-lens").outerWidth() / 2;
			var t = ev.pageY - $(this).offset().top - $(".cloudzoom-lens").outerWidth() / 2;
			var maxL = $(this).innerWidth() - $(".cloudzoom-lens").outerWidth();
			var maxT = $(this).innerHeight() - $(".cloudzoom-lens").outerHeight();
			glass(l,t,maxL,maxT);
		})
	}, function() {
		$(this).find(".cloudzoom-blank").stop().fadeOut();
		$(".bigImg").stop().animate({
			top: "45%",
			left: "55%",
			width: "0",
			height: "0"
		}, function() {
			$(".bigImg").stop().hide();
		});
	})
	$(".login-mes h2 .right").click(function(){
		$(".login-mask").fadeOut(function(){
			$(".login-mes").css("top","-200px");
		});
	})
	
	function glass(l, t, maxL, maxT) {
		if (l < -1) {
			l = -1
		} else if (l > maxL) {
			l = maxL
		}
		if (t < -1) {
			t = -1
		} else if (t > maxT) {
			t = maxT
		}
		$(".cloudzoom-lens").css({
			left: l + "px",
			top: t + "px"
		});
		$(".cloudzoom-lens img").css({
			left: l * (-1) + $(".banImg img:first-child").position().left - 1 + "px",
			top: t * (-1) - 1 + "px"
		});
		var percentX = l / (maxL);
		var percentY = t / (maxT);
		var imgLeft = percentX * ($(".bigImg").outerWidth() - $(".bigImg img").outerWidth());
		var imgTop = percentY * ($(".bigImg").outerHeight() - $(".bigImg img").outerHeight());
		$(".bigImg img").css({
			left: imgLeft + "px",
			top: imgTop + "px"
		})
	}

	function setStyle() {
		$(".share-list li").eq(0).find("a").css({
			"background-position": "-155px 0px"
		});
		$(".share-list li").eq(1).find("a").css({
			"background-position": "-1px 0px"
		});
		$(".share-list li").eq(2).find("a").css({
			"background-position": "-94px 0px"
		});
		$(".share-list li").eq(3).find("a").css({
			"background-position": "-63px 0px"
		});
		$(".share-list li").eq(4).find("a").css({
			"background-position": "-125px 0px"
		});
		$(".share-list li").eq(5).find("a").css({
			"background-position": "-32px 0px"
		});
		//分享鼠标移入
		$(".share-list li a").hover(function() {
			$(this).animate({
				"background-position-y": "-25px"
			});
		}, function() {
			$(this).animate({
				"background-position-y": "0px"
			});
		});
		$(".share-list li").eq(0).hover(function() {
			$(".share_go").show()
		}, function() {
			$(".share_go").hide();
		});
		$(".share_go").hover(function() {
			$(this).stop().show();
		}, function() {
			$(this).hide();
		})
		$(".share_go li").eq(0).find("a").css({
			"background-position": "4px -2439px"
		});
		$(".share_go li").eq(1).find("a").css({
			"background-position": "4px -47px"
		});
		$(".share_go li").eq(2).find("a").css({
			"background-position": "4px -99px"
		});
		$(".share_go li").eq(3).find("a").css({
			"background-position": "4px -3063px"
		});
		$(".share_go li").eq(4).find("a").css({
			"background-position": "4px -1607px"
		});
		$(".share_go li").eq(5).find("a").css({
			"background-position": "4px -203px"
		});
		$(".share_go li").eq(6).find("a").css({
			"background-position": "4px -255px"
		});
		$(".share_go li").eq(7).find("a").css({
			"background-position": "4px -2543px"
		});
		$(".share_go li").eq(8).find("a").css({
			"background-position": "4px -307px"
		});
		$(".share_go li").eq(9).find("a").css({
			"background-position": "4px -359px"
		});
		$(".share_go li").eq(10).find("a").css({
			"background-position": "4px -723px"
		});
		$(".share_go li").eq(11).find("a").css({
			"background-position": "4px -463px"
		});
		$(".share_go li").eq(12).find("a").css({
			"background-position": "4px -151px"
		});
		$(".share_go li").eq(13).find("a").css({
			"background-position": "4px -2647px"
		});
		$(".share_go li").eq(14).find("a").css({
			"background-position": "4px -2491px"
		});
		$(".share_go li").eq(15).find("a").css({
			"background-position": "4px -3115px"
		});
	}

	function getProInfo(data,el) {
		//title
		if(!(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")){
			$("title").html("麦考林--"+el.title+"产品"); //Ie8不可以
		}
		//左侧
		var smallStr = "";
		$.each(el.smallImg, function(index, value) {
			smallStr += "<div class='col-xs-6 col-md-3 p0'>" +
				"<a href='javascript:;' class='thumbnail'>" +
				"<img src='" + value + "' big_src='" + el.bigImg[index] + "'ban_src='" + el.banimg[index] + "'>" +
				"</a>" +
				"</div>";
		});
		$(".smallImg").html(smallStr);
		//$("title").html("【" + el.title + "】");
		$(".banImg img").attr("src", $(".smallImg div").eq(0).find("img").attr("ban_src"));
		$(".bigImg img").attr("src", $(".smallImg div").eq(0).find("img").attr("big_src"));
		//右侧
		var pro_info = "";
		pro_info += "<h1>" + el.title + "</h1>" +
			"<p>" +
			"<span class='left'>品牌：" + el.brand + "</span>" +
			"<span class='right'>商品编号：" + el.pno + "</span>" +
			"</p>" +
			"<p class='price'>" + el.price + "</p>";
		if (!el.tel) {
			if (el.exchange) {
				pro_info += "<p class='pro_change'>" +
					"<span>超值换：" + el.exchange + "</span>" +
					"<a href='#'>去兑换商品</a>" +
					"</p>";
			}
			pro_info += "<p class='pro_num'>" +
				"<span>数量：</span>" +
				"<input type='button' class='add' value='+'/>" +
				"<input readonly='readonly' type='text' value='1'/>" +
				"<input type='button' class='sub' value='-'/>" +
				"</p>" +
				"<p>" +
				"<input class='addCar-info' type='button' pid='"+el.pid+"' value='加入购物车'/>" +
				"<input class='add_collect' pid='"+el.pid+"' type='button' value='加入收藏'/>" +
				"</p>";
		} else {
			pro_info += "<p class='pro_tel'></p>";
		}
		$(".info-right").prepend(pro_info);
		$(".sel-list li").eq(0).find("a").addClass("select");
		$(".add_collect").hover(function(){
			$(this).css("background-position","10px -20px");
		},function(){
			$(this).css("background-position","10px 12px");
		});
		$(".sub").click(function(){
			var num = parseInt($(this).prev().val());
			if (num > 1) {
				num--;
				$(this).prev().val(num);
			}
		});
		$(".add").click(function(){
			var num = parseInt($(this).next().val());
			num++;
			$(this).next().val(num);
		})
		getproMes(el);
		getComment(el,0,5);
		getQuest(el);
		relate(data,el);
		getHis(data);
		
		//点击切换（选项卡）
		$(".sel-list li").click(function(){
			$(this).siblings().find("a").removeClass("select");
			$(this).find("a").addClass("select");
			$(".info-introduce").html("");
			if($(this).index()==0){
				getproMes(el);
				getComment(el,0,5);
				getQuest(el);
			}
			else if($(this).index()==1){
				getComment(el,0,5);
			}
			else{
				getQuest(el);
			}
		});
	}
	//商品信息
	function getproMes(el){
		var introImg = "";
		var infoMes = "";
		$("<div class='pro-mes'><div class='info-tab'><table></table></div></div>").appendTo(".info-introduce");
		$.each(el.introImg,function(index,value){
			introImg += "<img src='"+value+"'/>";
		});
		$.each(el.info,function(index,value){
			infoMes += "<tr><td>"+value+"</td></tr>";
		});
		$(".pro-mes").prepend(introImg);
		$(".info-tab table").html(infoMes);
		$(".info-tab").css("background",el.bg);
	}
	//商品评论
	function getComment(el,pagenum,num){
		if($(".pro-comment").html()){
			$(".pro-comment").remove();
		}
		if($(".pro-quest").html()){
			$("<div class='pro-comment'><h3><span>商品评论</span></h3></div>").insertBefore(".pro-quest");
		}
		else{
			$("<div class='pro-comment'><h3><span>商品评论</span></h3></div>").appendTo(".info-introduce");
		}
		if(!el.comment){
			$(".pro-comment").append("<p>暂无评论</p>")
		}
		else{
			var commentStr = "";
			var replay = "";
			$(".pro-comment").append("<table><thead><tr><th class='col-md-8'>评价心得</th><th class='col-md-2'>顾客满意度</th><th class='col-md-2'>评论者</th></tr></thead></table>")
			for(var i =num*pagenum ; i<Math.min(el.comment.length,num*(pagenum+1)) ; i++){
				if(el.comment[i].reply){
					replay = "<p>客服回答:<strong>"+el.comment[i].reply+"</strong><span>"+el.comment[i].replaytime+"</span></p>";
				}
				commentStr += "<tr>"+
							"<td><span>"+el.comment[i].commentStr+"</span><span class='com-time'>"+el.comment[i].time+"</span>"+replay+"</td>"+
							"<td><span class='pro-star'>"+el.comment[i].star+"</span></td>"+
							"<td>"+el.comment[i].commenter.substring(0,3)+"****</td>"+
						"</tr>";
			}
			$(".pro-comment table").append(commentStr);
			
			$(".pro-comment .pro-star").css({
				"background-position": 15*(parseInt($(this).html())-5)+"px 0px"
			})
			var page = "";
			$(".pro-comment").append("<ul class='page right'></ul>")
			for(var i =0 ; i < Math.ceil(el.comment.length/num);i++){
				page+= "<li><a href='javascript:;'>"+(i+1)+"</a></li>";
			}
			$(".page").html(page);
			$(".page li").eq(pagenum).find("a").addClass("active");
			$('.page li').click(function(){
				getComment(el,$(this).index(),5);
			});
			
		}
	}
	//商品问答
	function getQuest(el){
		var question = "";
		if($(".pro-quest").html()){
			$(".pro-quest").remove();
		}
		$("<div class='pro-quest'><h3><span>商品问答</span></h3><ul class='quest-list p0'></ul></div>").appendTo(".info-introduce");
		if(el.question){
			$.each(el.question,function(index,value){
				question += "<li>"+
							"<p>"+value.user.substring(0,3)+"**** : "+value.quest+"</p>"+
							"<p>客服回答：<span>"+value.answer+"</span></p>"+
						"</li>";
			});
		}
		question += "<h4>我要提问</h4><textarea class='quest-area' placeholder='请输入您的评论内容！'></textarea><p>字数限制为5-200个</p><input type='button' class='quest-btn' value='提交'/>";
		$(".quest-list").html(question);
		$(".quest-list").on("click",".quest-btn",function(){
			if($(".quest-area").val().length>200 || $(".quest-area").val().length<5){
				var count =0;
				var time = null;
				$(this).prev().html("字数不够或已超出");
				$(this).prev().css("color","rgb(255, 102, 0)");
				time=setInterval(function(){
					if(count==3){
						clearInterval(time);
					}
					$(".quest-area").addClass("red");
					setTimeout(function(){
						$(".quest-area").removeClass("red");
					},150)
					count++;
				},300);
			}
			else{
				$(this).prev().html("字数限制为5-200个");
				$(this).prev().css("color","#888");
				if(user==""){
					$(".login-mask").show();
					$(".login-mes").animate({
						top: height-$(".login-mes").height()/2
					})
				}
				else{
					if(localStorage.getItem("myQuest"+user)){
						var questObj = JSON.parse(localStorage.getItem("myQuest"+user));
						if(questObj[pid]){
							var questStr = questObj[pid]+"#";
						}
					}
					else{
						var questObj = {};
						var questStr ="";
					}
					$(".sub-mask").show();
					$(".sub-mes").animate({
						top: height-$(".sub-mes").height()/2
					});
					var d = new Date();
					questObj[pid] = questStr+ $(".quest-area").val()+" [ "+d.toLocaleString()+"]";
					var questToStr = JSON.stringify(questObj);
					localStorage.setItem("myQuest"+user,questToStr);
				}
			}
		});
	}
		
	//相关商品
	function relate(data,el){
		var relate = "<h2>相关商品</h2>";
		var num = 0;
		$.each(data, function(index,value) {
			if(value.brand == el.brand && value.pid!=pid && (!value.tel)){
				if(num<5){
					relate += "<li><a href='info.html?"+value.pid+"'>"+
							"<p><img src='"+value.showimg+"'></p>"+
							"<h3>"+value.title+"</h3></a>"+
							"<strong>￥"+value.price+"</strong>"+
							"<span class='addCar index-bg' pid='"+value.pid+"'></span>"+
							"</li>";
					num++;
				}
			}
		});
		$(".relate-list").html(relate);
	}
	//历史记录
	function getHis(data){
		var hisStr = "<h2>历史记录</h2>";
		for(var i = 0; i < Math.min(his.length,5);i++){
			$.each(data, function(index,value){
				if(his[i]==value.pid && his[i]!= pid && (!value.tel)){
					hisStr += "<li><a href='info.html?"+value.pid+"'>"+
							"<p><img src='"+value.showimg+"'></p>"+
							"<h3>"+value.title+"</h3></a>"+
							"<strong>￥"+value.price+"</strong>"+
							"<span class='addCar index-bg' pid='"+value.pid+"'></span>"+
						"</li>";
				}
			});
		}
		$(".history-list").html(hisStr);
	}
});