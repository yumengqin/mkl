$(function(){
	
	var tid = window.location.search.replace("?","");
	var time = null;
	
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
	getTxt();
	function getTxt(){
		$.get("../title.json",function(data){
			var txt = "";
			var titlist = "";
			var count = 0;
			var data = data.result;
			$.each(data,function(index,value){
				if(value.tid == tid){
					$(".title-tit").html(value.title);
					$(".title-mes").html(value.time);
					$(".daoyu").html(value.daoyu);
					$(".title-left").html("<dl><dt><img src='"+value.leftImg+"'/></dt><dd>"+value.lefttxt+"</dd></dl>");
					if(value.color){
						$(".title-left dd").css("color",value.color);
					}
					$.each(value.titleImg,function(index,value){
						if(value.tit){
							txt += "<strong>"+value.tit+"</strong>";
						}
						if(value.img){
							txt += "<p class='txt_c'><img src='"+value.img+"'/></p>";
						}
						if(value.txt){
							txt += "<p>"+value.txt+"</p>";
						}
						if(value.imgtxt){
							txt += "<p class='imgtxt'>"+value.imgtxt+"</p>";
						}
					});
					$(".title-img").html(txt);
			
					$("img").load(function(){
				        $(".title-left").css("height",$(".title-right").height()+"px");
								
					})
				}
			
				if(value.id != tid){
					count++;
					titlist += "<li>"+
									"<a href='title.html?'"+value.tid+">"+
										"<img src='"+value.show+"'>"+
										"<p>"+value.title+"</p>"+
									"</a>"+
								"</li>"
				}
				$(".tit-list ul").css("width",(200+55)*count+"px");
				$(".tit-list ul").html(titlist);
			});
		});
	}
	setcousle();
	function setcousle(){
		time = setInterval(function(){
			$(".tit-list ul").stop().animate({
				"margin-left":"-255px"
			},function(){
				$(".tit-list ul li").eq(0).appendTo(".tit-list ul");
				$(".tit-list ul").css("margin-left","0");
			});
		},1000);
	}
	$(".tit-list ul li").mouseover(function(){
		clearInterval(time);
	})
	$(".title-btn").mouseover(function(){
		clearInterval(time);
	});
	$(".title-btn").mouseout(function(){
		setcousle();
	});
	$(".pre-btn").click(function(){
		clearTimeout();
		$(".tit-list ul").css("margin-left","-255px");
		$(".tit-list ul li").last().prependTo(".tit-list ul");
		setTimeout(function(){
			$(".tit-list ul").stop().animate({
				"margin-left":0
			})
		},0)
	});
	$(".next-btn").click(function(){
		clearTimeout();
		$(".tit-list ul").stop().animate({
				"margin-left":"-255px"
			},function(){
				$(".tit-list ul li").eq(0).appendTo(".tit-list ul");
				$(".tit-list ul").css("margin-left","0");
		});
	})
});
