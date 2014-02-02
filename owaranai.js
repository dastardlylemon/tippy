function getMonth(date) {
  var month = date.getMonth() + 1;
  return month < 10 ? '0' + month : month;
}

function getDate(date) {
  var date = date.getDate();
  return date < 10 ? '0' + date : date;
}

$(document).ready(function() {
  var d = new Date();
  var timestamp = d.getFullYear().toString() + getMonth(d) + getDate(d);
  var json = 'http://cdn-pixiv.lolita.tw/rankings/' + timestamp + '/pixiv_daily.json';

  var items = [];
  var req = $.getJSON('request.php', {url: json}, function(response) {
    $.each(response, function(key, val) {
      items.push("<div class='pxvimg'><a href='" + val['url'] + "'><img src='" + val['img_url'] + "'></a></div>");
    });
  });
  
  req.complete(function() {
  	$("<div/>", {"id": "img-list", html: items.join("")}).appendTo("body").each(function() {
  		$('#img-list').waitForImages(function() {
  			console.log('loaded');
	  		$('#img-list').isotope({
  				itemSelector : '.pxvimg',
  				layoutMode: 'masonry'
	  		});
	  	});
	  });
  });
});
