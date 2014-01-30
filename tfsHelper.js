/*
 * tfsHelper.js
 *
 * Chrome extension to provide a number of added functionalities to TFS web interface
 *
 * 1. Converting test case audit logs to readable html in-place
 * 2. Replacing iteration params with their actual params
 * 3. Inseting a diff of test step audit logs
 */
var title = "";
var found = 0;
var ht = [];
var pageTitle = document.title;


if(pageTitle === "Microsoft Test Runner") {
    setInterval(function() { 
        if(title === null || title === '') {
            title = $('.mtr-navigation-dropdown').attr("title");
            parse();
        }
        else if(title !== $('.mtr-navigation-dropdown').attr("title")){
            title = $('.mtr-navigation-dropdown').attr("title");
            parse();
        }
        else
            return;

    }, 1000);
}


if(pageTitle.indexOf("Microsoft Team Foundation Server") != -1){
    setInterval(function() { 
        if($('tfs-collapsible-content') !== null) {
            findHtml();
            findParams();

            $('.seen td:nth-child(3):not(.original)').each(function() {    
                replaceHtml($(this));
                $(this).addClass('original');
            });

            $('.seen td:nth-child(2):not(.changed)').each(function() {
                replaceHtml($(this));
                $(this).addClass('changed');
            });

            $('.seenParam td:nth-child(3):not(.original)').each(function() {    
                replaceHtml($(this));
                $(this).addClass('original');
            });

            $('.seenParam td:nth-child(2):not(.changed)').each(function() {
                replaceHtml($(this));
                $(this).addClass('changed');
            });


            $('.seen').each(function() {
                if(!$(this).hasClass('diffed')) {
                    $(this).parent().append("<tr>/tr>")
                    $(this).append('<td class="diff" style="display:none;"></td>');
                    $(this).prettyTextDiff({
                        cleanup: 'true'
                    });
                    $(this).addClass('diffed');
            
                    $(this).next().html("<td colspan='3' class='diffResult'>" + $(this).children('.diff').html() + "</td>");
                }
            });

            $('.seenParam').each(function() {
                if(!$(this).hasClass('diffed')) {
                    $(this).parent().append("<tr>/tr>")
                    $(this).append('<td class="diff" style="display:none;"></td>');
                    $(this).prettyTextDiff({
                        cleanup: 'true'
                    });
                    $(this).addClass('diffed');
     
                    $(this).next().html("<td colspan='3' class='diffResult'>" + $(this).children('.diff').html() + "</td>");
                }
            });
        }

    }, 1000);
}

function parse() {
	var arrLength = 0;
	var items = {};
	var varName = [];
	var varValue = [];
    var content = "";
    var count = 0;
	$('.test-step-parameter-name').each(function() {
		if($.inArray($(this).text(),varName) === -1) {
            varName.push($(this).text());
            arrLength++;
        }
	});

	$('.test-step-parameter-value').each(function() {
		if($.inArray($(this).text(),varValue) === -1) 
            varValue.push($(this).text());
	});


	$('.stepResults-detail-column').each(function() {
		content = $(this).html();

        for(var i = 0; i < arrLength; i++) {
			content = content.replaceAll("@" + varName[i],'<font title=\"' + varName[i] + '\"><i> ' + varValue[i]+ " </i></font>")
        }
        $(this).html(content);
	});
    
}

function findHtml() {
	$('.detail-list td:not(.seen)').each(function() {

    	if($(this).text() === 'Steps') {
       		found = 1;
       		$(this).parent().addClass("seen") 
       	}
	});

	found = 0;
}

function findParams() {
    $('.detail-list td:not(.seen)').each(function() {

        if($(this).text() === 'Local Data Source') {
            found = 1;
            $(this).parent().addClass("seenParam") 
        }
    });

    found = 0;
}


function replaceHtml(item) {
	if(item.hasClass('processed'))
		return;

	item.html($('<div/>').html(item.html()).text());
	item.addClass('processed');
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
   return this.replace(new RegExp(str1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), str2);
};
