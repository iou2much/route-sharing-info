
$(function() {
	var BK_URL = "http://10.22.32.15:8170/cn_api";
	// var BK_URL = "http://pin.test.seewo.com/pin/cn_api";
	var BK_URL = "http://ds.seewo.com/dm/pin/cn_api";

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
	$('.role').change(function(){
		var role = $(this).val();
		var txt = ''
		$('.bypass_switch').hide()
		$('#bypass_btn').prop('checked',false)
		
		if(role=='provider'){
			txt = '有几个座位?';
			$('.bypass_switch').show()
		$('.bypass_option').hide()
		}else if(role=='demander'){
			txt = '需要几个座位?';
		}else{
			txt = '物品名称，数量，重量？';
		}
		$('#extra_tip').text(txt)

	});
	$('#bypass_btn').change(function(){
		if($('#bypass_btn:checked').length>0){
			$('.bypass_option').show()
		}else{
			$('.bypass_option').hide()
		}
	})
	$('#datetimepicker1').datetimepicker({
		format: 'YYYY-MM-DD'
	});
	$('#datetimepicker2').datetimepicker({
		format: 'hh:mm A',
	});
	$('#datetimepicker3').datetimepicker({
		format: 'hh:mm A'
	});
	$('#datetimepicker4').datetimepicker({
		format: 'hh:mm A'
	});
	$('#datetimepicker5').datetimepicker({
		format: 'hh:mm A'
	});

	var selected_bypass = {};
	var selected_queue = [];

	var dsts = {
		'cvte1':'CVTE第一产业园',
		'cvte2':'CVTE第二产业园',
		'cvte3':'CVTE第三产业园',
		'cvte4':'CVTE第四产业园',
	}
	$('#save').click(function(){
        if($('.role:checked').length==0){
			alert('请选择角色');
			return;
		}
        if($('.from:checked').length==0){
			alert('请选择出发地');
			return;
		}
        if($('.to:checked').length==0){
			alert('请选择到达地');
			return;
		}
        if($('#account').val()=='联系方式' || $('#account').val()==''){
			alert('请填一下域账号，以便他人联系');
			return;
		}
        if($("#datetimepicker1 input").val()=='出发时间' || $("#datetimepicker1 input").val()==''){
			alert('请填一下日期');
			return;
		}
        if($("#datetimepicker2 input").val()=='出发时间' || $("#datetimepicker2 input").val()==''){
			alert('请填一下出发时间');
			return;
		}
        if($("#datetimepicker3 input").val()=='出发时间' || $("#datetimepicker3 input").val()==''){
			alert('请填一下最迟出发时间');
			return;
		}
		var from = $('#name').val()+'::'+$('#from').val();
		var data = "account="+$('#account').val()+"&role="+$('.role:checked').val()+"&from="+$('.from:checked').val()+"&to="+$('.to:checked').val();
		data += '&date='+$("#datetimepicker1 input").val();
		data += '&start_time='+$('#datetimepicker2 input').val();
		data += '&end_time='+$('#datetimepicker3 input').val();
		data += '&extra_info='+$('#extra_info').val();

		if($('#bypass_btn').prop('checked') && $('.bypass:checked').length > 0){
		    data += '&bypass='+$('.bypass:checked').val();
			if($("#datetimepicker4 input").val()=='出发时间' || $("#datetimepicker4 input").val()==''){
				alert('请填一下途经出发时间');
				return;
			}
			if($("#datetimepicker5 input").val()=='出发时间' || $("#datetimepicker5 input").val()==''){
				alert('请填一下途经最迟出发时间');
				return;
			}
		    data += '&bypass_start_time='+$('#datetimepicker4 input').val();
		    data += '&bypass_end_time='+$('#datetimepicker5 input').val();
		}


		$.ajax({
			url: BK_URL+'/save_info',
			type:"POST",
			data: data,
			dataType: 'json',
			success: function(data){
				if(data['code']==200){
					alert('登记成功,已通过企业微信/邮件通知到与您匹配的相关方(如有)。')
					var role = $('.role:checked').val();
					if('provider' == role){
						role = 'not_provider'
					}else{
						role = 'provider'
					}
					var from = $('.from:checked').val();
					var to = $('.to:checked').val();
					query(role,from,to)
					$('.list-table').show()
					$('.container_inp').hide()
				}
			},
		  });
	})



});
