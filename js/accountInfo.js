var HEIGHT = $(window).height();
	$('body').height(HEIGHT)
    $(window).resize(function() {
        $('body').height(HEIGHT);
    });
