+function ($) {
	'use strict';
	var Dashboard = function () {
		var $this = this;
		$this.container = $('.dashboard-container');
		$this.default   = $this.container.css('marginTop');
		$(window).on('load resize', function () {
			$this.container.css({
				marginTop: Math.max(($(window).height() - $this.container.height()) / 2, parseInt($this.default))
			}).addClass('in');
		});
		setTimeout(function () {
			$this.container.removeClass('fade in');
		}, 3000);
	};

	$(function () {
		new Dashboard();
	});
}(jQuery);
