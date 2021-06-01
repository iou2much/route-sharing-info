$(function() {
	// 请求获取章节列表
	$.ajax({
		url: 'http://120.78.231.95/cn_api/get_chapter_name',
		// data: {'id': options},
		dataType: 'json',
		success: function(res){
			//可以在控制台查看打印的data值
			// console.log(res)
			// function receiveText(resultsArray){
			// 	$('#enow').attr('src',resultsArray[0]);
			// }
			var options = "<option>请选择</option>";
			for (var i=0;i<res.length;i++) {
				// options+="<p>" + res[i].chapter_name + "</p>";
				options+="<option value='"+ res[i].chapter_name +"'>" + res[i].chapter_name + "</option>"
			}
			if(!options){
				options="暂无数据";
			}
			// console.log(options)
			$('#slt').html(options);
		},
	  });


	$('#slt').change(function () {

		// 请求获取章节下面的关键词和对应的缩略图
		var chapter_name=$("#slt option:selected").val();
		$.ajax({
			url: 'http://120.78.231.95/cn_api/get_chapter_keyword?chapter_name='+chapter_name,
			dataType: 'json',
			success: function(res){
			//可以在控制台查看打印的data值
			console.log(res)
			// function receiveText(resultsArray){
			// 	$('#enow').attr('src',resultsArray[0]);
			// }
			var options = "<option>请选择</option>";
			for (var i=0;i<res.length;i++) {
				// options+="<p>" + res[i].chapter_name + "</p>";
				options+="<option value='"+ res[i].node_id +"'>" + res[i].node_name + "</option>"
			}
			if(!options){
				options="暂无数据";
			}
			console.log(options)
			$('#slt_unit').html(options);
		},
		// var options=$("#slt option:selected")
		// alert(options.text())
	//	请求接口，返回关键字列表
		});


//	请求接口，返回关键字列表
	});


	$('#slt_unit').change(function () {

		// 请求获取章节下面的关键词和对应的缩略图
		var chapter_name=$("#slt_unit option:selected").val();
		$.ajax({
			url: 'http://120.78.231.95/cn_api/get_img?chapter_name='+chapter_name,
			dataType: 'json',
			success: function(res){
				//可以在控制台查看打印的data值
				// function receiveText(resultsArray){
				// 	$('#enow').attr('src',resultsArray[0]);
				// }
				var imgurl = "";
				for (var i=0;i<res.length;i++) {
					imgurl += "<li>";
					imgurl+= "<img border=\"0\" src=' "+ res[i].img_save_path +"' alt='" + res[i].keyword + "' />"
					// imgurl += "<p>";
					// imgurl += res[i].keyword;
					// imgurl += "</p>";
					imgurl += "</li>";
				}
				if(!imgurl){
					imgurl="暂无数据";
				}

				$('#thumnail_url').html(imgurl);
				$('ul.first').bsPhotoGallery({
					"classes" : "col-xl-3 col-lg-2 col-md-4 col-sm-4",
					"hasModal" : true,
					"shortText" : false  
				});
			},
		  });


		// 请求获取章节下面的关键词和对应的缩略图
	// 	var chapter_name=$("#slt_unit option:selected").val();
	// 	$.ajax({
	// 		url: 'http://120.78.231.95/cn_api/get_node?chapter_name='+chapter_name,
	// 		dataType: 'json',
	// 		success: function(res){
	// 		//可以在控制台查看打印的data值
	// 		console.log(res)
	// 		// function receiveText(resultsArray){
	// 		// 	$('#enow').attr('src',resultsArray[0]);
	// 		// }
	// 		var options = "";
	// 		for (var i=0;i<res.length;i++) {
	// 			// options+="<p>" + res[i].chapter_name + "</p>";
	// 			options+="<option value='"+ res[i].node_id +"'>" + res[i].node_name + "</option>"
	// 		}
	// 		if(!options){
	// 			options="暂无数据";
	// 		}
	// 		console.log(options)
	// 		$('#slt_node').html(options);
	// 	},
	// 	// var options=$("#slt option:selected")
	// 	// alert(options.text())
	// //	请求接口，返回关键字列表
	// 	});


	//	请求接口，返回关键字列表
		});

	$('#btn').click(function(){
		var chapter = $("#slt option:selected ").text();
		var keyword = $("#slt_unit option:selected").text();
		var feedback = $('input[name="图片结果"]:checked').val();
		var timestamp = (new Date()).valueOf();
		save_res =chapter+"^"+keyword +"^"+feedback+"^" +timestamp

	// //	保存文件到本地,post到本地接口
	// 	$.ajax({
	// 		url: 'http://120.78.231.95/cn_api/post_feedback?chapter_name='+save_res,
	// 		type: "POST",
	// 		success: function(res) {
	// 			alert(save_res)
	// 		},
	//
	// });
	});

	});

