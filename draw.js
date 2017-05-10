function recurs(context, arr, position, n, x0, y0, x1, y1, line){
	if (n==0){
		if(line==null){
			context.fillRect(x1,y1, 1,1);
		}else{
			context.moveTo(x0,y0);
			context.lineTo(x1,y1);
		}
		return position;
	}else{
		if (!position[n]) position[n]=0;
		var xx=Math.cos(arr[position[n]])*((x1-x0)*Math.cos(arr[position[n]])-(y1-y0)*Math.sin(arr[position[n]]))+x0;
		var yy=Math.cos(arr[position[n]])*((x1-x0)*Math.sin(arr[position[n]])+(y1-y0)*Math.cos(arr[position[n]]))+y0;
		position[n]++;
		if (position[n]==arr.length) position[n]=0;
		position=recurs(context, arr, position, n-1, x0, y0, xx, yy, line);
		position=recurs(context, arr, position, n-1, xx, yy, x1, y1, line);
		return position;
	}
};
function draw(context, arr, position, n, x0, y0, x1, y1, line){
	var arr2=[]
	for(var i=0; i<arr.length; i++){
		arr2[i]=arr[i]*Math.PI/180;
	}
	recurs(context, arr2, position, n, x0, y0, x1, y1, line)
};