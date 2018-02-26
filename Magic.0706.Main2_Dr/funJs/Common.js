	var comServerIP='192.168.2.191';
	var comRawWidth=330;
	var comRawHeight=278;
	//通用ajax方法
	function doaja(href,a,headKey,headValue) {
		var result={};
		$.ajax({
			type:a,
			url:'http://'+comServerIP+'/'+href,
			async:false,
			headers:{'Authorization':headValue},
			success:function (data,status,xhr) {
				result={'end':true,'data':data,'status':status,'xhr':xhr};
			},
			error:function (xhr,status,errorThrown) {
				result={'end':false,'xhr':xhr,'status':status,'errorThrown':errorThrown};
			}
		});
		return result;
	}
	//注销
	function loginOut () {
		var ide=$.cookie('ide');
		var auth=$.cookie('Authorization');
		if (ide==1) {
			clearAllCookie();
		} else{
			$.ajax({
				type:'delete',
				url:'http://'+comServerIP+'/Web/Authorization',
				async:false,
				headers:{'Authorization': auth},
				beforeSend:	function(xhr){
					xhr.setRequestHeader('XXX',ide);
				},
				success:function (data,status,xhr) {
					clearAllCookie();
				},
				error:function (xhr,status,errorThrown) {
					console.log(xhr.getAllResponseHeaders());
				}
			});
		}
		location.href='index.html';
	}
	//清除所有cookie
	function clearAllCookie() {  
		var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		var userse=$.cookie('Authorization')?$.cookie('Authorization'):$.cookie('Authorization2');
		var users=userse.split(',');
		var user=users[0];
		if(keys) {
			for(var i = keys.length; i--;){
				if (keys[i]==user||keys[i]==user+'ide') {
					
				} else{
					document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();					
				}
			}
		}
	}
	//加密
	function enCode (user,pass) {
		var c='';
		var b=user;
		var a=pass;
		if (b) {
			if (a) {
				b=b.length;
				for (var i=0;i<a.length;i++) {
					var d=a.charCodeAt(i)+b;
					c=c+d+',';
				}
			}
		}
		return c;
	}
	function unCode (user,pass) {
		var c='';
		var b=user;
		var a=pass;
		if (b) {
			if (a) {
				b=b.length;
				var d=new Array();
				d=a.split(',');
				for (var i=0;i<d.length-1;i++) {
					var e=String.fromCharCode((d[i]-b));
					c+=e;
				}
			}
		}
		return c;
	}
	//gb转utf-8
	function GB2312UTF8() {
	this.Dig2Dec = function(s) {
		var retV = 0;
		if (s.length == 4) {
			for (var i = 0; i < 4; i++) {
				retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
			}
			return retV;
		}
		return -1;
	}
	this.Hex2Utf8 = function(s) {
		var retS = "";
		var tempS = "";
		var ss = "";
		if (s.length == 16) {
			tempS = "1110" + s.substring(0, 4);
			tempS += "10" + s.substring(4, 10);
			tempS += "10" + s.substring(10, 16);
			var sss = "0123456789ABCDEF";
			for (var i = 0; i < 3; i++) {
				retS += "%";
				ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
				retS += sss.charAt(this.Dig2Dec(ss.substring(0, 4)));
				retS += sss.charAt(this.Dig2Dec(ss.substring(4, 8)));
			}
			return retS;
		}
		return "";
	}
	this.Dec2Dig = function(n1) {
		var s = "";
		var n2 = 0;
		for (var i = 0; i < 4; i++) {
			n2 = Math.pow(2, 3 - i);
			if (n1 >= n2) {
				s += '1';
				n1 = n1 - n2;
			}
			else s += '0';
		}
		return s;
	}
	this.Str2Hex = function(s) {
		var c = "";
		var n;
		var ss = "0123456789ABCDEF";
		var digS = "";
		for (var i = 0; i < s.length; i++) {
			c = s.charAt(i);
			n = ss.indexOf(c);
			digS += this.Dec2Dig(eval(n));
		}
		return digS;
	}
	this.Gb2312ToUtf8 = function(s1) {
		var s = escape(s1);
		var sa = s.split("%");
		var retV = "";
		if (sa[0] != "") {
			retV = sa[0];
		}
		for (var i = 1; i < sa.length; i++) {
			if (sa[i].substring(0, 1) == "u") {
				retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1, 5)));
				if (sa[i].length) {
					retV += sa[i].substring(5);
				}
			}
			else {
				retV += unescape("%" + sa[i]);
				if (sa[i].length) {
					retV += sa[i].substring(5);
				}
			}
		}
		console.log(retV);
		return retV;
	}
	this.Utf8ToGb2312 = function(str1) {
		var substr = "";
		var a = "";
		var b = "";
		var c = "";
		var i = -1;
		i = str1.indexOf("%");
		if (i == -1) {
			return str1;
		}
		while (i != -1) {
			if (i < 3) {
				substr = substr + str1.substr(0, i - 1);
				str1 = str1.substr(i + 1, str1.length - i);
				a = str1.substr(0, 2);
				str1 = str1.substr(2, str1.length - 2);
				if (parseInt("0x" + a) & 0x80 == 0) {
					substr = substr + String.fromCharCode(parseInt("0x" + a));
				}
				else if (parseInt("0x" + a) & 0xE0 == 0xC0) { //two byte
					b = str1.substr(1, 2);
					str1 = str1.substr(3, str1.length - 3);
					var widechar = (parseInt("0x" + a) & 0x1F) << 6;
					widechar = widechar | (parseInt("0x" + b) & 0x3F);
					substr = substr + String.fromCharCode(widechar);
				}
				else {
					b = str1.substr(1, 2);
					str1 = str1.substr(3, str1.length - 3);
					c = str1.substr(1, 2);
					str1 = str1.substr(3, str1.length - 3);
					var widechar = (parseInt("0x" + a) & 0x0F) << 12;
					widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
					widechar = widechar | (parseInt("0x" + c) & 0x3F);
					substr = substr + String.fromCharCode(widechar);
				}
			}
			else {
				substr = substr + str1.substring(0, i);
				str1 = str1.substring(i);
			}
			i = str1.indexOf("%");
		}
		return substr + str1;
	}
}