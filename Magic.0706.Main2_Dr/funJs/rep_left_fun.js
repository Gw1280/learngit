	var a=new Array();  //保存检查对象数组
	var app=angular.module('myapp',[]);
	app.controller('myctrl',['$scope','$http',function ($scope,$http) {
		$http({
			url: "http://192.168.2.246/Web/ExaminationInfo/00000000",
			type: "Get",
			dataType: "JSON",
			headers: {"Authorization" : $.cookie('Authorization')},
			data:"{}",
			async:false,
		}).success(function  (data) {
			for(var i=0;i<data.length;i++){
				var s=new hot_item();
				if (data[i]!=null) {
					s=new hot_item(data[i].m_strExamTime,data[i].m_strDocName,data[i].m_strExamID,data[i].m_strPID,data[i].m_strSnum,data[i].m_iIsAnalyzed,data[i].m_strAuthUsers);
					a.push(s);
				}
			}
			//初始状态，自动选择第一个为选中状态，然后将值传给父窗口,
			angular.element(document).ready(function () {
				var sC_ExamID=window.parent.document.getElementById('sC_ExamID').value;
				if (sC_ExamID!=''){
					for (var i=0;i<a.length;i++) {
						if (sC_ExamID==a[i].ExamID) {
							$('#'+a[i].ExamID).addClass('info');
							window.parent.document.getElementById('sC_SRC').value=a[i].SerialNum;
						}
					}
				} else{
				$('#'+a[0].ExamID).addClass('info');
				window.parent.document.getElementById('rep_I').value=a[0].ExamID;
				window.parent.document.getElementById('rep_SRC').value=a[0].SerialNum;
				}
				parent.frames['main_right'].location.href='rep_right.html';
			});
			
			
			$scope.rep_fun=function (e) {
			//$($event.target.parent).addClass('info');
			angular.element(document).ready(function () {
				//遍历整个列表，将已经选中的tr的css改为普通，当前选中的改为选中的css
				var b=true;
				
				for(var i=0;i<a.length;i++){
					var s=$('#'+a[i].ExamID).attr('class');
					var x=new Array();
					x=s.split(' ');
						for(var j=0;j<x.length;j++){
							if(x[j]=='info'){
								
								b=false;}
						}
					if(b==false){
						$('#'+a[i].ExamID).removeClass('info');
					}
				}
				$('#'+e.ExamID).addClass('info');
				window.parent.document.getElementById('rep_I').value=e.ExamID;
				window.parent.document.getElementById('rep_SRC').value=e.SerialNum;
				parent.frames['main_right'].showChange();
				//alert(e.ExamID);
						//alert($('#'+e.id).attr('class'));
//						parent.frames['main_right'].document.getElementById('rep_info').innerText=e.id;
//						parent.frames['main_right'].document.getElementById('rep_info2').value=e.id;
			});
		};
		}).error(function (XMLHttpRequest, textStatus, errorThrown) {
				 alert(XMLHttpRequest.status);
				 alert(XMLHttpRequest.readyState);
				 alert(textStatus);
				});
		$scope.list=a;
		
		
		
	}]);
	
	
	
	
	//测试数据
	function rep_info(info,time,id,srcc){
		this.info=info;
		this.time=time;
		this.id=id;
		this.srcc=srcc;
	}
	var rep1=new rep_info('这是报告一','20170801',30001,'123456789');
	var rep2=new rep_info('这是报告二','20170801',30002,'12345678');
	var rep3=new rep_info('这是报告三','20170801',30003,'1234567');
	var rep4=new rep_info('这是报告四','20170801',30004,'123456');
	var rep_list=[rep1,rep2,rep3,rep4];
	

	function hot_item (ExamTime,DocName,ExamID,PID,SerialNum,IsAnalyzed,AuthUsers) {
		this.ExamTime=ExamTime;
		this.DocName=DocName;
		this.ExamID=ExamID;
		this.PID=PID;
		this.SerialNum=SerialNum;
		this.ISAnalyzed=IsAnalyzed;
		this.AuthUsers=AuthUsers;
	}