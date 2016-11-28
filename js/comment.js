	var str=location.href.split("?");
	var orderid=location.href.split("?")[1];
	var openid=localStorage.getItem("openid");
	console.log(openid)
	var pilot=[];
	  var score=[];
	  var content=[];
	$.ajax({
  		url:"http://192.168.100.17:8080/UAV/weixin/orderdetail/"+orderid,
		type: "get", 
		dataType:"json",		
		success:function(msg){
			console.log(msg.result);
			var obj=msg.result
			$("#orderCode").html(nonestr(obj.orderCode));
			$("#completeTime").html(nonestr(obj.completeTime));
			$("#orderAddress").html(nonestr(obj.orderAddress));
			$("#orderNum").html(nonenum(obj.orderNum));
			if(obj.pilots){
				var temp=obj.pilots;
				var html="";
				for(var i=0;i<temp.length;i++){
					html+='<div class="singleflymen" user_id="'+temp[i].user_id+'"><div class="grade "><div class="personimg"><img src="'+temp[i].avatar+'" /></div><div class="demo fs"><div>'+temp[i].real_name+'</div><span style="vertical-align: middle;font-size:14px;">评分：</span><span class="score-callback-FlyingMan" data-score="2" style="outline: none;display: inline-block;vertical-align: middle;margin-left:10px;line-height:20px;"></span></div></div><div class="textareaWrap" style="margin-bottom:0px;"><textarea class="taskevaluationInput" type="text" placeholder="这次服务您还满意吗？写下您的意见发给我们，我们将会提供好的服务！（200字以内）"></textarea></div></div>';
					pilot.push(temp[i].user_id);
				}
				$("#pilot").val(pilot);
				$("#allflymen").html(html);
			}
			showstar();
				  $(document).ready(function(){
	  	//飞手的评星
		  $('.score-callback-FlyingMan').raty({
		 path    : '../img',
		 starOff : 'graystar.png',
	    starOn  : 'yellowstar.png',
	    score: function() {
	      return $(this).attr('data-score');
	    },
	    click: function(score, evt) {
			taskscore=score;
			$(this).attr('data-score',taskscore);
	    }
	});
	  })
			
			
		}
  	});
	
	
	
	var orderscore="2";//对销售的评星
	var ordervaluation="";//对销售的评价
	var taskscore="2";//对飞手的评星
	var taskevaluation="";//对飞手的评价
	var userpic=[];//评价照片
	//debugger
  $('#score-callback-SalesMan').raty({//销售的评星
  	 path    : '../img',
  	 starOff : 'graystar.png',
    starOn  : 'yellowstar.png',
    score: function() {
      return $(this).attr('data-score');
    },
    click: function(score, evt) {
    	orderscore=score;
    
    }
  });

function showstar(){
		//飞手的评星
	  $('.score-callback-FlyingMan').raty({
	 path    : '../img',
	 starOff : 'graystar.png',
    starOn  : 'yellowstar.png',
    score: function() {
      return $(this).attr('data-score');
    },
    click: function(score, evt) {
		taskscore=score;
		$(this).attr('data-score',taskscore);
    }
});
}


function changepersonInfo(){
	console.log(score)
	var form = $("form[name=editUserInfo]");  
	debugger
        var options  = {    
        	
           url:"http://192.168.100.17:8080/UAV/weixin/appraise/"+openid+"/"+orderid,    
            type:'post',  
            data: {
            	
                'orderscore': orderscore,
                'ordervaluation': ordervaluation,
                'pilot': pilot,
                'score': score,
                'content': content,
                'userpic':userpic
            },
            success:function(data)    
            {    
            	console.log('------------122-------');
            	console.log(data);             	
            	location.href="hasPayOrder.html";
            }    
        };    
       form.ajaxSubmit(options); 
}  
$("#comment").click(function(){
	   score=[];
	   content=[];
  	$('.score-callback-FlyingMan').each(function(){
  		score.push($(this).attr('data-score'));
  		debugger
  	})
  	$("#score").val(score);
  	$(".taskevaluationInput").each(function(){
  		content.push($(this).val());
  	})
  	
  	$("#content").val(content);
  ordervaluation=$("#ordervaluationInput").val();
  $("#ordervaluation").val(ordervaluation);
  $("#orderscore").val(orderscore);
//userpic=[nonestr($(".addimg").find("img").eq(0).attr("src")),nonestr($(".addimg").find("img").eq(1).attr("src")),nonestr($(".addimg").find("img").eq(2).attr("src"))];
  $("#userpic").val(userpic);
  
changepersonInfo();  

});
 //照相或者从相册选择功能
 var localIds;
 $.ajax({
        url : "./signature.php",
        type : "post",
        dataType : "json", //没有实名认证
        data : {
            url : location.href
        }
     }).done(function(data){//对应success,error对应fail
     	
             wx.config({
                //debug:true,
                appId : data["appId"],
                timestamp : data["timestamp"],
                nonceStr : data["nonceStr"],
                signature : data["signature"],
                jsApiList : [
                    "chooseImage",
                    "uploadImage"
                ]
             });
             wx.ready(function(){
                document.querySelector(".takePhoto").onclick = function(){
                	var len=$(".addimg").find("img").length;
                	if(len<3){
                		wx.chooseImage({
                            count : 1,
                            sourceType : ["album","camera"],
                            success : function(res){
                            	  localIds = res.localIds;
                                
              $("<img src='' style='width: 30%;margin-left: 2%;' />").attr('src',localIds[0]).appendTo($(".addimg"));
            						syncUpload(localIds);

                            	
                            	
								                          
                            }
                        })
                	}else{
                		return;
                	}
                }
    var syncUpload = function(localIds){
				    var localId = localIds.pop();
				    //alert(localIds[0])
				   // $("<img src='' style='width: 30%;height: 60px;margin-left: 2%;' />").attr('src',localIds[0]).appendTo($(".addimg"));
				    wx.uploadImage({
				        localId: localId,
				        isShowProgressTips: 1,
				        success: function (res) {
				            var serverId = res.serverId; // 返回图片的服务器端ID
				            userpic.push(serverId); //将图片的servesID传给后台
				            console.log(userpic)
				             //alert(serverId)
				            //其他对serverId做处理的代码
//				            if(localIds.length > 0){
//				                syncUpload(localIds);
//				            }
				        }
				    });
				};

             })
    });	