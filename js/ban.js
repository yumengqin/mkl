$(function(){
	var bantxt = "";
	var rightbtn = "";
	var showIndex = 0;
	var preIndex = 0;
	var flag = true;
	var num = 0;
	var h = $(window).height();
	var id = "01";
	$("a").mouseout(function(){
		$(this).css("background","none");
	})
	getBan("01");
	$(".nav li").eq(0).click(function(){
		id = "01";
		getBan(id);
		$(this).find("a").addClass("this1");
		$(".nav li").eq(1).find("a").removeClass("this2");
	});
	$(".nav li").eq(1).click(function(){
		id = "02";
		rose(id);
		$(this).find("a").addClass("this2");
		$(".nav li").eq(0).find("a").removeClass("this1")
	});
	$(document).on("mousewheel DOMMouseScroll",function(ev){
		var ev = ev || window.event;
		console.log(flag);
		if(flag){
			flag = false;
			var delta = (ev.originalEvent.wheelDelta && (ev.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                (ev.originalEvent.detail && (ev.originalEvent.detail > 0 ? -1 : 1));
			console.log(delta);
			if (delta < 0){
				//小于0表示向下滑
				if(showIndex != num-1){
					showIndex ++;
					if($(".ban-item").eq(showIndex-1).has("centent")){
						$(".ban-item").eq(showIndex-1).find(".centent").animate({
							top: "140%"
						});
					}
					if(id == "01"){
						baSlip(showIndex)
					}
					else{
						baZindex(showIndex);
					}
				}else{
					flag =true;
				}
				
			}
			else{
				if(showIndex!=0){
					showIndex --;
					if($(".ban-item").eq(showIndex).find(".ban_center").html()){
						$(".ban-item").eq(showIndex).find(".ban_center").animate({
							top: "75%"
						},700);
					}
					else if($(".ban-item").eq(showIndex).find(".ban_left").html()){
						console.log(123)
						$(".ban-item").eq(showIndex).find(".ban_left").animate({
							top: "50%"
						},700);
					}
					else if($(".ban-item").eq(showIndex).find(".ban_right").html()){
						$(".ban-item").eq(showIndex).find(".ban_right").animate({
							top: "50%"
						},700);
					}
					if(id == "01"){
						baSlip(showIndex)
					}
					else{
						baZindex(showIndex);
					}
				}
				else{
					flag =true;
				}
			}
			$(".right-btn li").removeClass("active");
			$(".right-btn li").eq(showIndex).addClass("active");
		}
		return false;
	});
	$(".right-btn").on("click","li",function(){
		showIndex = $(this).index();
		$(".right-btn li").removeClass("active");
		$(".right-btn li").eq(showIndex).addClass("active");
		baSlip(showIndex);
	});
	$(".up-img").click(function(){
		if(showIndex != num-1){
			showIndex ++;
		}
		if($(".ban-item").eq(showIndex-1).has("centent")){
			$(".ban-item").eq(showIndex-1).find(".centent").animate({
				top: "140%"
			});
		}
		if(id == "01"){
			baSlip(showIndex)
		}
		else{
			baZindex(showIndex);
		}
	});
	$(".up-img").css("cursor","pointer");
	function baSlip(index){
		if(index !=0 ){
			$(".shubiao").hide();
		}
		else{
			$(".shubiao").show();
		}
		$(".ban-list").stop().animate({
			"margin-top": -(h*index)+"px"
		},600,function(){flag = true;});
	}
	function baZindex(index){
		$(".font").each(function(){
			var dir = $(this).attr("dir");
			$(this).css(dir,"-50%");
		});
		if(index !=0 ){
			$(".shubiao").hide();
		}
		else{
			$(".shubiao").show();
		}
		$(".ban-list .rose").eq(index).stop().animate({
			height:"100%"
		},500,function(){
			flag = true;
		});
		if(preIndex != showIndex && preIndex < showIndex){
			$(".ban-list .rose").eq(preIndex).stop().animate({
				height: "0"
			},500);
		}
		if(showIndex == 0){
			setTimeout(function(){
				$(".font_0").stop().animate({
					right: "17%"
				},600);
			},200);
		}
		else if(showIndex==2 || showIndex==6 || showIndex==10 || showIndex==14){
			setTimeout(function(){
				$(".font_"+showIndex+"").stop().animate({
					left: "15%"
				},600);
			},200);
		}
		else if(showIndex==4 || showIndex == 8 || showIndex ==12 || showIndex ==16){
			setTimeout(function(){
				$(".font_"+showIndex+"").stop().animate({
					right: "17%"
				},600);
			},200);
		}
		$(".quan_1").stop().animate({"margin-top":showIndex*20+"px"});
		$(".quan_2").stop().animate({"margin-left":showIndex*20+"px"});
		$(".quan_3").stop().animate({"margin-left":-showIndex*20+"px"});
		$(".quan_4").stop().animate({"margin-top":-showIndex*10+"px"});
		$(".quan_5").stop().animate({"margin-bottom":showIndex*20+"px"});
		preIndex = showIndex;
	}
	function getBan(id){
		bantxt = "";
		showIndex = 0
		$.get("../ban.json",function(data){
			$.each(data.result, function(index,value) {
				if(value.id == id){
					num = value.img.length; 
					$.each(value.img, function(index,value) {
						bantxt += "<div class='ban-item' style='background:url("+value.bg+") no-repeat center;background-size: cover;'>"+
						            "<div class='centent ban_"+value.pos+"'><img src='"+value.img+"'>";
						if(value.imgtxt){
							bantxt += "<div class='zhankaibox zhankai_"+value.pos+"'><div><span can='true'><i></i></span>";
							$.each(value.imgtxt, function(index,value) {
								bantxt += "<p>"+value+"</p>";
							});
							bantxt += "</div></div></div>"
						}
						bantxt += "</div></div>";
					});
					for(var i =0 ;i < value.img.length ; i++){
						rightbtn += "<li><a href='javascript'></a></li>";
					}
				}
			});
			$(".right-btn").html(rightbtn);
			$(".right-btn li").eq(showIndex).addClass("active");
			$(".ban-list").html(bantxt);
			$(".zhankai_left span").click(function(){
				if($(this).attr("can")=="true"){
					$(this).parent().animate({
						"left":0
					})
					$(this).attr("can","false");
				}
				else{
					$(this).parent().animate({
						"left":"-480px"
					})
					$(this).attr("can","true");
				}
			});
			$(".zhankai_right span").click(function(){
				if($(this).attr("can")=="true"){
					$(this).parent().animate({
						"left":"70px"
					})
					$(this).attr("can","false");
				}
				else{
					$(this).parent().animate({
						"left":"550px"
					})
					$(this).attr("can","true");
				}
			});
		});
	}

	function rose(id){
		bantxt = "";
		showIndex = 0
		$(".ban-header").css("background","none");
		$(".ban-list").css({
			/*"background":"url(../images/bg/pic-h-01.jpg) no-repeat center top",
			"background-size":"cover"*/
		});
		$(".right-btn").html("");
		var z = 100;
		$.get("../ban.json",function(data){
			$.each(data.result,function(index,value){
				console.log(value.id == id)
				if(value.id == id){
					num = value.img.length; 
					console.log(value.logo)
					$(".ban-logo a img").attr("src",value.logo);
					$.each(value.nav, function(index,value) {
						$(".nav li").eq(index).find("img").attr("src",value);
					});
					$.each(value.img,function(index,value){
						z--;
						bantxt += "<div class='rose' style='z-index:"+z+";background:url("+value.bg+") no-repeat center top;'>";
						if(value.txt){
							bantxt += "<div class='font font_"+index+"' dir='"+value.dir+"'><img src='"+value.txt+"'></div></div>";
						}
						else{
							bantxt += "</div>";
						}
					});
					for(var i =1 ; i <= 5 ; i++){
						bantxt += "<div class='quan_"+i+"'><img src='../images/img/quan-0"+i+".png'></div>"
					}
					$(".ban-list").html(bantxt);
					$(".ban-list").find(".rose").eq(0).css("height","0");
					baZindex(showIndex);
				}
			});
		});
	}
})
