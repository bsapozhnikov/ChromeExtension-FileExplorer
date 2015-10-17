var sortableRows = function(){
    $('.header td').toggleClass('sortDown')
	.append('<div class="sortArrow"></div>');
    
    $('.header td').click(function(e){
	var sortDir = $(e.target).hasClass('sortDown') ? 1 : -1;
	$(e.target).toggleClass('sortDown');
	$(e.target).find('.sortArrow').html( $(e.target).hasClass('sortDown') ? '<div class="arrowDown"></div>' : '<div class="arrowUp"></div>');
	var keyIndex = $(e.target).index();
	$('tr').children().eq(keyIndex).css('background-color','#ccd');
	$('tr').children().eq((keyIndex+1)%3).css('background-color','#eef').find('.sortArrow').html("");
	$('tr').children().eq((keyIndex+2)%3).css('background-color','#eef').find('.sortArrow').html("");
	var rows = $('tr').slice(1);
	/* Modified from Kai's response on http://stackoverflow.com/questions/3156851/using-jquery-how-do-you-reorder-rows-in-a-table-based-on-a-tr-attribute */
	rows.sort(function(a,b){
	    var keyA = $(a).children().eq(keyIndex).text();
	    var keyB = $(b).children().eq(keyIndex).text();
	    if (keyA=='') return 0-sortDir;
	    if (keyB=='') return sortDir;
	    switch(keyIndex){
	    case 0:
		return keyA.localeCompare(keyB)*sortDir;
		break;
	    case 1:
		var keyToVal = function(k){
		    var exps = {'GB':30,'MB':20,'kB':10,'B':0};
		    var L = k.split(' ');
		    var base = parseFloat(L[0]);
		    var exp = exps[L[1]];
		    return base*Math.pow(2,exp);
		};
		var valA = keyToVal(keyA);
		var valB = keyToVal(keyB);
		if (valA < valB) return 0-sortDir;
		if (valA > valB) return sortDir;
		return 0;
		break;
	    case 2:
		var keyToDateString = function(k){
		    var DayTimeSplit = k.split(',');
		    var MMDDYY = DayTimeSplit[0].split('/');
		    var time = DayTimeSplit[1].split(':');
		    var month = ('0'+MMDDYY[0]).slice(-2);
		    var day = ('0'+MMDDYY[1]).slice(-2);
		    var year = MMDDYY[2];
		    var hour = parseInt(time[0]);
		    var minute = ('0'+time[1]).slice(-2);
		    var second = ('0'+time[2].split(' ')[0]).slice(-2);
		    if (time[2].slice(-2)=='PM') hour+=12;
		    hour = ('0'+hour).slice(-2);
		    return year+month+day+hour+minute+second;
		};
		var dateA = keyToDateString(keyA);
		var dateB = keyToDateString(keyB);
		if (dateA < dateB) return 0-sortDir;
		if (dateA > dateB) return sortDir;
		return 0;
		break;
	    }
	});
	$.each(rows,function(index,row){
	    $('table').children('tbody').append(row);
	});
    });
};

var clickablePath = function(){
    var path = $('#header').text().replace('Index of ','').split('\\');
    var curPath = '';
    for(var i=0; i<path.length-1; i++){
	curPath+=path[i]+'/';
	path[i]='<a class="headerLink" href="'+curPath+'">'+path[i]+'</a>';
    }
    $('#header').html('Index of '+path.join('\\'));
};

var searchBar = function(){
    $('#header').append('<div id="search"><input type="text" id="query" placeholder="Search"></input></div>');
    $('#query').on('keydown change blur paste input',function(){
	var q = $(this).val();
	console.log(q);
	var rows = $('tr').slice(1);
	rows.hide();
	$.each(rows,function(index,row){
	    if($(row).children().eq(0).text().toLowerCase().indexOf(q.toLowerCase())>-1){
		//$('table').children('tbody').append(row);
		$(row).show();
	    }
	});
    });
    $('#query').focus();
};

$(document).ready(function(){
    sortableRows();
    clickablePath();
    searchBar();
});
