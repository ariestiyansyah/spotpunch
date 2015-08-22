+function ($) {
	'use strict';

	var container = $('.dashboard-container');
	var marginTop = container.css('marginTop');
	$(window).on('load resize', function (e) {
		container.css({
			marginTop: Math.max(($(window).height() - container.height()) / 2, parseInt(marginTop))
		});
		if (e.type == 'load') {
			container.addClass('in');
			setTimeout(function () {
				container.removeClass('fade in');
			}, 3000);
		}
	});

	var canvas = $('.canvas');
	$('#toogle-sidebar').on('click', function (e) {
		e.preventDefault();
		canvas.toggleClass('on');
	});
	$('.content').on('click', function (e) {
		if ($(e.target).parents('#toogle-sidebar').length == 0 && canvas.hasClass('on')) {
			canvas.removeClass('on');
		}
	});

	var shopTab = $('.shop-tab');
	shopTab.find('a[data-toggle="tab"]').on('shown.sp.tab', function (e) {
		var title = $(this).data('title');
		if (title)
		{
			shopTab.find('.shop-menu-title > h3').stop().hide().html(title).fadeIn(250);
		}
	});
}(jQuery);