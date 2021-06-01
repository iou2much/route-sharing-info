
$(function() {
	//var BK_URL = "http://10.22.32.13:6071";
	var BK_URL = "http://120.78.231.95/cn_api";
	var start = 0;
   //基本地图加载
	window.map = new AMap.Map("container", {
		resizeEnable: true,
		// center: [116.397428, 39.90923],//地图中心点
		zoom: 13 //地图显示的缩放级别
	});
	//构造路线导航类
	var driving = new AMap.Driving({
		map: map,
		// panel: "panel"
	}); 
	// 根据起终点名称规划驾车导航路线

	$('.inp').focus(function(){
		if($(this).val() == $(this).attr('tip')){
			$(this).val('');
		}
	});
	$('.inp').blur(function(){
		if($(this).val() == ''){
			$(this).val($(this).attr('tip'))
		}
	})

	$('#to').change(function(){
		$.ajax({
			url: BK_URL+'/get_info',
			type:"GET",
			data:"to="+$('#to').val(),
			// data:"name="+$('#name').val()+"&role="+$('#role').val()+"&from="+$('#from').val()+"&to="+$('#to').val(),
			dataType: 'json',
			success: function(res){
				var html = ''
				for (var i=0;i<res.length;i++) {
					html += '<option value="'+res[i]['from']+'">'+res[i]['from']+'</option>'
				}
				$('.selectpicker').html(html)
				$('.selectpicker').selectpicker('refresh');

				console.log('done')
	
			},
		});
	});
	var dsts = {
		'cvte1':'CVTE第一产业园',
		'cvte2':'CVTE第二产业园',
		'cvte3':'CVTE第三产业园',
		'cvte4':'CVTE第四产业园',
	}
	$('#search').click(function(){
		var city = '广州';
		var path = [{'keyword':$('#from').val(),'city':city}];
		var dst = dsts[$('#to').val()]
		var passby = $('.selectpicker').val();
		for(var i=0;i<passby.length;i++){

			var dot = passby[i].split('::')[1];
			if(!dot){
				continue;
			}
			path.push({'keyword':dot,'city':city})
		}

		path.push({'keyword':dst,'city':city})
		console.log(path)
		driving.search(path, function(status, result) {
			// result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
			if (status === 'complete') {
				log.success('绘制驾车路线完成')
			} else {
				log.error('获取驾车数据失败：' + result)
			}
		});	
	})
	$('#save').click(function(){
             if($('#name').val()=='联系方式'){alert('请填一下名字或联系方式，以便他人联系');return;}
		var from = $('#name').val()+'::'+$('#from').val();
		var data = "name="+$('#name').val()+"&role="+$('.role:checked').val()+"&from="+from+"&to="+$('#to').val();
		if($('.role:checked').val()=='provider'){
			var bp = $('#bypass option:checked');
			for(var i=0;i<bp.length;i++){
				data += '&bypass='+$(bp[i]).val().split('::')[0];
			}

		}
		$.ajax({
			url: BK_URL+'/save_info',
			type:"POST",
			data: data,
			dataType: 'json',
			success: function(data){
				if(data['code']==200){
					alert('登记成功')
				}
			},
		  });
	})



});
