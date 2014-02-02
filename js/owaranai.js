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

var defaultRanking = "Daily";

function loadOptions() {
	var ranking = localStorage["rankingType"];
	if (ranking == undefined) {
		ranking = defaultRanking;
	}
	
	$('input[name=pgata]:radio').each(function(i, d) {
		if (d['value'] == ranking) {
			d.checked = true;
		}
	});
}

function saveOptions() {
	$('input[name=pgata]:radio').each(function(i, d) {
		if (d.checked == true) {
			localStorage["rankingType"] = d['value'];
		}
	});
}

function loadImages(ranking) {
	var rurl;
	switch(ranking) {
		case 'Daily':
			rurl = '/pixiv_daily.json';
		break;
		case 'Weekly':
			rurl = '/pixiv_weekly.json';
		break;
		case 'Monthly':
			rurl = '/pixiv_monthly.json';
		break;
		case 'Rookie':
			rurl = '/pixiv_rookie.json';
		break;
		case 'Original':
			rurl = '/pixiv_original.json';
		break;
		default: 
			rurl = '/pixiv_daily.json';
		break;
	}

	var d = new Date();
	var timestamp = d.getFullYear().toString() + getMonth(d) + getDate(d);
  var json = 'http://cdn-pixiv.lolita.tw/rankings/' + timestamp + rurl;

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
  
  $('#loader').fadeIn(400);
  $('#content').fadeOut(400);
  $('#content').empty();
  $('#content').fadeIn(400);
  
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
}

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

$(document).ready(function() {
	startTime();
	loadOptions();

  var d = new Date();
  $('#date').text(days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate());
  $('#time').fadeIn(1000);
  $('#date').fadeIn(1000);
  
  loadImages(localStorage["rankingType"]);
  
  $('#settings').click(function() {
  	$('#sp-wrapper').fadeIn(400);
  	$('#blackout').fadeIn(400);
  });
  
  $('#dismiss').click(function() {
  	$('#sp-wrapper').fadeOut(400);
  	$('#blackout').fadeOut(400);
  });
  
  $('input[type="radio"]').click(function(){
    saveOptions();
    loadImages(localStorage["rankingType"]);
  });
});
