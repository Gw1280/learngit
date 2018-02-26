	var item=new hot_item();
	var edList=new Array();
	var unList=new Array();
	var ide=$.cookie('ide');
	var auth=$.cookie('Authorization');
	auth=auth.split(',');
	var hid=auth[1].substr(0,8);
	var pid=auth[1].substr(8,8);
	$(document).ready(function(){
		getCheckList('Web',hid,pid,ide);
		var winHeight=$('body').css('height').split('px');
		$('#hot_left_row1,#panelbody1,#panelbody2').height(winHeight[0]*0.7);
		insertCheck(edList,unList,'tbody_checkList_ed','tbody_checkList_un');
		if (edList.length!=0) {
			$('#'+edList[0].SerialNum).addClass('info');
			window.parent.document.getElementById('hot_seriNum').value=edList[0].SerialNum;
			$.cookie('Doc',edList[0].DocName);
			window.parent.document.getElementById('hot_item_id').value=edList[0].ExamID;
			window.parent.document.getElementById('hot_analyze').value=edList[0].ISAnalyzed;
		}else if(unList.length!=0){
			$('#'+unList[0].SerialNum).addClass('info');
			window.parent.document.getElementById('hot_seriNum').value=unList[0].SerialNum;
			window.parent.document.getElementById('hot_item_id').value=unList[0].ExamID;
			window.parent.document.getElementById('hot_analyze').value=unList[0].ISAnalyzed;
		}else{
			window.parent.document.getElementById('hot_seriNum').value=null;
			window.parent.document.getElementById('hot_item_id').value=null;
			window.parent.document.getElementById('hot_analyze').value=null;
		}
		parent.frames['main_right'].location.href='hot_right.html';
	});
	//获取检查列表
	function getCheckList (url,HID,PID,IDE) {
		$.ajax({
			type:"get",
			url:"http://"+comServerIP+"/"+url+"/ExaminationInfo/"+HID+"/"+PID+"/"+"00000000",
			dataType: "JSON",
			headers: {"Authorization" : $.cookie('Authorization')},
			data:"{}",
			async:false,
			beforeSend:	function(xhr){
				xhr.setRequestHeader('XXX',IDE);
			},
			success:function (data,status,xhr) {
				for (var i=0;i<data.length;i++) {
					if(data[i]!=null){
						item=new hot_item(data[i].m_strExamTime,data[i].m_strDocName,data[i].m_strExamID,data[i].m_strPID,data[i].m_strSnum,data[i].m_iIsAnalyzed,data[i].m_strAuthUsers);
						if(item.ISAnalyzed=='1'){
							edList.push(item);
						}else{
							unList.push(item);
						}
					}
				}
			},
			error:function (xhr,status,errorThrown) {
				console.log(xhr.getAllResponseHeaders());
			}
		});
	}
	//插入检查tr,第一个参数为已检查列表，第二个为未检查
	function insertCheck (EDLIST,UNLIST,EDCLASS,UNCLASS) {
		if (EDLIST.length>0) {
			for (var k in EDLIST) {
				var str='<tr id="'+EDLIST[k].SerialNum+'" onclick="toDetail('+EDLIST[k].SerialNum+')" class="">';
				str+='<td class="tr_ed">'+EDLIST[k].SerialNum+'</td>';
				str+='</tr>';
				$('.'+EDCLASS).append(str);
			}
		}
		if (UNLIST.length>0) {
			for (var x in UNLIST) {
				var str='<tr id="'+UNLIST[x].SerialNum+'" onclick="toDetail('+UNLIST[x].SerialNum+')"  class="">';
				str+='<td class="tr_ed">'+UNLIST[x].SerialNum+'</td>';
				str+='</tr>';
				$('.'+UNCLASS).append(str);
			}
		}
		
	}
	//点击某个检查的方法
	function toDetail (ser) {
		parent.frames['main_right'].reClick();
		var b1=true;
		for(var i=0;i<edList.length;i++){
			var s1=$('#'+edList[i].SerialNum).attr('class');
			var a1=new Array();
			a1=s1.split(' ');
				for(var j=0;j<a1.length;j++){
					if(a1[j]=='info'){b1=false;}
				}
			if(b1==false){
				$('#'+edList[i].SerialNum).removeClass('info');
			}
		}
		for(var m=0;m<unList.length;m++){
			var ss=$('#'+unList[m].SerialNum).attr('class');
			var aa=new Array();
			aa=ss.split(' ');
				for(var n=0;n<aa.length;n++){
					if(aa[n]=='info'){b1=false;}
				}
			if(b1==false){
				$('#'+unList[m].SerialNum).removeClass('info');
			}
		}
		var flag=false;
		for (var k in edList) {
			if (ser==edList[k].SerialNum) {
				flag=true;
				ser=edList[k];
				break;
			}
		}
		if (flag==false) {
			for (var l in unList) {
				if (ser==unList[l].SerialNum) {
					ser=unList[l];
					break;
				}
			}
		}
		
		$('#'+ser.SerialNum).addClass('info');
		parent.frames['main_right'].document.getElementById('hot_info').innerText=ser.SerialNum;
		window.parent.document.getElementById('hot_seriNum').value=ser.SerialNum;
		$.cookie('Doc',ser.DocName);
		window.parent.document.getElementById('hot_item_id').value=ser.ExamID;
		window.parent.document.getElementById('hot_analyze').value=ser.ISAnalyzed;
		if (ser.ISAnalyzed==1) {
		parent.frames['main_right'].document.getElementById('hot_detail').style.display='';
		parent.frames['main_right'].document.getElementById('unhot_detail').style.display='none';
			
		} else{
		parent.frames['main_right'].document.getElementById('hot_detail').style.display='none';
		parent.frames['main_right'].document.getElementById('unhot_detail').style.display='';						
		}
		//根据点击的检查进行取图,先删除原来的热图
		parent.frames['main_right'].doMain(hid,pid,ser.ExamID,ide);
		parent.frames['main_right'].doCSS();	//调用hot_right方法，向服务器请求数据,调用方法为showHotIMG.js的文件
	}
	//检查对象
	function hot_item (ExamTime,DocName,ExamID,PID,SerialNum,IsAnalyzed,AuthUsers) {
		this.ExamTime=ExamTime;
		this.DocName=DocName;
		this.ExamID=ExamID;
		this.PID=PID;
		this.SerialNum=SerialNum;
		this.ISAnalyzed=IsAnalyzed;
		this.AuthUsers=AuthUsers;
	}