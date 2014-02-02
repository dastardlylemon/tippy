function formatTime(i) {
	return i < 10 ? '0' + i : i;
}

function getMonth(d) {
  var month = d.getMonth() + 1;
  return formatTime(month);
}

function getDate(d) {
  var date = d.getDate();
  return formatTime(date);
}

function startTime() {
	var d = new Date();
	var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
	h = formatTime(h);
	m = formatTime(m);
	s = formatTime(s);
  $('#time').text(h + " " + m + " " + s);
	t = setTimeout(function(){startTime()},500);
}

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

$(document).ready(function() {
	startTime();

  var d = new Date();
  $('#date').text(days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate());
  $('#time').fadeIn(1000);
  $('#date').fadeIn(1000);
  
  var timestamp = d.getFullYear().toString() + getMonth(d) + getDate(d);
  var json = 'http://cdn-pixiv.lolita.tw/rankings/' + timestamp + '/pixiv_daily.json';

  var items = [];
  var req = $.getJSON(json, function(response) {
  	var i = 0;
    $.each(response, function(key, val) {
    	if (i < 30) {
      	items.push("<div style='display: none' class='pxvimg'><a href='" + val['url'] + "'><img src='" + val['img_url'] + "'></a></div>");
      	i++;
      }
    });
  });
  
  req.complete(function() {
  	$("<div/>", {"id": "img-list", html: items.join("")}).appendTo("#content").each(function() {
  		$('#img-list').waitForImages(function() {
  			$('#loader').fadeOut(400);
	  		$('#img-list').isotope({
  				itemSelector : '.pxvimg',
	  		});
	  		
	  		$('.pxvimg').each(function(index) {
    			$(this).delay(100*index).fadeIn(400);
				});
	  	});
	  });
  });
});
