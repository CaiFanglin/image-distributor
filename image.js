var images = [
	{img:"1-1",des:"1-1",caption:"黄昏"},
	{img:"1-3",des:"1-3",caption:"山河湖海"},
	{img:"1-4",des:"1-4",caption:"图片列表"},
	{img:"1-5",des:"1-5",caption:"稻草"},
	{img:"2-3",des:"2-3",caption:"车子1"},
	{img:"2-4",des:"2-4",caption:"车子2"},
	{img:"2-5",des:"2-5",caption:"车子3"},
	{img:"2-6",des:"2-6",caption:"车子4"},
	{img:"3-1",des:"3-1",caption:"花朵"},
	{img:"3-2",des:"3-2",caption:"apple"},
	{img:"3-3",des:"3-3",caption:"水流"},
	{img:"3-4",des:"3-4",caption:"发芽"},
	{img:"3-5",des:"3-5",caption:"沙漠与海"},
];

function g(selector){
	var method = selector.substr(0,1) =="." ? 'getElementsByClassName' :'getElementById';
	return document[method](selector.substr(1));  
}

function random(range){
	var max = Math.max(range[0],range[1]);
	var min = Math.min(range[0],range[1]);
	var diff = max - min;
	var number = Math.ceil(Math.random() * diff+min);
	return number;
}

var data = images;
function addPhotots(){
	var template = g('#wrap').innerHTML;
	var html =[];
	var nav = [];

	for(s in data){
		var _html = template.replace('{{index}}',s).replace('{{img}}',data[s].img).replace('{{caption}}',data[s].caption).replace('{{des}}',data[s].des);
		html.push(_html);
		nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" class="i">&nbsp;</span>');
	}
	html.push('<div class="navControl">'+nav.join('')+'</nav>');
	g("#wrap").innerHTML = html.join('');
	rsort(random([0,data.length-1]));
}
addPhotots();

function rsort(n){
	var _photo = g('.photo');
	var photos = [];
	for(var s = 0;s<_photo.length;s++){
		_photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ');

		_photo[s].className += " photo_front";
		_photo[s].style['transform'] = _photo[s].style['-webkit-transform'] = "rotate(360deg) scale(0.7)";
		_photo[s].style['z-index'] = 2;
		photos.push(_photo[s]);
	}

	var photo_center = g('#photo_'+n);
	photo_center.className +=' photo_center';
	
	photo_center = photos.splice(n,1)[0];

	var photos_left = photos.splice(0,Math.ceil(photos.length / 2));
	var photos_right = photos;

	var radius = 250;
	var avd_left = 180 / photos_left.length;
	var ahd_left = avd_left * Math.PI / 180;
	
	/**
	* 实现div的环形围绕有2种方法
	* 1.translate（Math.ceil(-Math.sin(弧度)*半径)，Math.ceil(-Math.cos(弧度)*半径)）
	* 2.left = Math.ceil(-Math.sin(弧度)*半径) + initLeft；
	*    top = Math.ceil(-Math.cos(弧度)*半径) + initLeft；
	*/
	for(var a in photos_left){
		var photo = photos_left[a];
		var x = Math.ceil(-Math.sin(ahd_left*(a))*radius),
        	y = Math.ceil(-Math.cos(ahd_left*(a))*radius);
		photo.style['transform'] = photo.style['-webkit-transform'] = 'translate('+x+'px,'+y+'px) rotate('+random([0,-45])+'deg) scale(0.5)';
		photo.style['z-index'] = 1;//解决更换过程中出现的层叠问题
	 }

	var avd_right = 180 / photos_right.length;
	var ahd_right = avd_right * Math.PI / 180;
	for(var b in photos_right){
		var photo = photos_right[b];
		var x = Math.ceil(Math.sin(ahd_right*(b))*radius),
        	y = Math.ceil(Math.cos(ahd_right*(b))*radius);
		photo.style['transform'] = photo.style['-webkit-transform'] = 'translate('+x+'px,'+y+'px) rotate('+random([45,0])+'deg) scale(0.5)';
		photo.style['z-index'] = 1;
	}
	var navs = g(".i");
	for(var s=0;s<navs.length;s++){
		navs[s].className = navs[s].className.replace(/\s*i_current\s*/," ");
		navs[s].className = navs[s].className.replace(/\s*i_back\s*/," ");
	}
	g("#nav_"+n).className +=" i_current ";
}

function turn(elem){
	var cls = elem.className;
	var n = elem.id.split("_")[1];
	if(!/photo_center/.test(cls)){
		return rsort(n);
	}
	if(/photo_front/.test(cls)){
		cls = cls.replace(/photo_front/,'photo_back');
	    g("#nav_"+n).className +=" i_back ";
	}else{
		cls = cls.replace(/photo_back/,'photo_front');
	    g("#nav_"+n).className = g("#nav_"+n).className.replace(/\s*i_back\s*/,' ');
	}
	return elem.className = cls;
}

