
$(function() {
	// var BK_URL = "http://10.22.32.15:6070/cn_api";
	var BK_URL = "http://120.78.231.95/cn_api";
	var start = 0;
	var markers_cache = [];
	var provider_markers_cache = [];

   //基本地图加载
	window.map = new AMap.Map("container", {
		resizeEnable: true,
		center: [113.399606,23.192359],//地图中心点
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
	});
	function get_bypass_list(dst){
		if(map){
			map.remove(markers_cache);

		}
		$.ajax({
			url: BK_URL+'/get_info',
			type:"GET",
			data:"to="+dst,
			// data:"name="+$('#name').val()+"&role="+$('#role').val()+"&from="+$('#from').val()+"&to="+$('#to').val(),
			dataType: 'json',
			success: function(res){
				var html = ''
				var locs = [];
				var markerList = []
				for (var i=0;i<res.length;i++) {
					var from = res[i]['from'];

					var time = '';
					if(res[i]['extra']){
						time = '  /  ' + res[i]['extra'];
					}
					html += '<option value="'+res[i]['from']+'">'+res[i]['from']+time+'</option>'
					if(res[i]['loc']){
						var loc = res[i]['loc'].split(',');
						locs.push(loc[0],loc[1])
						// var marker = new AMap.Marker({
						// 	position: new AMap.LngLat(loc[0],loc[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
						// 	// title: '北京'
						// });
						// markerList.push(marker);
						// console.log(from.split('::')[0]);
						var text = new AMap.Text({
							text:from.split('::')[0],
							anchor:'center', // 设置文本标记锚点
							draggable:true,
							cursor:'pointer',
							angle:10,
							style:{
								'padding': '0.25rem 0.25rem',
								'margin-bottom': '1rem',
								'border-radius': '.25rem',
								'background-color': 'red',
								'width': '5rem',
								'border-width': 0,
								'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
								'text-align': 'center',
								'font-size': '8px',
								'color': 'white'
							},
							position: loc
						});
					
						text.setMap(map);
						markers_cache.push(text)
						  
					}
				}
				$('.selectpicker').html(html)
				$('.selectpicker').selectpicker('refresh');
				selected_bypass = {};


				
				// 将创建的点标记添加到已有的地图实例：
				map.add(markerList);
		
				console.log('done')
	
			},
		});
		
		if($('#display_provider').is(':checked')){
			get_provider_info(dst)
		}
	}
	var selected_bypass = {};
	var selected_queue = [];
	$('.selectpicker').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
		// var selected = $(e.currentTarget).val();
		if(newValue){
			selected_queue.push(clickedIndex)
			var o = $($('.selectpicker option')[clickedIndex]).val();
			selected_bypass[clickedIndex] = o;
		}else{
			selected_queue.splice(selected_queue.indexOf(clickedIndex),1)
		}

		console.log(clickedIndex)
		console.log(selected_queue)
		// console.log(newValue)
		// console.log(oldValue)
	});

	$('#to').change(function(){
		get_bypass_list($('#to').val())
	});

	get_bypass_list('cvte1');

	function get_provider_info(dst){
		if(map){
			map.remove(provider_markers_cache);
		}
		$.ajax({
			url: BK_URL+'/get_provider_info',
			type:"GET",
			data:"to="+dst,
			dataType: 'json',
			success: function(res){
				var html = ''
				var locs = [];
				var markerList = []
				for (var i=0;i<res.length;i++) {
					var from = res[i]['from'];

					// html += '<option value="'+res[i]['from']+'">'+res[i]['from']+'</option>'
					if(res[i]['loc']){
						var loc = res[i]['loc'].split(',');
						locs.push(loc[0],loc[1])
						// var marker = new AMap.Marker({
						// 	position: new AMap.LngLat(loc[0],loc[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
						// 	// title: '北京'
						// });
						// markerList.push(marker);
						// console.log(from.split('::')[0]);
						var text = new AMap.Text({
							text:from.split('::')[0],
							anchor:'center', // 设置文本标记锚点
							draggable:true,
							cursor:'pointer',
							angle:10,
							style:{
								'padding': '0.25rem 0.25rem',
								'margin-bottom': '1rem',
								'border-radius': '.25rem',
								'background-color': 'blue',
								'width': '6rem',
								'border-width': 0,
								'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
								'text-align': 'center',
								'font-size': '8px',
								'color': 'white'
							},
							position: loc
						});
					
						text.setMap(map);
						provider_markers_cache.push(text)
						  
					}
				}

				// 将创建的点标记添加到已有的地图实例：
				map.add(markerList);
		
	
			},
		});
	}
	$('#display_provider').change(function(){
		if($(this).is(':checked')){
			get_provider_info($('#to').val())
		}else{
			map.remove(provider_markers_cache);
			// get_bypass_list($('#to').val());
		}
	})
	//get_provider_info($('#to').val());
	var dsts = {
		'cvte1':'CVTE第一产业园',
		'cvte2':'CVTE第二产业园',
		'cvte3':'CVTE第三产业园',
		'cvte4':'CVTE第四产业园',
	}
	$('#search').click(function(){
        if($('#from').val().trim() == '始发地'){
			alert('请填一下始发地');
			return;
		}
		var city = '广州';
		var path = [{'keyword':$('#from').val(),'city':city}];
		var dst = dsts[$('#to').val()]

		var passby = [];
		for(var i=0;i<selected_queue.length;i++){
			passby.push(selected_bypass[selected_queue[i]])
		}
		if(passby.length>4){
			alert('至多选择四个途经点')
		}
		for(var i=0;i<passby.length;i++){

			var dot = passby[i].split('::')[1];
			if(!dot){
				continue;
			}
			path.push({'keyword':dot,'city':city})
		}

		path.push({'keyword':dst,'city':city})
		var path_info = '';
		for(var i=0;i<path.length;i++){
			if(path_info){
				path_info += ' -> ';
			}
			path_info += path[i]['keyword']
		}
		$('#path-info').text(path_info)
		// console.log(path)
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
        if($('#name').val()=='联系方式' || $('#name').val()==''){
			alert('请填一下名字或联系方式，以便他人联系');
			return;
		}
        if($('#from').val()=='\b\b始发地' || $('#from').val()==''){
			alert('请填一下始发地');
			return;
		}
        if($('#extra').val()=='出发时间' || $('#extra').val()==''){
			alert('请填一下出发时间');
			return;
		}
		var from = $('#name').val()+'::'+$('#from').val();
		var data = "name="+$('#name').val()+"&role="+$('.role:checked').val()+"&from="+from+"&to="+$('#to').val();
		data += '&extra='+$('#extra').val();
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
