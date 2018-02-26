	$(document).ready(function () {
		var ide=$.cookie('ide');
		if (ide==1) {
			var auth=$.cookie('Authorization');
			auth=auth.split(',');
			var hid=auth[1].substr(0,8);
			var pid=auth[1].substr(8,8);
			getUserInfo(hid,pid,ide);
		} else if(ide==2){
			getDrInfo();
		}else{
			window.parent.location.href='index.html';
		}
	});
	
	//用户登录时获取基础信息
	function getUserInfo (HID,PID,IDE) {
		if($.cookie('Authorization')){
			$.ajax({
			url:'http://'+comServerIP+'/Web/PatientInfo'+'/'+HID+'/'+PID,   
			headers:{"Authorization":$.cookie('Authorization')},	
			type: "Get",
			dataType: "JSON",
			data:"{}",
			beforeSend:function(xhr){
				xhr.setRequestHeader('XXX',IDE);
			},
			success:function(data){
					var s=new user_info (data.m_strPID,data.m_strName,data.m_strID,data.m_iAge,data.m_iHeight,data.m_iWeight,data.m_emsex,data.m_iStatus,data.m_strAuthUsers);
					userINFO=s;	//将登录人信息保存到zhongzhuan.js
//				$.cookie('userName',s.m_strName);
//					console.log($.cookie('userName'));
					$('#right_name').html(s.m_strName);           
					if (s.m_emsex==1||s.m_emsex=='1') {
						$('#right_sex').html('男');
					} else{
						$('#right_sex').html('女');
					}
					$('#right_age').html(s.m_iAge);                 
					$('#right_height').html(s.m_iHeight);             
					$('#right_weight').html(s.m_iWeight);             
					$('#right_userID').html(s.m_strID);
					window.parent.document.getElementById('main_self').innerText=s.m_strName;
				
			},
			
			 error: function(XMLHttpRequest, textStatus, errorThrown) {
				$('#right_name').html('抱歉您的登录信息有误，请重新登录再试');
				   },
		});
			}else{
				window.parent.location.href='index.html';
			}
	}
	//医生登录时
	function getDrInfo () {
		if ($.cookie('Authorization')) {
			var s=$.cookie('Authorization').split(',');
			window.parent.document.getElementById('main_self').innerText=s[0];
		}
	}
//
	//实际对象
//	 Public $m_strPID;         //病历号
//  Public $m_strName;        //姓名
//  Public $m_strID;          //身份证号码
//  Public $m_iAge;           //年龄
//  Public $m_iHeight;        //身高
//  Public $m_iWeight;        //体重
//  Public $m_emsex;          //性别
//  Public $m_strETableName;  //检查表名
//  Public $m_iStatus;        //待检状态
//  Public $m_strSavePath;    //病人数据的存储路径
//  Public $m_strAuthUsers;   //拥有访问权的用户（这个属性是要传递给检查的）
	function user_info (m_strPID,m_strName,m_strID,m_iAge,m_iHeight,m_iWeight,m_emsex,m_iStatus,m_strAuthUsers) {
		this.m_strPID      =m_strPID      ;
		this.m_strName     =m_strName     ;
		this.m_strID       =m_strID       ;
		this.m_iAge        =m_iAge        ;
		this.m_iHeight     =m_iHeight     ;
		this.m_iWeight     =m_iWeight     ;
		this.m_emsex       =m_emsex       ;
		this.m_iStatus     =m_iStatus     ;
		this.m_strAuthUsers=m_strAuthUsers;
	}