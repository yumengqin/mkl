$(function () {
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
	}
	$(".h_carnum").html(total);
	
	if(user){
		$(".h_login").parent().next().remove();
		$(".h_login").parent().remove();
		$(".h_register").parent().next().remove();
		$(".h_register").parent().remove();
	}
	else{
		$(".h_out").parent().next().remove();
		$(".h_out").parent().remove();
	}
	//点击我的账户
	$(".h_my").click(function(){
		if(user){
			window.location = "my.html";
		}
		else{
			window.location = "login.html";
		}
	});
	//点击退出
	$(".h_out").click(function(){
		sessionStorage.removeItem("now");
		//console.log($.cookie())
		window.location = "../index.html";
	})

	//搜索框弹出
	$(".h_ser").click(function(){
		$(".sear_box").show();
		$(".sear_box").animate({
			height:"80px"
		});
	});
	//搜索框效果及关闭
	$(".sear_box").hover(function() {
		$(this).find(".form-control-feedback").fadeIn(500);
	}, function() {
		$(this).find(".form-control-feedback").fadeOut(500);
	});
	$(".sear_box .input-group .clo").hover(function() {
		$(this).prev().addClass('hover');
	}, function() {
		$(this).prev().removeClass('hover');
	});
	$(".sear_box .input-group .clo").click(function(){
		$(".sear_box").animate({
			height:0
		},function(){
			$(".sear_box").hide();
		});
	});
	$(".sear_box").find("button").mouseover(function(){
		$(this).css({
			"background":"#d10048",
			"border":"1px solid #d10048"
		});
	});
	$(".sear_box").find("button").mouseout(function(){
		$(this).css({
			"background":"#000",
			"border": "1px solid #000"
		});
	})
	//点击搜索
	
	$(".sear_box").find("input").keyup(function(){
		var val = $(this).val();
		var oScript = document.createElement('script');
		oScript.src = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + val + "&cb=hh1"
		document.body.appendChild(oScript);
		document.body.removeChild(oScript);
	});
	$(".sear_box").find("button").click(function(){
		$(this).attr("placeholder","热门搜索：洁面 控油 祛痘");
		if(window.location.pathname == "/mkl/index.html"){
			window.location = "html/prolist.html?"+$(".sear_box").find("input").val();
		}
		else{
			window.location = "prolist.html?"+$(".sear_box").find("input").val();
		}
		
	});
	//左侧边栏效果
	$(".side_bar").find(".side_bar_ul").find("li").eq(1).mouseover(function() {
		$(".brandmenu").show();
		$(".brandmenu").animate({
			width: "67px",
			height: "100%"
		},200);
	});
	$(".side_bar").find(".side_bar_ul").find("li").eq(1).mouseout(function(){
		setTimeout(function(){
			$(".brandmenu").animate({
				width: "0",
				height: "50%"
			},200);
			$(".brandmenu").hide(100);
		},2000);
	});
	var flag = false;
	//右边栏效果
	$(window).scroll(function(){
		if($(window).scrollTop()>=50){
			$(".back").stop(true).animate({
				opacity: 1
			},800);
		}else if($(window).scrollTop()<50){
			$(".back").stop(true).animate({
				opacity: 0
			},800);
		}

	});

	$(".back").click(function(){
		$('body,html').animate({scrollTop:0},600);
	});

	$(".tel").find("img:first").hover(function() {
		$(this).next("img").show();
		$(this).next("img").animate({
			left : "-220px",
			opacity : 1
		},500);
	}, function() {
		$(this).next("img").animate({
			left : "-300px",
			opacity : 0
		},500,function(){
			$(".tel").find("img:last").css("display","none");
		});
	});
	
	//关闭遮罩层
	
	$(".mask-close").click(function(){
		$(this).parents(".mask").fadeOut();
	});
	
	setCss();
	//设置样式
	function setCss(){
		$(".header_list li:last-child").css("margin-left","13px");
		$(".login-main .input-icon").eq(0).css("background-position","-62px 0px");
		$(".login-main .input-icon").eq(1).css("background-position","-60px -44px");
		$(".login-main .input-icon").eq(2).css("background-position","-60px -44px");
		
		$(".foot-list1 li").eq(1).find("a").css("background-position","0px -106px");
		$(".foot-list1 li").eq(2).find("a").css("background-position","0px -212px");
	}
});
function hh1(data) {
	//alert(data.s[0])
	var html = ''
	var url = "prolist.html?";
	if(window.location.pathname == "/mkl/index.html"){
		url = "html/prolist.html?"
	}
	if (data.s.length > 0) {
		for (var i = 0; i < data.s.length; i++) {
			html += "<li><a href='"+ url + data.s[i] + "' target='_blank'>" + data.s[i] + "</a></li>"
		}
		$(".sear-list").show();
		$(".sear-list").html(html);
	
	}else{
		$(".sear-list").hide();
	}
}