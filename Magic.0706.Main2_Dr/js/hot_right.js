	var hotIn=new Array();
	var b='0000_5';  //默认调色板
		
	$(document).ready(function () {
		gethotin();
		insertItem(hotIn);
		get_finals(hotIn,b);
		//console.log(hotIn);
		
		var swiper=new Swiper('.swiper-container',{
				direction:'horizontal',
				
				pagination:'.swiper-pagination',
				
				nextButton:'.swiper-button-next',
				prevButton:'.swiper-button-prev',
				
		});
	});
	
	//根据得到的检查地址数量动态插入轮播项目，传入参数a为地址数组
	function insertItem (a) {
		
		var str='';
		for (var i=0;i<a.length;i++) {
			var str='';
				str+='<div id="'+i+'" class="swiper-slide">';
				str+='<canvas id="showCAV'+i+'" width="" height="" onclick="toDetail('+i+')" style="width:100%;height:100%;">';
				str+='</canvas>';
				str+='</div>';
				$('.swiper-wrapper').prepend(str);
		}
	};
	
	//从服务器批量获取canvas，并显示在对应的canvas中，需要参数，a为地址数组，b为默认调色板（在查看热图详情时调色板才可选)
	function get_finals (a,b) {
		for (var i=0;i<a.length;i++) {
			get_final(a[i],b,'showCAV'+i);
			
		}
	};
	
	//根据点击的不同选择不同的地址进行ajax请求,需要参数：a为地址，b为下拉框获取的调色板，c为要写到的地方的ID
	function get_final (a,b,c) {
		//console.log(a);
		aj1(a);
		aj2(b);
		var rgbDATA=GetRender(TrawData,TnGlobalMax,TnGlobalMin,TPalette);
		draw16(c,rgbDATA);
	};
	
	//获取保存在cookie里的地址数组
	function gethotin () {
		var _a=$.cookie('ID_len');
		_a=Number(_a);
		for (var i=0;i<_a;i++) {
			var _b=$.cookie('detail_ID'+i);
			hotIn.push(_b);
		}
	}