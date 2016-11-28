var id="onBU3s2om5yuOV3-Bkh6cFVniHUY";
/*id=localStorage.getItem("openid");
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
}*/

var InterValObj;
var servs_id;
var count = 60;
var state="否";
var objData={
    tel:false,
    name:false,
    code:false,
    area:false,
    service:false
};

/*选择区县*/
function selectDNew(acode,aname) {
    clockArea();
    expressArea += aname;
    $("#expressArea dl dd").html(expressArea);
     $.ajax({
        url:"http://192.168.100.17:8080/UAV/weixin/getServsIdByAreaCode/"+acode,
        type: "get", 
        dataType:"json",
        success: function(msg){
            console.log(msg);
            if(msg.result){
                servs_id=msg.result.servs_id;
                objData.area=true;
            }else{
                $(".yyorderMask").find("p").html("当前城市目前没有服务点，无法预约！");
                $(".yyorderMask").fadeIn();
                servs_id="";
                objData.area=false;
            }
            verify.orderShow()
            
        }, //操作成功后的操作！msg是后台传过来的值
        error:function(msg){
            console.log(msg);
        }
    });
}


/*关闭省市区选项*/
function clockArea() {
    $("#areaMask").fadeOut();
    $("#areaLayer").removeClass("distIn").addClass("distOut");
    intProvinceNew();
}

$(function() {
    /*打开省市区选项*/
    $("#expressArea").click(function() {
        $("#areaMask").fadeIn();
        $("#areaLayer").removeClass("distOut").addClass("distIn");
    });
    /*关闭省市区选项*/
    $("#areaMask, #closeArea").click(function() {
        clockArea();
    });
});





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
       objData.service=false;
    }else{
        $(".tip4").hide();
        objData.service=true;
    }
    verify.orderShow()

});
var selectid;
function selecttype(id,type){
    clocktype();
    $(".serviceType").html(type);   
    selectid=id;
    if($(".serviceType").html()=="请选择服务类型"){
        $(".tip4").show();
         objData.service=false;
    }else{
        $(".tip4").hide();
        objData.service=true;
    }
    verify.orderShow()
    //类型选择最终值是type
}


var verify={
    phoneInfo:/^1[3|4|5|7|8]\d{9}$/,
    tel:"",
    init:function(){
        //初始化
        this.phone();
        this.name();
        this.getCode();
        this.codeyz();
        this.submit();
    },
    phone:function(){
        //验证电话号码
        var that=this.phoneInfo;
        var own=this;
        $('.telephone').blur(function(){
            if(that.test($(this).val())){
               $(".tip2").hide();
               $(".getCode").css("background-color","#15c5ff").removeAttr("disabled");
               own.tel=$(this).val();
               objData.tel=true;
            }else{
                $(".tip2").show();
                $(".getCode").css("background-color","#999").attr("disabled", "disabled");
                objData.tel=false;
            }
            own.orderShow()
        });
    },
    name:function(){
        //验证联系人是否为空
        var that=this;
        $(".contact").blur(function(){
            if(!$(".contact ").val()){
                $(".tip3").show();
                objData.name=false;
            }else{
                $(".tip3").hide();
                objData.name=true;
            }
            that.orderShow()
        })
    },
    getCode:function(){
        //获取验证码
        var that=this
        $(".getCode").click(function(){
            count=60;
            var tel=that.tel;
            $.ajax({
                type:"get",
                url:"http://192.168.100.17:8080/UAV/weixin/sendsms/"+id+"/"+tel,
                dataType:"json",
                success:function(msg){
                     that.sendMessage();

                },
                error:function(msg){
                    console.log(msg);
                }
            })
        })
    },
    sendMessage:function(){
        //验证码倒计时
        clearInterval(InterValObj);
        $(".getCode").css("background-color","#999").attr("disabled", "disabled");
        $(".getCode").html("输入验证码(" + count + ")");
        var that=this;
        InterValObj=setInterval(function(){
            count--;
            if(count<=0){
                clearInterval(InterValObj);
                $(".getCode").css("background-color","#15c5ff").removeAttr("disabled");//启用按钮
                $(".getCode").html("重新发送验证码");
                that.getCode()
            }else{
                $(".getCode").html("输入验证码(" + count + ")");
            }
        },100)
    },
    codeyz:function(fn){
        //验证验证码是否正确
        var that=this;
        $(".checkCode").blur(function(){
            var authcode=$(this).val();
            var tel=that.tel;
            $.ajax({
                type:"get",
                url:"http://192.168.100.17:8080/UAV/weixin/validatesms/"+id+"/"+tel+"/"+authcode+"/"+"1",
                dataType:"json",
                success:function(msg){
                    var code=msg.code;
                if(code=="000001"){
                    $(".yyorderMask").find("p").html(msg.message);
                    $(".yyorderMask").fadeIn();
                    objData.code=false;
                }else{
                    objData.code=true;
                }
                that.orderShow();
            }
        });
        });
    },
    orderShow:function(){
        console.log(objData)
            if(objData["tel"]&&objData["name"]&&objData["area"]&&objData["service"]&&objData["code"]){
                $(".orderBtn").css("background-color","#15c5ff").removeAttr("disabled"); 
            }else{
                $(".orderBtn").css("background-color","#999").attr("disabled", "disabled"); 
            }
    },

    submit:function(){

            $(".orderBtn").click(function(){
                var reg=/^\d+(\.\d+)?$/;
                var reg2=/^\s*$/g;
                var workarea=$(".workarea ").val();
                var address=$(".address").html().replace(/&nbsp;/g,"");
                var telephone=$(".telephone").val();
                var authcode=$(".checkCode ").val();
                var username=$(".contact ").val();
                var remark=$(".remark ").val();
                var serviceType=$(".serviceType ").html();
                console.log(serviceType)
                if(workarea&&!reg.test(workarea)){
                    $(".yyorderMask").find("p").html("面积只能为数字!");
                    $(".yyorderMask").fadeIn();
                    return
                }
                if(reg.test(workarea)||reg2.test(workarea)){
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
                            "servicetype":selectid,
                            "islianpian":state,
                            "area":workarea,
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
                }
                

            })
    }




}



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




$(".OK").click(function(){
    $(".orderMask").fadeOut();
    location.href='personalCenter.html';
})


$(".yyOK").click(function(){
    $(".yyorderMask").fadeOut();
})

verify.init();




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