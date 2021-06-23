// var BK_URL = "http://10.22.32.15:8170/cn_api";
// var BK_URL = "http://pin.test.seewo.com/pin/cn_api";
var BK_URL = "http://ds.seewo.com/dm/pin/cn_api";
var dsts = {
    'c1':'一产',
    'c2':'二产',
    'c3':'三产',
    'c4':'四产',
}
function query(role,from,to){
    var data = ''
    data += 'role='+role;
    data += '&from='+from;
    data += '&to='+to;

    $.ajax({
    url: BK_URL+'/get_info',
    type:"GET",
    data:data,
    dataType: 'json',
    success: function(res){
        var html = ''
        if(res.length==0){
            html = '<tr><td colspan="4">无匹配信息</td></tr>'
        }
        $('.bypass_col').hide()
        for (var i=0;i<res.length;i++) {
            var from = res[i]['from'];
            var bypass = '';
            var date = res[i]['date'];
            if(res[i]['bypass'] && res[i]['bypass'] != 'undefined'){
                console.log(res[i]['bypass'])
                bypass = res[i]['bypass'];
                bypass = dsts[bypass]
                var start_time = res[i]['bypass_start_time'];
                var end_time = res[i]['bypass_end_time'];
                bypass += '&nbsp;<br/>出发时间:'+date+'&nbsp;<br/>'+start_time+'~'+end_time
            }
            var to = res[i]['to'];
            var who = res[i]['account'];
            var start_time = res[i]['start_time'];
            var end_time = res[i]['end_time'];
            var json = JSON.stringify(res[i])
            var seed = Math.floor(Math.random()*10000);

            html += '<tr onclick="show_extra(this,\''+res[i]['account']+'_'+seed+'\')" >'
            html += '<td>'+dsts[from] +'&nbsp;<br/>出发时间:'+date+'&nbsp;<br/>'+start_time+'~'+end_time+'</td>';
            if(bypass!=''){
                html += '<td>'+bypass+'</td>';
                $('.bypass_col').show()
            }
            html += '<td>'+dsts[to]+'</td>';
            html += '<td>'+who+'</td>';
            html += '<td><a href="javascript:void(0)">查看备注</a></td>';
            html += '</tr>'
            html += '<tr style="display:none;" class="'+res[i]['account']+'_'+seed+'"><td colspan="4">备注信息：'+res[i]['extra_info']+'</td></tr>'
        }
        $('#info-list').html(html)

        console.log('done')

        },
    });
}
function show_extra(e,cls){
    $('.'+cls).toggle()
    $('.'+cls).toggleClass('focus-info')
    $(e).toggleClass('focus-info')
}
