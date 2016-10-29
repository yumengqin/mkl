$(function(){
	//设置样式
	console.log(window.location.pathname)
	$(".login-main > h3 > a").eq(1).css("float","right");
	$(".login-main p a").eq(0).css({
		"background-position": "-45px -113px"
	});
	$(".login-main p a").eq(1).css({
		"background-position": "-55px -170px"
	});
	
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
	}
	else{
		var total =parseInt(sessionStorage.getItem("total")) || 0;
		//购物车cookie
		if(sessionStorage.getItem("cart")){
			var obj = JSON.parse(sessionStorage.getItem("cart"));
		}
		else{
			var obj = {};
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
	var timer = setInterval(rem, 100);
	function rem(){
		var userName = $(".userName").val();
		if(userName){
			if(objUser[userName]){
				var as = objUser[userName].split("#");
				$.each(as,function(index, el) {
					if(el=="rember=true"){
						$(".pw").val(as[0].split("=")[1]);
						$(".pwA").val(as[0].split("=")[1]);
					}
				});
			}
		}
	}
	$(".userName").blur(function(){
		testUser($(this).val(),$(this));
	});
	
	function testUser(str,e){
		if(!str){
			$(".error_mes").html("请填写手机号");
			e.parent().addClass('has-error');
			return false;
		}
		else if(!objUser[str]){
			e.parent().addClass('has-error');
			$(".error_mes").html("对不起，该用户不存在");
			return false;
		}
		else{
			$(".error_mes").html("");
			e.parent().removeClass('has-error');
			e.parent().toggleClass("has-success");
			return true;
		}
	}
	$(".pw").blur(function(){
		testPw($(this).val(),$(this));
	});
	function testPw(str,e){
		if(!str){
			$(".error_mes").html("请填写密码");
			e.parent().addClass('has-error');
			return false;
		}
		else if(str != objUser[$(".userName").val()].split("#")[0].split("=")[1]){
			$(".error_mes").html("对不起，密码与用户名不符");
			return false;
		}
		else{
			$(".error_mes").html("");
			e.parent().removeClass('has-error');
			e.parent().toggleClass("has-success");
			return true;
		}
	}
	$(".pwA").blur(function(){
		testPwa($(this).val(),$(this));
	});
	function testPwa(str,e){
		if(!str){
			$(".error_mes").html("请填写确认密码");
			e.parent().addClass('has-error');
			return false;
		}
		else if($(".pw").val() != str){
			console.log($(".pw").val(),$(".pwA").val());
			e.parent().addClass('has-error');
			$(".error_mes").html("对不起,两次密码不一致");
			return false;
		}
		else{
			$(".error_mes").html("");
			e.parent().removeClass('has-error');
			e.parent().toggleClass("has-success");
			return true;
		}
	}
	$(document).click(function(){
		$(".user-list").hide();
	})
	$(".user-list").on("click","a",function(){
		$(".userName").val($(this).html());
		$(".user-list").hide();
		testUser($(".userName").val(),$(".userName"));
	});
	$(".userName").keyup(function(){
		var flag = false;
		$(".user-list").html("");
		console.log(objUser)
		$.each(objUser,function(index,value){
			var re = new RegExp($(".userName").val(),"g");
			if(re.test(index)){
				flag = true;
				$(".user-list").append("<li><a href='javascript:;'>"+index+"</a></li>");
			}
		});
		if(flag){
			$(".user-list").show();
		}
		console.log($(this).val());
	})
	$(".sure").click(function(event) {
		if(testUser($(".userName").val(),$(".userName"))){
			if(testPw($(".pw").val(),$(".pw"))){
				if(testPwa($(".pwA").val(),$(".pwA"))){
					if($("input[type='checkbox']").prop("checked")){
						if(objUser[$(".userName").val()].search("rember")==-1){
							objUser[$(".userName").val()] += "#rember=true";
						}
						else{
							var s = objUser[$(".userName").val()];
							var as = s.split("#");
							$.each(as,function(index, el) {
								if(el=="rember=false"){
									el = "rember=true";
								}
								as[index]=el;
							});
							objUser[$(".userName").val()]=as.join("#");
						}
//						$.cookie("now",$(".userName").val(),{path:"/"});
					}
					else{
						if(objUser[$(".userName").val()].search("true") != -1){
							var s = obj[$(".userName").val()];
							var as = s.split("#");
							$.each(as,function(index, el) {
								if(el=="rember=true"){
									el = "rember=false";
								}
								as[index]=el;
							});
							objUser[$(".userName").val()]=as.join("#");
						}
					}
					if(user == ""){
						if(localStorage.getItem("cart"+$(".userName").val())){
							total = parseInt(sessionStorage.getItem("total")) || 0;
							//购物车cookie
							if(sessionStorage.getItem("cart")){
								obj = JSON.parse(sessionStorage.getItem("cart"));
							}
							var lcart = JSON.parse(localStorage.getItem("cart"+$(".userName").val()));
							$.each(obj,function(index,value){
								var flag = true;
								for(attr in lcart){
									if(attr == index){
										//console.log(attr,index)
										//console.log(parseInt(lcart[attr]),parseInt(obj[index]));
										lcart[attr] = parseInt(lcart[attr])+parseInt(obj[index]);
										flag = false;
									}
								}
								//console.log(flag)
								if(flag){
									lcart[index] = value;
									//console.log(lcart[index])
								}
							});
						}
						else{
							var lcart = {};
							$.each(obj,function(index,value){
								lcart[index] = value;
							});
						}
						var ltotal = parseInt(localStorage.getItem("total"+$(".userName").val())) || 0;
						var objToStr = JSON.stringify(lcart);
						console.log(total,ltotal)
						localStorage.setItem("cart"+$(".userName").val(),objToStr);
						localStorage.setItem("total"+$(".userName").val(),total+ltotal);
						sessionStorage.removeItem("cart");
						sessionStorage.removeItem("total");
					}
					var objToStr = JSON.stringify(objUser);
					sessionStorage.setItem("pre",$(".userName").val());
					sessionStorage.setItem("now",$(".userName").val());
					localStorage.setItem("user",objToStr);
					if(window.location.pathname == "/mkl/html/login.html"){
						window.location = "../index.html";
					}
					else{
						window.location.reload();
					}
				}
			}
		}
		return false;
	});
});
