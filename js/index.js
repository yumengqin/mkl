$(function (){
	var height = $(window).height()/2;
	
	$(".mask-adv").show();
	$(".adv-mes").css("top",height-$(".adv-mes").height()/2+"px");
	$(".adv-close").click(function(){
		$(".mask-adv").hide()
	});
	var user = "";
	if(sessionStorage.getItem("now")){
		user = sessionStorage.getItem("now");
		var total =localStorage.getItem("total"+user) || 0;
		if(localStorage.getItem("cart"+user)){
			var obj = JSON.parse(localStorage.getItem("cart"+user));
		}
		else{
			var obj = {};
		}
	}
	else{
		var total =sessionStorage.getItem("total") || 0;
		if(sessionStorage.getItem("cart"+user)){
			var obj = JSON.parse(sessionStorage.getItem("cart"));
		}
		else{
			var obj = {};
		}
	}
	//点击我的账户
	$(".h_my").click(function(){
		if(user){
			window.location = "html/my.html";
		}
		else{
			window.location = "html/login.html";
		}
	});
	
	//点击搜索
	$(".sear_box").find("button").click(function(){
		$(this).attr("placeholder","热门搜索：洁面 控油 祛痘");
		window.location = "html/prolist.html?"+$(".sear_box").find("input").val();
	});
	
	//点击退出
	$(".h_out").click(function(){
		$.cookie("now","",{expires:-1,path:"/"});
		window.location = "index.html";
	})
	//效果
	$(".main1").on("mouseover",".main-item:nth-child(1) .main-item-list li a",function(){
		$(this).find(".word-box").css("background","#eeafce");
		$(this).find(".jiao").css("border-left", "14px solid #eeafce");
	});
	$(".main1").on("mouseover",".main-item:nth-child(2) .main-item-list li a",function(){
		$(this).find(".word-box").css("background","#98c86c");
		$(this).find(".jiao").css("border-left", "14px solid #98c86c");
	});
	$(".main1").on("mouseover",".main-item:nth-child(3) .main-item-list li a",function(){
		$(this).find(".word-box").css("background","#8ecedd");
		$(this).find(".jiao").css("border-left", "14px solid #8ecedd");
	});
	
	$(".main1").on("mouseout",".main-item .main-item-list li a",function(){
		$(this).find(".word-box").css("background","#fff");
		$(this).find(".jiao").css("border-left", "14px solid #fff");
	})
	
	//banner效果（轮播）
	
	$.get("banner.json",function(data){
		$.each(data.img,function(index,value){
			$(".banner_list > li").eq(index).attr("bg","url("+value.pic+")");
			$(".banner_list > li >a").eq(index).attr("href","html/ban.html?"+value.id)
		});
	})
	var timer = null;
	var showIndex = 0;
	var preIndex = 0;
	var zIndex = 1;
	createDiv(showIndex);
	carousel();
	$(".banner").hover(function() {
		$(".ban_btn").fadeIn();
		clearInterval(timer);
	}, function() {
		$(".ban_btn").fadeOut();
		carousel();
	});
	$(".btn_list > li").click(function(){
		createDiv($(this).index());
		showIndex = $(this).index();
	});
	$(".btn_right").click(function(){
		if(showIndex==$(".banner_list > li").length-1){
			showIndex = 0;
		}
		else{
			showIndex += 1;
		}
		createDiv(showIndex);
	});
	$(".btn_left").click(function(){
		if(showIndex==0){
			showIndex = $(".banner_list > li").length-1;
		}
		else{
			showIndex -= 1;
		}
		createDiv(showIndex);
	})
	function carousel(){
		timer = setInterval(function(){
			if(showIndex==$(".banner_list > li").length-1){
				showIndex = 0;
			}
			else{
				showIndex++;
			}
			createDiv(showIndex);
		},4000);
	}

	function createDiv(index){
		$(".banner_list > li").eq(index).find("div").remove();
		$(".banner_list > li").eq(index).css({
			zIndex :zIndex
		})
		for(var i = 0 ;i < 10 ;i ++){
			var newDiv = $("<div></div>");
			$(".banner_list > li").eq(index).append(newDiv);
		}
		var c = 0;
		$(".btn_list > li").removeClass('select');
		$(".btn_list > li").eq(index).addClass('select');
		var timer2 = setInterval(function(){
			var url = ""
			$(".banner_list > li").eq(index).find("div").eq(c).css({
				background : $(".banner_list > li").eq(index).attr("bg")+" no-repeat center "+(-(c*35))+"px",
				display:"block"
			});
			$(".banner_list > li").eq(index).find("div").eq(c).addClass('on');
			c++;
			if(c==10){
				clearInterval(timer2);
			}
		},100);
		zIndex++;
	}

	//获取左侧品牌的数据
	$.get('brandlist.json', function(data) {
		var brand = "<div></div>";
		var data = data.result;
		$.each(data,function(index, el) {
			if(el.banner){
				brand += "<li><a href='html/brand.html?"+el.cid+"'>"+el.className+"</a></li><div></div>";
			}
		});
		$(".brandmenu").html(brand);
	});

	//main   ajax()获取
	var str1 = "";
	var str2 = "";
	getdata1();
	getActive();

	$(".main").on("click","li a",function(){
		$(".mask-info").show();
		$(this).next("#info_box").animate({
			width : "99%",
			opacity: 1
		},500,function(){
			$(this).animate({
				height:"587px"
			},500)
		});
		$(this).next("#info_box").find(".form-control-feedback").show();
	});
	$(".main").on("click",".word_close",function(){
		$(this).next("#info_box").find(".form-control-feedback").hide();
		$(".mask-info").fadeOut();
		$(".main #info_box").animate({
			height:"190px"
		},500,function(){
			$(this).animate({
				width: 0,
				opacity: 0
			},500)
		});
	});
	
	//点击加入购物车
	$(".main1").on("click",".add_car",function(ev){
		var This = $(this);
		var have = false;
		var ev = ev||window.event;
		var num = obj[This.parent().attr("id")] || 0;
		ev.cancelBubble = true;
		ev.stopPropagation();
		$.get("proinfo.json",function(data){
			$.each(data.result,function(index,value){
				console.log(This.parent().attr("id"))
				if(value.pid == This.parent().attr("id")){
					have = true;
				}
			});
			if(have){
				total ++;
				obj[This.parent().attr("id")] = ++num;
				var objToStr = JSON.stringify(obj);
				$(".h_carnum").html(total);
				if(user==""){
					sessionStorage.setItem("cart",objToStr);
					sessionStorage.setItem("total",total);
					
				}
				else{
					localStorage.setItem("cart"+user,objToStr);
					localStorage.setItem("total"+user,total);
				}
				$(".mask-car").show();
				$(".mask-mes").animate({
					top: height
				})
			}
			else{
				$(".mask-error").show();
				$(".mask-mes").animate({
					top: height
				})
			}
		});
		return false;
	});
	$(".mask-close").click(function(){
		$(".mask-car").fadeOut(function(){$(".mask-mes").css("top","-200px")});
	});
	$(".aigin").click(function(){
		$(".mask-car").fadeOut(function(){$(".mask-mes").css("top","-200px")});
	});
	function getdata1(){
		$.ajax({
			url: 'proclass.json',
			type: 'GET',
		})
		.done(function(data) {
			var data = data.result;
			for(var i = 0 ; i < data.length; i++){
				str1 = "";
				str2 = "";
				var mainitem = "<div class='main-item col-xs-12 p0'><ul class='main-item-list main-item-list1 pl0 clearfix'></ul><ul class='main-item-list2 p0 clearfix'></ul></div>";
				$(".main1").append(mainitem);
				str1 += "<li class='col-xs-4 p0 wimg'><a href='javascript:;'><img src='"+data[i].classImg+"' alt=''></a></li>";
				str2 += "<li class='col-xs-4 p0 wimg'><a href='javascript:;'><img src='"+data[i].bannerimg+"' alt=''></a></li>";
				getdata2(data[i].cid,i,str1,str2);
			}
		})
	}
	function getdata2(cid,index,str1,str2){
		var str1 = str1;
		var str2 = str2;
		var c1 = 0;
		var c2 = 0;
		var more = "";
		var infoStr = "";
		var imgStr = "";
		$.ajax({
			url: 'indexlist.json',
			type: 'GET',
		})
		.done(function(data) {
			var data = data.result;
			for(var i = 0 ; i < data.length; i++){
				var shiftUrl = "javascript:;";
				var more = "";
				imgStr ="";
				infoStr ="";
				if(data[i].cid==cid){
					if(data[i].more){
						more = "<b>"+data[i].more+"</b>";
						if(data[i].brandCid){
							shiftUrl = "html/brand.html?"+data[i].brandCid;
						}
						else if(data[i].prolist){
							shiftUrl = "html/prolist.html?"+data[i].prolist;
						}
						else{
							shiftUrl = "html/title.html?"+data[i].tid;
						}
					}
					else{
						for(var j =0 ; j < data[i].proInfoimg.length ; j++){
							//console.log(data[i].proInfoimg.length)
							if(data[i].proInfoimg[j]["img"+(j+1)]){
								imgStr += "<li><img src='"+data[i].proInfoimg[j]["img"+(j+1)]+"'></li>";
							}	
						}
						infoStr = "<div id='info_box'>"+
						"<a href='html/info.html?"+data[i].pid+"'>"+
							"<img class='top_img' src='"+data[i].proWimg+"' alt=''>"+
							"<div class='info_word p0'>"+
								"<h2>"+data[i].proTitle+"</h2>"+
								"<p class='word'>"+data[i].proinfo+"</p>"+
								"<p class='look' id='"+data[i].pid+"'><span>查看详情>></span><span class='add_car index-bg'></span></p>"+
								"<ul class='pl0'>"+imgStr+"</ul>"+
							"</div>"+
						"</a>"+
						"<span class='glyphicon glyphicon-remove-circle form-control-feedback'></span>"+
     					"<span class='word_close'></span>"+
					  "</div>";
					}
					if(c1<2){
						str1 += "<li class='col-xs-4 p0'>"+
									"<a href='"+shiftUrl+"'>"+
									    "<div class='col-xs-6 left p0 word-box'>"+
										    "<h2>"+data[i].proTitle+"</h2>"+
										    "<p>"+data[i].proinfo+"</p>"+
										    "<strong>"+data[i].proMoney+"</strong><i>"+data[i].prooldMoney+"</i>"+more+
										    "<span class='jiao'></span>"+
									    "</div>"+
									    "<img class='col-xs-6 left move-left' src='"+data[i].proImg+"' alt=''>"+
									    "</a>"+infoStr+"</li>";
					}
					else{
						if(c2==0){
							str2 += "<ul class='col-xs-4 p0 main-item-list'>"+
										"<li class='col-xs-12 p0'>"+
										"<a href='"+shiftUrl+"'>"+
										"<div class='col-xs-6 left p0 word-box'>"+
											"<h2>"+data[i].proTitle+"</h2>"+
											"<p>"+data[i].proinfo+"</p>"+
											"<strong>"+data[i].proMoney+"</strong><i>"+data[i].prooldMoney+"</i>"+more+
											"<span class='jiao'></span>"+
										"</div><img class='col-xs-6 left move-left' src='"+data[i].proImg+"' alt=''>"+
										"</a>"+infoStr+"</li>";
						}
						else{
							str2 += "<li class='col-xs-12 p0'>"+
										"<a href='"+shiftUrl+"'>"+
										"<div class='col-xs-6 left p0 word-box'>"+
											"<h2>"+data[i].proTitle+"</h2>"+
											"<p>"+data[i].proinfo+"</p>"+
											"<strong>"+data[i].proMoney+"</strong><i>"+data[i].prooldMoney+"</i>"+more+
											"<span class='jiao'></span>"+
										"</div><img class='col-xs-6 left move-left' src='"+data[i].proImg+"' alt=''>"+
										"</a>"+infoStr+"</li></ul>";
						}
						c2 = c2==1?0:c2+1;
					}
					c1++;

				}
			}
			$(".main-item").eq(index).find(".main-item-list1").prepend(str1);
			$(".main-item").eq(index).find(".main-item-list2").prepend(str2);

			var rep1 = $(".main-item").eq(index).find(".main-item-list1");
			var rep2 = $(".main-item").eq(index).find(".main-item-list2");

			if(index==0){
				rep2.find(".wimg").insertAfter(rep2.find("ul:first"));
			}
			else if(index==1){
				rep1.find(".wimg").insertAfter(rep1.find("li:last"));
			}
			else if(index==2){
				rep1.find(".wimg").insertAfter(rep1.find("li:nth-child(2)"));
				rep2.find(".wimg").insertAfter(rep2.find("ul:nth-child(3)"));
			}
		});
	}

	function getActive(){
		var activeS = "";
		$.get('activelist.json', function(data) {
			$.each(data.result, function(index, value) {
				activeS += "<li class='col-xs-6 p0'>"+
							"<a href='html/active.html?"+value.aid+"'>"+
							    "<div class='col-xs-6 left p0'>"+
								    "<h2>"+value.activeTitle+"</h2>"+
									"<p>"+value.activeinfo+"</p>"+
								    "<b>查看全文>></b>"+
									"<span class='jiao'></span>"+
							    "</div>"+
							    "<img class='col-xs-6 left move-left' src='"+value.activeImg+"' alt=''>"+
						    "</a></li>";
			});
			$("<ul id='active-list' class='main-item-list col-xs-12 p0'>"+activeS+"</ul>").appendTo($(".main2"));
		});
	}

});