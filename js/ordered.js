
//
//$(".comfirm").click(function(){
//	$(".form-inline").hide();
//	var province=$("#province1").val();
//	var city=$("#city1").val();
//	var area=$("#district1").val();
//	$(".address").val(province+" "+city+" "+area+" ");
//	
//	var serviceType="";
//	$(".type").each(function(){
//		if($(this).hasClass("checked")){
//			serviceType+=$(this).html()+" "
//			
//		}
//	})
//	$(".serviceType").html(serviceType)
//	$(".checkServiceType").hide();
//	
//})

var servs_id;			
//直接点击个人中心进来
var str=location.href;
var id="";
var address="";
var telephone="";
var username="";
var authcode="";
var servicetype="";
var islianpian="";
var area="";
var remark="";
var state="否";
id=localStorage.getItem("openid");
if(!id){
	var code=location.href.split("=")[1].split("&")[0];	
	$.ajax({
		url:"http://192.168.100.17:8080/UAV/weixin/register",
		type: "post", 
		data:{"code":code},
		dataType:"json",
		//jsonp:"callback",
		success: function(msg){
			console.log(msg)
			id=msg.result.openid;
			localStorage.setItem("openid",id);
			console.log(msg);
		}, //操作成功后的操作！msg是后台传过来的值
		error:function(msg){
			console.log(msg);
		}
	}); 
}

//$(".address").blur(function(){
//	check();
//})
$(".telephone").blur(function(){
	var reg=/^1[3|4|5|7|8]\d{9}$/;
	if(reg.test($(this).val())){
		$(".tip2").hide();
		$(".getCode").css("background-color","#15c5ff").removeAttr("disabled");
	}else{
		$(".tip2").show();
		$(".getCode").css("background-color","#999").attr("disabled", "disabled");
	}
	
	check();
})
$(".contact").blur(function(){
	
	if(!$(".contact ").val()){
		$(".tip3").show();
	}else{
		$(".tip3").hide();
	}
	check();
})



var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

function sendMessage() {
  　curCount = count;
 window.clearInterval(InterValObj);
　　//设置button效果，开始计时
     $(".getCode").css("background-color","#999").attr("disabled", "disabled");
     $(".getCode").html("输入验证码(" + curCount + ")");
     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
}
//timer处理函数
function SetRemainTime() {
    if (curCount==0) {                
        window.clearInterval(InterValObj);//停止计时器
        $(".getCode").css("background-color","#15c5ff").removeAttr("disabled");//启用按钮
        $(".getCode").html("重新发送验证码");
    }
    else {
        curCount--;
        $(".getCode").html("输入验证码(" + curCount + ")");
    }
}

//获取短信验证码
$(".getCode").click(function(){
	tel=$(".telephone").val();
	console.log(id);
	if(tel){
		$.ajax({
			type:"get",
			url:"http://192.168.100.17:8080/UAV/weixin/sendsms/"+id+"/"+tel,
			dataType:"json",
			success:function(msg){
//				console.log(msg);
				sendMessage();
			},
			error:function(msg){
				console.log(msg);
			}
		});
	}else{
		alert("请输入正确电话号码")
	}
})

var flag=true;
function codeyz(id,tel,authcode,fn){
	debugger
	$.ajax({
		type:"get",
		url:"http://192.168.100.17:8080/UAV/weixin/validatesms/"+id+"/"+tel+"/"+authcode+"/"+"1",
		dataType:"json",
		success:function(msg){
			var code=msg.code;
			console.log(msg)
			if(code=="000001"){
				$(".yyorderMask").find("p").html(msg.message);
				$(".yyorderMask").fadeIn();
				$(".orderBtn").css("background-color","#999").attr("disabled", "disabled"); 
				$(".getCode").css("background-color","#15c5ff").removeAttr("disabled");
				flag=false;
				return false;
			}else{
				flag=true;
//				check();
				if(typeof fn == "function"){
					fn()
				}
				
			}
		},
		error:function(msg){
//			$(".yyorderMask").find("p").html("请输入正确的验证码");
//			$(".yyorderMask").fadeIn();
			flag=false;
			return false;
		}
	});
}

//失去焦点时验证验证码是否输入正确
$(".checkCode").blur(function(){
	tel=$(".telephone").val();
	authcode=$(".checkCode ").val();
	console.log(id);
	codeyz(id,tel,authcode);
	
})

$(".remark").click(function(){
	$(this).height("60");
}).blur(function(){
	$(this).height("30");
})


function check(){
	address=$(".address").html().replace(/&nbsp;/g,"");
	telephone=$(".telephone").val();
	username=$(".contact ").val();
	authcode=$(".checkCode ").val();
	serviceType=$(".serviceType ").html();
	codeyz(id,telephone,authcode,function(){		
		if(address&&telephone&&username&&authcode&&(serviceType!="请选择服务类型")&&flag){
			$(".orderBtn").css("background-color","#15c5ff").removeAttr("disabled"); 
			
		}else{
			$(".orderBtn").css("background-color","#999").attr("disabled", "disabled"); 
		}
		
	})
}




///*关闭类型选择选项*/
function clocktype() {
	$(".checkServiceType").fadeOut();
	
	$(".typebox").removeClass("distIn").addClass("distOut");
}
/*打开类型选择选项*/
//判断是否有选择服务类型

$(".orderedServide").click(function() {
	$(".checkServiceType").fadeIn();
	$(".typebox").removeClass("distOut").addClass("distIn");
	
});
/*关闭地址选项*/
$("#closeArea").click(function() {
	clocktype();
});
/*关闭类型选择选项*/
$(".checkServiceType, .closeservisType").click(function() {
	clocktype();
	if($(".serviceType").html()=="请选择服务类型"){
		$(".tip4").show();
	}else{
		$(".tip4").hide();
		check();
	}
});
var selectid;
function selecttype(id,type){
	clocktype();
	$(".serviceType").html(type);	
	selectid=id;
	if($(".serviceType").html()=="请选择服务类型"){
		$(".tip4").show();
	}else{
		$(".tip4").hide();
		check();
	}
	//类型选择最终值是type
}





	var HEIGHT = $(window).height();
    $(window).resize(function() {
    	if(HEIGHT==$(window).height()){
    		$('footer.orderedFooter').css('position','fixed');
    	}else{
    		$('footer.orderedFooter').css('position','absolute');
    	}
        
    });




//控制文本域字数
$("textarea").keyup(function(){
	if($(this).val().length>200){
		var str=$(this).val().substring(0,200);
		$(this).val(str)
	}
	
	//文本域最终值是str
})


//点击确定预约，进行预约
$(".orderBtn").click(function(){
	servicetype=selectid;
	var reg=/^\d+(\.\d+)?$/;
	var reg2=/^\s*$/g;
	area=$(".workarea ").val();
	remark=$(".remark ").val();
	authcode=$(".checkCode ").val();
	console.log(id);
	if(!servs_id){
		$(".yyorderMask").find("p").html("当前城市目前没有服务点，无法预约！");
		$(".yyorderMask").fadeIn();
		return
	}
	if(area){
		if(!reg.test(area)){
			$(".yyorderMask").find("p").html("面积只能为数字!");
			$(".yyorderMask").fadeIn();
			return
		}
	}
	codeyz(id,telephone,authcode,function(){
		alert(flag)
		if(servs_id&&(reg.test(area)||reg2.test(area))&&flag){
			
		$.ajax({
			type:"post",
			url:"http://192.168.100.17:8080/UAV/weixin/appointment/"+id,
			dataType:"json",
			data:{
				"openid":id,
				"address":address,
				"telephone":telephone,
				"authcode":authcode,
				"username":username,
				"servicetype":servicetype,
				"islianpian":state,
				"area":area,
				"remark":remark,
				"servsId":servs_id
			},
			success:function(msg){
				console.log(msg);
				if(msg.code=="000000"){
					$(this).css("background-color","#999").attr("disabled", "disabled");
					$(".orderMask").fadeIn();
					
				}else{
					$(".yyorderMask").find("p").html(msg.message);
					$(".yyorderMask").fadeIn();
				}
			},
			error:function(msg){
				console.log(msg);
			}
		});
	}else{
		
	}
	});
	
	
})

$(".OK").click(function(){
	$(".orderMask").fadeOut();
	location.href='personalCenter.html';
})
$(".yyOK").click(function(){
	$(".yyorderMask").fadeOut();
})



//地址跳转
$(".taocan").click(function(){
 location.href='package.html?'+id;
});
$(".personal").click(function(){
 location.href='personalCenter.html?'+id;
});
$(".indexI").click(function(){
 location.href='../index01.html?'+id;
});



