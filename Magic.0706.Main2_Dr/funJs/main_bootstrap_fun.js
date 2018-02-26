	
	$(document).ready(function () {
//		var s=$.cookie('userName');
//			if(s!=''){
//				$('#main_self').html(s);
//				console.log(s);
//			}else{
//				location.href='index.html';
//			};
//		$('#logOut').click(function () {
//			$.cookie('Authorization','');
//			$.cookie('userName','');
//			location.href='index.html';
//		});
		//进行账户检测，某些功能只出现在部分账户中
		var ide=$.cookie('ide');
		if (ide==1) {
			$('#CountManage').hide();
			$('#toHot').html('我的检查');
		}else{
			$('#toHot').html('查看检查');
			$('#CountManage').show();
			$('#main_left').show();
			$('#main_left').hide();
			$('#col2').removeClass('col-lg-10 col-sm-10 col-xs-10 col-md-10').addClass('col-lg-12 col-sm-12 col-xs-12 col-md-12');
		}
		$('#toMain').click(function () {
			if (ide==1) {
				$('#main_left').show();
				$('#main_left').attr('src','main_main_right.html');
				$('#main_right').attr('src','main_main_left.html');
				$('#col2').removeClass('col-lg-12 col-sm-12 col-xs-12 col-md-12').addClass('col-lg-10 col-sm-10 col-xs-10 col-md-10 ');
			} else{
				$('#main_left').show();
				$('#main_left').hide();
				$('#col2').removeClass('col-lg-10 col-sm-10 col-xs-10 col-md-10').addClass('col-lg-12 col-sm-12 col-xs-12 col-md-12');
				$('#main_right').attr('src','main_main_left.html');
			}
		});
		$('#toHot').click(function () {
			if (ide==1) {
				$('#main_left').show();
				$('#main_left').attr('src','hot_left.html');
				$('#main_right').attr('src','');
				$('#col2').removeClass('col-lg-12 col-sm-12 col-xs-12 col-md-12').addClass('col-lg-10 col-sm-10 col-xs-10 col-md-10 ');
			} else{
				$('#main_left').show();
				$('#main_left').hide();
				$('#col2').removeClass('col-lg-10 col-sm-10 col-xs-10 col-md-10').addClass('col-lg-12 col-sm-12 col-xs-12 col-md-12');
				$('#main_right').attr('src','hot_right_Dr_spc.html');
			}
			});
		$('#toReport').click(function () {
			$('#main_left').show();
			$('#sC_ExamID').val('');
			$('#main_left').attr('src','rep_left.html');
			$('#main_right').attr('src','rep_right.html');
			$('#col2').removeClass('col-lg-12 col-sm-12 col-xs-12 col-md-12').addClass('col-lg-10 col-sm-10 col-xs-10 col-md-10 ');
		});
		$('#toHospital').click(function () {
			$('#main_left').show();
			$('#main_left').hide();
			$('#col2').removeClass('col-lg-10 col-sm-10 col-xs-10 col-md-10').addClass('col-lg-12 col-sm-12 col-xs-12 col-md-12');
			$('#main_right').attr('src','http://www.lzzyy.com/');
		});
		$('#toUs').click(function () {
			$('#main_left').show();
			$('#main_left').attr('src','main_main_right.html');
			$('#main_right').attr('src','rep_left.html');
			$('#col2').removeClass('col-lg-12 col-sm-12 col-xs-12 col-md-12').addClass('col-lg-10 col-sm-10 col-xs-10 col-md-10 ');
		});
		$('#toGM').click(function () {
			if (ide==1) {
				alert('您没有访问此页面的权限!');
			} else{
				$('#main_left').hide();
				$('#col2').removeClass('col-lg-10 col-sm-10 col-xs-10 col-md-10').addClass('col-lg-12 col-sm-12 col-xs-12 col-md-12');
				$('#main_right').attr('src','hostGM.html');
			}
		})
});
