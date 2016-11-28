function nonestr(str){
	if(!str){
		str="";
		return str;
	}else{
		return str;
	}
	
}
function nonenum(str){
	if(!str){
		str=0;
		return str;
	}else{
		return str;
	}
	
}

//订单状态函数
function yyorderState(n){
	if(n==100){
		str="待处理预约"
		return str;
	}
	if(n==200){
		str="待分配销售"
		return str;
	}
	if(n==101){
		str="已取消预约"
		return str;
	}
	if(n==300){
		str="待销售上门"
		return str;
	}
	if(n==301){
		str="已取消预约"
		return str;
	}
	if(n==400){
		str="已完成预约"
		return str;
	}
	
}
//订单状态函数
function ddorderState(n){
	if(n==100){
		str="订单待确认"
		return str;
	}
	if(n==200){
		str="订单待支付"
		return str;
	}
	if(n==201){
		str="订单已取消"
		return str;
	}
	if(n==300){
		str="待分配订单1"
		return str;
	}
	if(n==500){
		str="订单已分配"
		return str;
	}
	if(n==700){
		str="订单作业中"
		return str;
	}
	if(n==800){
		str="订单作业完成"
		return str;
	}
	if(n==101){
		str="订单已取消"
		return str;
	}
	if(n==900){
		str="订单交易完成"
		return str;
	}
	if(n==400){
		str="订单待重新确定时间"
		return str;
	}
	if(n==600){
		str="待分配订单2"
		return str;
	}
}