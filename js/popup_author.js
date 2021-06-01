
$(function() {
	var BK_URL = "http://10.22.32.13:6080";
	var start = 0;
	$.ajax({
		url: BK_URL+'/get_author',
		dataType: 'json',
		success: function(data){
			var html = '<option value="">请选择</option>';
			for (var i=0;i<data.length;i++) {
				html += '<option value="'+data[i]['author_id']+'">'+data[i]['type']+'--'+data[i]['author']+'</option>'
			}

			$("#slt_unit").html(html)

		},
	  });
	$(document).scroll(function() {
		//var height = document.getElementById("divData").offsetHeight;//250
		//var height=$("#divData").height();//250
		var scrollHeight = $(document).height();//251
		var scrollTop = $(document).scrollTop() ;//0-18
		var clientHeight = window.innerHeight;//233
	
		if (scrollHeight - clientHeight == scrollTop) {
			//滚动条滚到最底部
			var param=$("#slt_unit option:selected").val();
			start += 100
			get_data(param,start)

		}
	})
	function get_data(param,start){
		$('#loading').show()
		$('#end').hide()
		$.ajax({
			url: BK_URL+'/get_by_author_id?author_id='+param+'&start='+start,
			dataType: 'json',
			success: function(data){
				//可以在控制台查看打印的data值
				// function receiveText(resultsArray){
				// 	$('#enow').attr('src',resultsArray[0]);
				// }
				var imgurl = "";
				var res = data['files']
				// console.log(res)
				if(res.length==0){
					// alert('本科本学段看完啦')
					$('#end').show()
					$('#loading').hide()

					return;

				}
				$('#cnt').text('共 '+data['count']+' 份课件,老师可能来自:  '+res[0]['school'])
				for (var i=0;i<res.length;i++) {
					imgurl += "<li>";
					var row = res[i];
					var file = row['file'];
					// var label = res[i]['label'];
					imgurl += "<img border=\"0\" src=' "+ BK_URL + row['file'] +"' />";
					// var c_info = file.split('/')[2].split('.')[0].split('_');
					// imgurl += "<p><a onclick='return false;' target='_blank' href='"+BK_URL+"/decode?cid="+c_info[0]+"&version="+c_info[1]+"'>打开课件</a></p>";
					imgurl += "<p><a target='_blank' href='"+BK_URL+"/decode?cid="+row['id']+"&version="+row['version']+"'>"+row['name']+"</a>";
					// imgurl += '<span>标签 ： '+label+'</span></p>'
					imgurl += "</li>";
				}
				if(!imgurl){
					imgurl="暂无数据";
				}

				$('#thumnail_url').html($('#thumnail_url').html()+imgurl);
				$('ul.first').bsPhotoGallery({
					"classes" : "col-xl-3 col-lg-2 col-md-4 col-sm-4",
					"hasModal" : true,
					"shortText" : false  
				});
			},
		  });

	}
	
	$('#slt_unit').change(function () {

		// 请求获取章节下面的关键词和对应的缩略图
		$('#thumnail_url').html('');
		var param=$("#slt_unit option:selected").val();
		start = 0
		get_data(param,start)

		});

});
