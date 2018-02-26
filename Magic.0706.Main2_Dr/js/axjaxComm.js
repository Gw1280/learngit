var FilePath = "123";
var TrawData;
var TPalette;
var TWidth = 0;
var THeight = 0;
var TnGlobalMax=0;
var TnGlobalMin=0;
var GlobalMax=0;
var GlobalMin=0;
var auth=$.cookie('Authorization');
auth=auth.split(',');
var hid=auth[1].substr(0,8);
var pid=auth[1].substr(8,8);
var ide=$.cookie('ide');
	//ajax
		function aj() {
			var aj = $.ajax( {    
    url:'http://'+comServerIP+'/Web/ExamFileInfo/'+hid+'/'+pid+'/00000101',
	headers:{"Authorization":$.cookie('Authorization')},
    type:'get',    
    cache:false,    
    dataType: "json",
	async:false,
	beforeSend:	function(xhr){
		xhr.setRequestHeader('XXX',ide);
	},
    success:function(data) {
		FilePath = data.file1;
    },    
    error: function(XMLHttpRequest, textStatus, errorThrown) {
		alert(XMLHttpRequest.status);
		alert(XMLHttpRequest.readyState);
		alert(textStatus);
     }    
});  
		}
		
		function aj1(FilePath) {
			var aj1 = $.ajax( {    
			    url:'http://'+comServerIP+'/Web/DATFileInfo',// ��ת�� action       
				headers:{"Authorization":$.cookie('Authorization')},	
			    type:'post',    
				data:'{"m_FilePath":"' + FilePath + '"}',
			    cache:false,    
				async:false,
			    dataType: "json",
			    beforeSend:	function(xhr){
					xhr.setRequestHeader('XXX',ide);
				},
			    success:function(data) {    
					TWidth = data.width;
					THeight = data.height;
					RAW_TO_TEMP_SUBTRACTOR = data.subtractor;
					RAW_TO_TEMP_DIVISOR = data.divisor;
					TnGlobalMax= (data.max-RAW_TO_TEMP_SUBTRACTOR)/RAW_TO_TEMP_DIVISOR;//得到摄氏度
					TnGlobalMin= (data.min-RAW_TO_TEMP_SUBTRACTOR)/RAW_TO_TEMP_DIVISOR;
					GlobalMax=(data.max-RAW_TO_TEMP_SUBTRACTOR)/RAW_TO_TEMP_DIVISOR;
					GlobalMin=(data.min-RAW_TO_TEMP_SUBTRACTOR)/RAW_TO_TEMP_DIVISOR;
					TrawData = data.content;
			     },    
			    error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
			     }    
			});  
		}
		//将type改成get为获取调色板数组，取格式前的第一个文件
		function aj2(b) {
			FilePath = b;
			var aj2 = $.ajax( {    
			    url:'http://'+comServerIP+'/Web/PaletteFileInfo',// ��ת�� action       
				headers:{"Authorization":$.cookie('Authorization')},	
			    type:'post',    
				data:'{"PaletteName":"' + FilePath + '"}',
			    cache:false,    
				async:false,
			    dataType: "json",
			    beforeSend:	function(xhr){
					xhr.setRequestHeader('XXX',ide);
				},
			    success:function(data) {    
					TPalette = data.content;
					aj2Palete=TPalette;
				},    
          		error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
     			}    
			});  
	
		}
		
		//获取调色板，
		var pls=new Array();//调色板数组
		function aj3() {
			var aj3 = $.ajax( {    
			    url:'http://'+comServerIP+'/Web/PaletteFileInfo',
			    headers:{"Authorization":$.cookie('Authorization')},
			    type:'get',    
				data:'{}', 
				async:false,
			    dataType: "json",
			    beforeSend:	function(xhr){
					xhr.setRequestHeader('XXX',ide);
				},
			    success:function(data) {
			    	pls.splice(0,pls.length);
			    	for(var Key in data[0]){
			    		var repl=data[0][Key];
			    		respl=repl.split('/');
			    		pl=respl[respl.length-1].replace(/.xml/,'');
			    		pls.push(pl);
			    	}
			     },    
          		error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(XMLHttpRequest.status);
					alert(XMLHttpRequest.readyState);
					alert(textStatus);
          		}    
			});  
		}

	//动态改变时的方法
 function showValue(newValue){  
           //to do:����newValue��ֵ 
		   //alert(TnGlobalMax);
			TnGlobalMax = GlobalMax+ parseInt(newValue)/20;
		  	TnGlobalMin = GlobalMin+ parseInt(newValue)/20;
			//alert(TnGlobalMax);
				clear_CAV('Main_CAV');
				clear_CAV('Col_CAV');
				clear_CAV('Sca_CAV');
			var TRGBData = GetRender(TrawData, TnGlobalMax, TnGlobalMin, TPalette);
			draw16("Main_CAV", TRGBData);
			drawPalette("Col_CAV", TPalette, 1, 256);
			drawScale("Sca_CAV", TnGlobalMax, TnGlobalMin);
	}  
	
		
			var maxTemp=0;
			var minTemp=0;
	function change_show () {
				var s=$('#selectwindow option:selected').text();
				if (s=='default') {
					var rangeval=$('#ex4').slider();
						rangeval.slider('setValue',0);
						clear_CAV('Main_CAV');
						clear_CAV('Col_CAV');
						clear_CAV('Sca_CAV');
						//从服务器获取图片温差的中间值，各加减温窗的一半即为新的最高温最低温
						
						//z这里重新画图时，会把原来的tngglobal替换掉
						doShow(add,p,'Main_CAV');
						doCol(p);
						doSca(add);
				} else{
					var rangeval=$('#ex4').slider();
						rangeval.slider('setValue',0);
						clear_CAV('Main_CAV');
						clear_CAV('Col_CAV');
						clear_CAV('Sca_CAV');
						//从服务器获取图片温差的中间值，各加减温窗的一半即为新的最高温最低温
						var middleval=((TnGlobalMax-TnGlobalMin)/2)+TnGlobalMin; 
						var midSval=s/2;
						GlobalMax=Number(middleval)+Number(s/2);
						GlobalMin=middleval-s/2;
						maxTemp=GlobalMax;
						minTemp=GlobalMin;
						//alert(GlobalMax)
						//console.log(middleval);
						//z这里重新画图时，会把原来的tngglobal替换掉
						var rgbDATA=GetRender(TrawData,maxTemp,minTemp,TPalette);
						draw16('Main_CAV',rgbDATA);
						doCol(p);
						
						drawScale('Sca_CAV',maxTemp,minTemp);
				}
			}
		//同样是绘图，类似于domain，用于改动之后的画图,不同之处在于这里获取rgb用变化后的最大最小值，即maxTemp和minTemp
		function doShow2 (a,b,c) {
				if(b==''){
					b='0000_5';
				}
				aj1(a);
				aj2(b);
				var rgbDATA=GetRender(TrawData,maxTemp,minTemp,TPalette);
				draw16(c,rgbDATA);
		}
var RAW_TO_TEMP_SUBTRACTOR = 1000;
var RAW_TO_TEMP_DIVISOR    = 128.0;  
//var TrawData = new Array(25600);
//for (var j = 0; j < 256; j++)
//{
//	for (var k = 0; k < 100; k++)
//	{
//		TrawData[j*100 + k] = j;
//	}
//}
//var iLenTrawData = 278*330;
//alert(TrawData);
//var TPalette = new Array(256*3);
//for (var j = 0; j < 256; j++)
//{
//	TPalette[j*3] = 255 - j;
//	TPalette[j*3 + 1] = 255 - j;
//	TPalette[j*3 + 2] = 255 - j;
//}



	//灰度矩阵转RGB
	var rgbdate=new Array();
	var RAnge;
	var TIaoses=new Array();
	var MINwendu;
	var MAXwendu;
function GetRender(rawData, nGlobalMax, nGlobalMin, Palette)
{
	 var ilen = rawData.length;
	
	
		var RGBData = new Array(ilen*4);
		//alert(ilen);
	
	var topValue, bottomValue;
	if(Math.abs(nGlobalMin - nGlobalMax) < 0.000001) //double����ֱ���ж���ȣ�ֻ����һ���ľ��ȷ�Χ�ڽ��������
	{
		return RGBData;
	}

	topValue = nGlobalMax*RAW_TO_TEMP_DIVISOR+RAW_TO_TEMP_SUBTRACTOR;
	bottomValue = nGlobalMin*RAW_TO_TEMP_DIVISOR+RAW_TO_TEMP_SUBTRACTOR;
    topValue = parseInt(topValue);
	bottomValue = parseInt(bottomValue);
	
	if (topValue < bottomValue)
		topValue = bottomValue;

	var range = topValue - bottomValue;
//	if ( range < 0.00001 ) return -1;//�������Ϊ��ɫ��ʱ�򣬸��µ��Ƴ�ʱ�в�������
	range = 255.0 / (topValue - bottomValue);
	//alert(range);
	//range = 1;
	//range = 255.0 / ((topValue - bottomValue + m_oldtopValue - m_oldbottomValue)/2);
	//m_oldtopValue = topValue;
	//m_oldbottomValue = bottomValue;
	//TRACE2("***************topValue = %d, bottomValue = %d*******************", topValue, bottomValue);
	//TRACE1("***************range = %f\n", range);
	////������������о����ֱ��ͼ��⻯
	//Mat IndexData(rawData.size(), CV_16UC1);
	//pCpiccorclass->ImageEqualizehist(rawData, IndexData);

	//double dMin, dMax;
	//int maxPos[2], minPos[2];
	//minMaxIdx(IndexData, &dMin, &dMax, minPos, maxPos);
	//topValue = (short)dMax;
	//bottomValue = (short)dMin;
	//if (topValue <= bottomValue)
	//{
	//	return -1;
	//}
	//range = 255.0 / (topValue - bottomValue);
	//////////////ֱ��ͼ��⻯//////////////////////////
	var pSrcPix = rawData;
	var pDstPix = RGBData;
	var totalPix = rawData.length;
	
	var pPaletteData = Palette;
	//int datasize = 3*sizeof(UCHAR);

	//int icalibration = 25*RAW_TO_TEMP_DIVISOR + RAW_TO_TEMP_SUBTRACTOR;
	//double iLcalibrationIndex = 250.0;
	//double iHcalibrationIndex = 255.0 - iLcalibrationIndex;
	//alert(totalPix);
	for (var i=0; i<totalPix; i++)
	{
		var indexColor  = Math.min(Math.max(pSrcPix[i], bottomValue), topValue);

		///////////��36��Ϊ��׼��//////////////
		//if (indexColor <= icalibration)
		//{
		//	range = iLcalibrationIndex/(icalibration - bottomValue);
		//	indexColor = static_cast<USHORT>((indexColor - bottomValue)*range);
		//}
		//else
		//{
		//	range = iHcalibrationIndex/(topValue - icalibration);
		//	indexColor = static_cast<USHORT>((indexColor - icalibration)*range + iLcalibrationIndex);
		//}
		///////////��36��Ϊ��׼��//////////////

		indexColor = parseInt((indexColor - bottomValue)*range);
        
		if (indexColor > 255)
		{
			indexColor = 255;
		}

		if (indexColor < 0)
		{
			indexColor = 0;
		}
		//alert(indexColor);
		//USHORT indexColor = IndexData.at<UCHAR>(i/IndexData.cols, i%IndexData.cols);
		//��������Ц�У�����Կ�
		//****************Start****************************//
		
		//****************End******************************//
		pDstPix[i*4] = pPaletteData[3*indexColor];
		pDstPix[i*4 + 1] = pPaletteData[3*indexColor + 1];
		pDstPix[i*4 + 2] = pPaletteData[3*indexColor + 2];
		
	}

	////��ͼ���ֱ��ͼ
	//pCpiccorclass->DrawRawEqualizeHist(rawData, RGBData);

	//Mat IndexData(rawData.size(), CV_8UC1);
	//pCpiccorclass->ImageEqualizehist(rawData, IndexData);
	//pCpiccorclass->DrawIndexEqualizeHist(IndexData, RGBData);
	//var arraytemp = new Array(256);
	//for (var i = 0; i < 256; i++)
	//{
	//	arraytemp[i] = pDstPix[(i*330 + 100)*4];
	//	alert(arraytemp[i]);
	//}
	
	//alert(pDstPix[(330*278 - 1)*4]);
	
	RAnge=range;
	TIaoses=pPaletteData;
	MINwendu=bottomValue;
	MAXwendu=topValue;
	return pDstPix;
}
	
	//像页面绘制热图
	var RGBshuzu=new Array();
 function draw16(id, RGBData) {
             var canvas = document.getElementById(id);
             if (canvas == null)
             	return false;
//                console.log(canvas);
             var context = canvas.getContext("2d");
			 
			 var  RGBCanvas = document.createElement("canvas");  
				 RGBCanvas.width=TWidth;  
				 RGBCanvas.height=THeight;  
				 var RGBContext = RGBCanvas.getContext("2d");  
				 var imagedata = RGBContext.createImageData(TWidth, THeight);
                 //var imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                 //alert(imagedata.data.length);
                 //�޸�imagedata
                 for (var i = 0, n = imagedata.data.length; i < n; i += 4) {
           
                    imagedata.data[i + 0] = RGBData[i + 0]; //red;
                     imagedata.data[i + 1] = RGBData[i + 1]; //green
                     imagedata.data[i + 2] = RGBData[i + 2]; //blue
                     imagedata.data[i + 3] = 255; //a
                 }
                 RGBContext.putImageData(imagedata, 0, 0);
				 context.drawImage(RGBCanvas,0, 0, TWidth, THeight, 0, 0, canvas.width, canvas.height);
//				console.log(TWidth+','+THeight+','+canvas.width+','+canvas.height+','+imagedata.data[1]+','+imagedata.data[42]);
             //}
             
             rgbdate=imagedata;
             RGBshuzu=RGBData;
//             console.log(imagedata);
			 return true;
         }
		 
		 //画调色板
		 function drawPalette(id, RGBData, w, h) {
             var canvas = document.getElementById(id);
             if (canvas == null)
                 return false;
             var context = canvas.getContext("2d");
			// context.scale(2, 2);
             context.fillStyle = 'black'
			 
             //�����½ǻ�һ������
             context.fillRect(0,0,canvas.width,canvas.height);
             //var image = new Image();
             //image.src = "Image/html5.jpg";
 
             //image.onload = function () {
                 //�����Ͻǻ�һ��ͼƬ
                 //context.drawImage(image, 0, 0,200,200);
 
                 //ʵ��֤��imagedataȡ����canvas���ڷ�Χ����ͼ�Σ���ֹ��ͼƬ
                 //����ȡ���������ǿհ׵�canvas������
                 //var imagedata = context.getImageData(0, 0, w, h);
				 var imagedata = context.createImageData(w, h);
                 //alert(imagedata.data.length);
                 //�޸�imagedata
				 var j = 255;
                 for (var i = 0, n = imagedata.data.length; i < n; i += 4) {
           
                     imagedata.data[i + 0] = RGBData[j*3 + 0]; //red;
                     imagedata.data[i + 1] = RGBData[j*3 + 1]; //green
                     imagedata.data[i + 2] = RGBData[j*3 + 2]; //blue
                     imagedata.data[i + 3] = 255; //a
					 j -= 1;
                 }
				 //var img = new image(imagedata);
				 //context.scale(2, 2);
				
				 var  offCanvas = document.createElement("canvas");  
				 offCanvas.width=w;  
				 offCanvas.height=h;  
				 var offContext = offCanvas.getContext("2d");  
				 
				 offContext.fillStyle='black';  
				 offContext.fillRect(0,0,offCanvas.width,offCanvas.height);
                 offContext.putImageData(imagedata, 0, 0);
				 context.drawImage(offCanvas,0, 0, w, h, 0, 0, canvas.width, canvas.height);
				 //context.scale(0.5, 0.5);
				 //canvas.width = 200;
				 //canvas.height = 400;
             //}
			 return true;
         }
		 
		 	//刻度尺
		   function drawScale(id, maxtemp, mintemp) {
			PaintScale(id);
			PaintTempValue(id, maxtemp, mintemp);
			 return true;
         }
		 
		 function PaintScale(id)
		 {
			
			var canvas = document.getElementById(id);
			var context = canvas.getContext("2d");
			
			var  ScaleCanvas = document.createElement("canvas");  
			ScaleCanvas.width=parseInt(canvas.width/4);  
			ScaleCanvas.height=canvas.height;  
			var ScaleContext = ScaleCanvas.getContext("2d");  
			
			var iHeight = canvas.height;
			var Factor = parseInt(iHeight/100);
			var iHLeft = iHeight - Factor*100;
			var idy = 0;
			
			for (var i = 0; i < 101; i++)
			{
				var iPenWidth = 1;
				var iLineWidth = 0;
				if (0 == i%10)
				{
					iPenWidth = 2;
					iLineWidth = ScaleCanvas.width;
				}
				else
				{
					iPenWidth = 1;
					iLineWidth = parseInt(ScaleCanvas.width/2);
				}

				if (i > 0)
				{
					idy += Factor + parseInt(iHLeft*i/100) - parseInt(iHLeft*(i - 1)/100);
				}
					ScaleContext.lineWidth = iPenWidth;
					ScaleContext.moveTo(0,ScaleCanvas.height - idy);
					ScaleContext.lineTo(iLineWidth,ScaleCanvas.height - idy);
					ScaleContext.stroke();
			}
			
			context.drawImage(ScaleCanvas,0, 0);
		 }
		 
		
		 function PaintTempValue(id, dCurMax, dCurMin)
		 {
			var canvas = document.getElementById(id);
			var context = canvas.getContext("2d");
			
			var  ScaleCanvas = document.createElement("canvas");  
			ScaleCanvas.width=parseInt(canvas.width*3/4);  
			ScaleCanvas.height=canvas.height;  
			var ScaleContext = ScaleCanvas.getContext("2d");  
				ScaleContext.font='17px Arial';
				//ScaleContext.scale(1,1);
			var iHeight = canvas.height;
			var Factor = parseInt(iHeight/100);
			var iHLeft = iHeight - Factor*100;
			var idy = 0;
			
			
			var dTempValue = 0;
			var xTemp = 1;
			var yTemp = 0;
			for (var i = 0; i < 101; i++)
			{
				if (i > 0)
				{
					idy += Factor + parseInt(iHLeft*i/100) - parseInt(iHLeft*(i - 1)/100);
				}

				if (0 == i%10)
				{
					var iLevel = parseInt(i/10);
					dTempValue = dCurMin + iLevel*((dCurMax - dCurMin)/10.0);
					//console.log(dCurMin-1);
                    yTemp = iHeight - idy + 4;
					if (0 == i)
					{
						yTemp = iHeight - idy;
					}

					if (100 == i)
					{
						yTemp = 15;
					}
					
					ScaleContext.fillText(dTempValue.toFixed(1),xTemp,yTemp);
				}
			}
			context.drawImage(ScaleCanvas,canvas.width - ScaleCanvas.width, 0);
		 }