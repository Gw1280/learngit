$(document).ready(function() {
	$('#btn_login').click(function() {
		login();
	})
	$(this).keydown(function(event) {
		if (event.which == 13) {
			login();
		}
	});
	$('#login_username').blur(function() {
		var s = $('#login_username').val();
		if (s) {
			var i = $.cookie(s);
			var l = $.cookie(s + 'ide');
			if (i != null) {
				i = unCode(s, i);
				$('#login_password').val(i);
			}
			if (l != null) {
				$('input:radio').eq(l - 1).attr('checked', 'true');
			}
		};
	});
	//轮播图点击跳转
	$('#carousel-inner-01').click(function() {
		location.href = '#';
	});
	$('#carousel-inner-02').click(function() {
		location.href = '#';
	});
	$('#carousel-inner-03').click(function() {
		location.href = '#';
	});
	$('#carousel-inner-04').click(function() {
		location.href = '#';
	});
	$('#carousel-inner-05').click(function() {
		location.href = '#';
	});
});

function login() {
	var ide = getIDE();
	var user = $('#login_username').val();
	var pass = $('#login_password').val();
	if (ide == 1) {
		getAuth('Web', user, pass, ide, pass);
	}
	else {
		var auth = getAuthTest2(ide);
		var validate = md5(pass + auth);
		getAuth('Web', user, auth + ',' + validate, ide, pass);
	}
}

function isEmpty(obj) {
	for (var name in obj) {
		return false;
	}
	return true;
};

function getIDE() {
	var ide = $('input:radio[name="ide"]:checked').val();
	return ide;
}
//登录验证
function getAuth(url, user, pass, ide, passed) {
	$.ajax({
		type: 'get',
		url: 'http://' + comServerIP + '/' + url + '/Authorization',
		async: false,
		headers: {
			'Authorization': user + ',' + pass
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader('XXX', ide);
		},
		success: function(data, status, xhr) {
			//应加上区分ide的代码
			if (ide == 1) {
				if (data.Auth == 200) {
					$.cookie('Authorization', user + ',' + pass);
					$.cookie('ide', ide);
				}
				else {
					$('#mess_login').html('账号或密码错误，请重试');
					$('#mess_login').show();
					return false;
				}
			}
			else {
				var noce = xhr.getResponseHeader('WWW-Authenticate');
				$.cookie('Authorization', user + ',' + noce + ',' + md5(passed + noce));
				$.cookie('ide', ide);
				//getHID('Test');
			}
			var i = $('#REM').is(':checked');
			if (true == i) {
				var expiresDate = new Date();
				expiresDate.setTime(expiresDate.getTime() + (7 * 24 * 60 * 60 * 1000));
				$.cookie(user, enCode(user, passed), {
					expires: expiresDate
				});
				$.cookie(user + 'ide', ide, {
					expires: expiresDate
				});
			}
			location.href = ('main_bootstrap.html');
		},
		error: function(xhr, status, errorThrown) {
			if (xhr.status == 401) {
				$('#mess_login').html('账号或密码错误，请重试');
				$('#mess_login').show();
			}
			else {
				$('#mess_login').html('连接服务器失败，请稍后重试');
				$('#mess_login').show();
			}
		}
	});
}
//高级用户的注销方法
function loginOut(url) {
	$.ajax({
		type: 'delete',
		url: 'http://' + comServerIP + '/' + url + '/Authorization',
		async: false,
		headers: {
			'Authorization': $.cookie('Authorization')
		},
		success: function(data, status, xhr) {
			console.log('注销成功');
		},
		error: function(xhr, status, errorThrown) {
			console.log(xhr.getAllResponseHeaders());
		}
	});
}
//获取所属医院
function getHID(url) {
	$.ajax({
		type: 'get',
		url: 'http://' + comServerIP + '/' + url + '/HospitalInfo/00000048',
		async: false,
		headers: {
			'Authorization': $.cookie('Authorization2')
		},
		success: function(data, status, xhr) {
			$.cookie('HID', data.m_strHID);
			return data;
		},
		error: function(xhr, status, errorThrown) {
			console.log(xhr.getAllResponseHeaders());
		}
	});
}
//医生登录首次验证
function getAuthTest2(ide) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', 'http://' + comServerIP + '/Web/Authorization', false);
	xhr.setRequestHeader('XXX', ide);
	var auth = '';
	xhr.onload = function() {
		if (xhr.status == 401) {
			auth = xhr.getResponseHeader('WWW-Authenticate');
		}
		else {
			$('#mess_login').html('连接服务器失败，请稍后重试');
			$('#mess_login').show();
		}
	}
	try {
		xhr.send();
	}
	catch (e) {
		if (e.name == 'NetworkError') {
			$('#mess_login').html('连接服务器失败，请稍后重试');
			$('#mess_login').show();
		}
	}
	return auth;
}