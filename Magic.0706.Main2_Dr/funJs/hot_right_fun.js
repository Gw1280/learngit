	//此页面只有病人使用，所以不需要验证ide
	var hotIn=new Array();//地址列表
	var b='0000_5';  //默认调色板
	var itemARRAY=new Array();  //热图对象数组
	var ide=$.cookie('ide');
	//写入canva方法总成,需要参数a为检查ID
	//图片数组，数组长度为热图数量
			function ITEM (ID,ADD,PEL,WIN,VAL,ARR,TOP,BOT) {
				this.ID=ID;
				this.ADD=ADD;	//热图地址
				this.PEL=PEL;	//调色板，初始为默认值P，更改后保存新的调色板
				this.WIN=WIN;	//温窗，初始值为默认值‘default’，更改后保存下拉框选项
				this.VAL=VAL;	//滑动块的值，初始默认值为0，更改后保存新的
				this.ARR=ARR;	//画板数组，保存标记的感兴趣区域数组（hua）
				this.TOP=TOP;	//图片原始最高温
				this.BOT=BOT;	//图片原始最低温
			}
	var defaultID=window.parent.document.getElementById('hot_item_id').value;
	$(document).ready(function () {
		document.getElementById("hot_info").innerText=window.parent.document.getElementById('hot_seriNum').value;
		var ser=window.parent.document.getElementById('hot_seriNum').value;
		$.cookie('ser',ser);
		var auth=$.cookie('Authorization');
		auth=auth.split(',');
		var hid=auth[1].substr(0,8);
		var pid=auth[1].substr(8,8);
		doMain(hid,pid,defaultID,ide);
	});
	function doMain (HID,PID,ExamID,IDE) {
		$.cookie('checkID',ExamID);		//传到后面调用（从服务器获取xml时调用）
		if(ExamID==''||ExamID==null){			//初始默认状态
			ExamID=window.parent.document.getElementById('hot_item_id').value;
		}
		sORh();
		inithotIN();
		checkHotList(HID,PID,ExamID,IDE);
		insertLi(hotIn);
		insertItem2(hotIn);
		if (IDE==1) {
            $('.thumbnail').css('cursor','default');
        }
		doCSS();
		aj_REC(HID,PID,ExamID,IDE);
		addROI(itemARRAY,RECs);
		doITES(itemARRAY);
		doROI(itemARRAY);
	}
    //初始化hotIn
    function inithotIN () {
    	hotIn.splice(0,hotIn.length);
    }
	//控制显示或隐藏检查报告按钮
	function sORh(){
		var b=parent.document.getElementById('hot_analyze').value;
		if(b==0){
			$('#hot_detail').hide();
			$('#unhot_detail').show();
		}else if (b==1) {
			$('#hot_detail').show();
			$('#unhot_detail').hide();
		}
	}
	//根据选择的检查次数不同获取热图地址
	function checkHotList (HID,PID,ExamID,IDE) {
		$.ajax({
			url: "http://"+comServerIP+"/Web/ExamFileInfo/"+HID+"/"+PID+"/"+ExamID,
			type: "Get",
			dataType: "JSON",
			headers: {"Authorization" : $.cookie('Authorization')},
			data:"{}",
			async:false,
			beforeSend:function(xhr){
				xhr.setRequestHeader('XXX',IDE);
			},
			success:function(data,status,xhr){
				for (var Key in data) {
					var unit=data[Key];
					hotIn.push(unit);
				}
				itemARRAY.length=hotIn.length;
				for (var i=0;i<hotIn.length;i++) {
					itemARRAY[i]=new ITEM(i,hotIn[i],b,'default',0,null,0,0);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);
			},
		})
	}
	//根据得到的itemARRAY绘制热图,a为itemARRAY，
	function doITES (a) {
		for (var i=0;i<a.length;i++) {
			if (a[i]) {
				if (a[i].WIN!='default') {
					var s=a[i].WIN;
					s=Number(s);
					//从服务器获取图片温差的中间值，各加减温窗的一半即为新的最高温最低温
					if (a[i].VAL!=0) {
						aj1(a[i].ADD);
						var middleval=((TnGlobalMax-TnGlobalMin)/2)+TnGlobalMin; 
						var midSval=s/2;
						GlobalMax=Number(middleval)+s/2;
						GlobalMin=middleval-s/2;
						maxTemp= GlobalMax+ parseInt(a[i].VAL)/20;
						minTemp= GlobalMin+ parseInt(a[i].VAL)/20;
						aj2(a[i].PEL);
						var rgbDATA=GetRender(TrawData,maxTemp,minTemp,TPalette);
						draw16('mycav'+i,rgbDATA);
					} else{
						aj1(a[i].ADD);
						var middleval=((TnGlobalMax-TnGlobalMin)/2)+TnGlobalMin; 
						var midSval=s/2;
						GlobalMax=Number(middleval)+s/2;
						GlobalMin=middleval-s/2;
						maxTemp=GlobalMax;
						minTemp=GlobalMin;
						aj2(a[i].PEL);
						var rgbDATA=GetRender(TrawData,maxTemp,minTemp,TPalette);
						draw16('mycav'+i,rgbDATA);
					}
				} else{
					if (a[i].VAL!=0) {
						aj1(a[i].ADD);
						maxTemp= GlobalMax+ parseInt(a[i].VAL)/20;
						minTemp= GlobalMin+ parseInt(a[i].VAL)/20;
						aj2(a[i].PEL);
						var rgbDATA=GetRender(TrawData,maxTemp,minTemp,TPalette);
						draw16('mycav'+i,rgbDATA);
					} else{
						aj1(a[i].ADD);
						aj2(a[i].PEL);
						var rgbDATA = GetRender(TrawData, TnGlobalMax, TnGlobalMin, TPalette);
						draw16('mycav'+i, rgbDATA);
					}
				}
			}
		}
	}
	//根据得到的检查地址数量动态插入li,传入参数a为地址数组，
	function insertLi (a) {
		var str='';
		for (var i=0;i<a.length;i++) {
			if (i==0) {
				str+='<li data-target= "#myCarousel" data-slide-to = "0" class="active"></li>'
			}else{
				str+='<li data-target= "#myCarousel" data-slide-to = "'+i+'" ></li>';
			}
		}
		$('#olList').append(str);
	}
	
	//根据得到的检查地址数量动态插入轮播项目，传入参数a为地址数组
	function insertItem2 (a) {
		var str='';
		for (var i=0;i<a.length;i++) {
			if (i==0) {
			str+='<div class="item active">';
			str+='<a href="javascript:void(0)" class="thumbnail" onclick="toDetail('+i+')">';
			str+='<div id="showCAV" class="" >';
			str+='<canvas id="mycav'+i+'"></canvas>';
			str+='</div>';
			str+='</a>';
			str+='</div>';
			} else{
			str+='<div class="item">';
			str+='<a href="javascript:void(0)" class="thumbnail" onclick="toDetail('+i+')">';
			str+='<div id="showCAV" class="" >';
			str+='<canvas id="mycav'+i+'"></canvas>';
			str+='</div>';
			str+='</a>';
			str+='</div>';	
			}
		}
		$('.carousel-inner').append(str);
	}
	//再次点击后删除原来的数据
	function reClick () {
		$('li').remove();
		$('.item').remove();
	}
	//点击后跳转到hot_detail
	function toDetail (e) {
		var ide=$.cookie('ide');
		//同样的，应为测试，注释掉身份认证
		if (ide==1) {
			return false;
		} else{
			$.cookie('detail_ID',hotIn[e]);
			$.cookie('ID_len',hotIn.length);
			for (var i=0;i<hotIn.length;i++) {
				$.cookie('detail_ID'+i,hotIn[i]);
			}
			window.open('hot_detail.html');
		}
	}
	
	//获取这次检查的检查记录并转化成需要的值,a为该次检查ID
	var RECs=new Array();		//记录图片检查信息的数组，单位为每张热图
	var iniWidth=0;
	var iniHeight=0;
	function aj_REC (HID,PID,ExamID,IDE) {
		$.ajax({
			url:"http://"+comServerIP+"/Web/RoiFileInfo/"+HID+"/"+PID+"/"+ExamID,
			headers:{"Authorization":$.cookie('Authorization')},
			type:'get',
			cache:false,
			async:false,
			beforeSend:function(xhr){
				xhr.setRequestHeader('XXX',IDE);
			},
			success:function (data) {
				if(data.substr(0,1)=='打'){
					return false;
				}
				if (($(data).find('images')[0].attributes.height)==null) {
					return false;
				}
				iniHeight=Number($(data).find('images')[0].attributes.height.value);
				iniWidth=Number($(data).find('images')[0].attributes.width.value);
				for (var i=0;;i++) {
					if ($(data).find('image'+i)[0]) {
						var s=$(data).find('image'+i)[0].attributes.imagename.value;
						var NAME=s.substring(0,s.length);
						var curmin=$(data).find('image'+i).children('status')[0].attributes.CurMin.value;
						var curmax=$(data).find('image'+i).children('status')[0].attributes.CurMax.value;
						var width=$(data).find('image'+i).children('status')[0].attributes.Width.value;
						if (width=='初始温宽') {
							width='default';
						} else{
							width=Number(width);
						}
						var perc=$(data).find('image'+i).children('status')[0].attributes.Percentage.value;
						var pal=$(data).find('image'+i).children('status')[0].attributes.PaletteName.value;
						var RIOS=new Array();
						for (var l=0;;l++) {
							if ($(data).find('image'+i).children('rois').children('roi'+l)[0]) {
								var id=l;
								var CONS=new Array();
								var Type=$(data).find('image'+i).children('rois').children('roi'+l)[0].attributes.type.value;
								for (var k=0;;k++) {
									if ($(data).find('image'+i).children('rois').children('roi'+l).children('pt')[k]) {
										var x=$(data).find('image'+i).children('rois').children('roi'+l).children('pt')[k].attributes.x.value;
										var y=$(data).find('image'+i).children('rois').children('roi'+l).children('pt')[k].attributes.y.value;
										var CON='('+x+','+y+')';
										CONS.push(CON);
									} else{
										break;
									}
								}
								var rio=new RIO(id,Type,CONS);
								RIOS.push(rio);
							} else{
								break;
							}
						}
						var rec=new REC(NAME,curmin,curmax,width,perc,pal,RIOS);
						RECs.push(rec);
					} else{
						break;
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.getAllResponseHeaders());
			}
		})
	}
//检查记录对象，每个对象对应一张热图，通过图片名——热图地址的最后位置进行匹配
	function REC (Name,CurMin,CurMax,Width,percen,palette,Rios) {
		this.Name=Name;
		this.CurMin=CurMin;
		this.CurMax=CurMax;
		this.Width=Width;
		this.percen=percen;
		this.palette=palette;
		this.Rios=Rios;
	}
	
	//为热图数组添加roi（如果有）的实现,a为热图地址数组，b为记录数组
	var hua=new Array();
	function addROI (a,b) {
	var cavWidth=$('#mycav0').width();
	var cavHeight=$('#mycav0').height();
		var	cavRateX=cavWidth/iniWidth;
		var cavRateY=cavHeight/iniHeight;
		for (var i=0;i<a.length;i++) {
			var s=a[i].ADD.split('/');
			var s1=s[s.length-1];
			var s2=s1.substring(0,s1.length-4);
			for (var l=0;l<b.length;l++) {
				var p=b[l].Name;
				if (s2==p) {
					a[i].VAL=b[l].percen;
					a[i].TOP=b[l].CurMax;
					a[i].BOT=b[l].CurMin;
					a[i].WIN=b[l].Width;
					a[i].PEL=b[l].palette;
					a[i].ARR=new Array();
					if (b[l].Rios) {
						for (var k=0;k<b[l].Rios.length;k++) {
							if (b[l].Rios[k]) {
								var d=b[l].Rios[k].ID;
								var e=b[l].Rios[k].type;
								var e1;
								var h='';
								if (e=='rect') {
									e1=1;
									var f=b[l].Rios[k].cons[0];
										f=f.substring(1,f.length-1);
									var	f1=f.split(',');
									var	f1x=Number(f1[0])*cavRateX;
									var	f1y=Number(f1[1])*cavRateY;
									var g=b[l].Rios[k].cons[2];
										g=g.substring(1,g.length-1);
									var	g1=g.split(',');
									var	g1x=Number(g1[0])*cavRateX;
									var	g1y=Number(g1[1])*cavRateY;
										h=f1x+','+f1y+','+g1x+','+g1y;
								}else if(e=='circle'){
									e1=2;
									var f=b[l].Rios[k].cons[0];
										f=f.substring(1,f.length-1);
									var	f1=f.split(',');
									var	f1x=Number(f1[0]);
									var	f1y=Number(f1[1]);
									var g=b[l].Rios[k].cons[2];
										g=g.substring(1,g.length-1);
									var g1=g.split(',');
									var g1x=Number(g1[0]);
									var g1y=Number(g1[1]);
									var wi=(g1x-f1x)/2;
									var he=(g1y-f1y)/2;
									h=(f1x-wi)*cavRateX+','+(f1y-he)*cavRateY+','+f1x*cavRateX+','+f1y*cavRateY;
								}else if(e=='point'){
									e1=3
									var f=b[l].Rios[k].cons[0];
										f=f.substring(1,f.length-1);
									var	f1=f.split(',');
									var	f1x=Number(f1[0])*cavRateX;
									var	f1y=Number(f1[1])*cavRateY;
										h=f1x+','+f1y;
								}else{
									e1=4
									var f=b[l].Rios[k].cons[0];
										f=f.substring(1,f.length-1);
									var	f1=f.split(',');
									var	f1x=Number(f1[0])*cavRateX;
									var	f1y=Number(f1[1])*cavRateY;
									var g=b[l].Rios[k].cons[1];
										g=g.substring(1,g.length-1);
									var	g1=g.split(',');
									var	g1x=Number(g1[0])*cavRateX;
									var	g1y=Number(g1[1])*cavRateY;
										h=f1x+','+f1y+','+g1x+','+g1y;
								}
								var wa=new duixiang(d,e1,h,false);
								a[i].ARR.push(wa);
							}
						}
					}
				}
			}
		}
	}
	//为每张热图绘制roi,a为itemARRAY，
	function doROI (a) {
		if (!hua.length) {
			return false;
		}else{
			for (var i=0;i<a.length;i++) {
				if (a[i]) {
					hua=a[i].ARR;
					reHua(i);
					hua.splice(0,hua.length);
				}
			}
		}
	}
	//参数改变，因为是为多张热图添加，所以要传入参数a为热图对应canvas
	function reHua(a) {
	if(hua) {
		if(hua.length == 0) {
			return false;
		} else {
			for(var i = 0; i < hua.length; i++) {
				if(hua[i].shape == 1) {
					var _item = hua[i].con.split(',');
					var _a = Number(_item[0]),
						_b = Number(_item[1]),
						_aa = Number(_item[2]),
						_bb = Number(_item[3]);
					juxing(_a, _b, _aa, _bb,a);
				}
				else if(hua[i].shape == 2) {
					var _item = hua[i].con.split(',');
					var _a = Number(_item[0]),
						_b = Number(_item[1]),
						_aa = Number(_item[2]),
						_bb = Number(_item[3]);
					yuanxing(_a, _b, _aa, _bb,a);
				}
				else if(hua[i].shape == 3) {
					var _item = hua[i].con.split(',');
					var _a = Number(_item[0]),
						_b = Number(_item[1]);
					huadian(_a, _b,a);
				}
				else if(hua[i].shape == 4) {
					var _item = hua[i].con.split(',');
					var _a = Number(_item[0]),
						_b = Number(_item[1]),
						_aa = Number(_item[2]),
						_bb = Number(_item[3]);
					huaxian(_a, _b, _aa, _bb,a);
				}
			}
		}
	}
}
	function juxing(a, b, aa, bb,inde) {
	a=Number(a.toFixed(0));
	b=Number(b.toFixed(0));
	aa=Number(aa.toFixed(0));
	bb=Number(bb.toFixed(0));
	var c = document.getElementById("mycav"+inde);
	var ctx = c.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(a, b);
	ctx.lineTo(aa, b);
	ctx.lineTo(aa, bb);
	ctx.lineTo(a, bb);
	ctx.lineTo(a, b);
	ctx.closePath();
	ctx.strokeStyle = 'black';
	ctx.stroke();
}
		//绘制圆形方法升级，改为椭圆
	if (CanvasRenderingContext2D.prototype.ellipse == undefined) {  
		CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {  
        	this.save();
        	this.translate(x, y);  
        	this.rotate(rotation);  
      		this.scale(radiusX, radiusY);  
    		this.arc(0,0, 1, startAngle, endAngle, antiClockwise);  
        	this.restore();
			}  
	}
	function yuanxing(a, b, aa, bb,inde) {
		var c = document.getElementById("mycav"+inde);
		var ctx = c.getContext('2d');
		ctx.beginPath();
		ctx.ellipse(a, b,Math.abs(aa-a), Math.abs(bb-b), 0, 0, Math.PI*2, true);
		ctx.stroke();
	}

	function huadian(a, b,inde) {
		var c = document.getElementById("mycav"+inde);
		var ctx = c.getContext('2d');
		ctx.beginPath();
		var R = 5;
		ctx.arc(a, b, R, 0, Math.PI * 2);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.stroke();
	}

	function huaxian(a, b, aa, bb,inde) {
		var c = document.getElementById("mycav"+inde);
		var ctx = c.getContext('2d');
		ctx.beginPath();
		//ctx.lineWidth=3;
		ctx.moveTo(a, b);
		ctx.lineTo(aa, bb);
		ctx.stroke();
	}
	function duixiang(ID, shape, con, sel) {
		this.ID = ID;
		this.shape = shape;
		this.con = con;
		this.sel = sel;
	}
	//保存RIO对象
	function RIO (ID,type,cons) {
		this.ID=ID;
		this.type=type;
		this.cons=cons;
	}