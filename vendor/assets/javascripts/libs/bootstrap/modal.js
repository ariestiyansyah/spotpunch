/* ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
	'use strict';

	// MODAL CLASS DEFINITION
	// ======================

	var Modal = function (element, options) {
		this.options             = options;
		this.$body               = $(document.body);
		this.$element            = $(element);
		this.$dialog             = this.$element.find('.modal-dialog');
		this.$backdrop           = null;
		this.isShown             = null;
		this.originalBodyPad     = null;
		this.scrollbarWidth      = 0;
		this.ignoreBackdropClick = false;
		if (this.options.remote)
		{
			this.$element
				.find('.modal-content')
				.load(this.options.remote, $.proxy(function () {
					this.$element.trigger('loaded.sp.modal');
					this.adjustDialog();
				}, this));
		}
	};

	Modal.TRANSITION_DURATION = 300;

	Modal.BACKDROP_TRANSITION_DURATION = 150;

	Modal.DEFAULTS = {
		backdrop: true,
		keyboard: true,
		show: true
	};

	Modal.prototype.toggle = function (_relatedTarget) {
		return this.isShown ? this.hide() : this.show(_relatedTarget);
	};

	Modal.prototype.show = function (_relatedTarget) {
		var that = this;
		var e    = $.Event('show.sp.modal', {relatedTarget: _relatedTarget});

		this.$element.trigger(e);

		if (this.isShown || e.isDefaultPrevented())
		{
			return;
		}

		this.isShown = true;

		this.checkScrollbar();
		this.setScrollbar();
		this.$body.addClass('modal-open');

		this.escape();
		this.resize();

		this.$element.on('click.dismiss.sp.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

		this.$dialog.on('mousedown.dismiss.sp.modal', function () {
			that.$element.one('mouseup.dismiss.sp.modal', function (e) {
				if ($(e.target).is(that.$element))
				{
					that.ignoreBackdropClick = true;
				}
			});
		});

		this.backdrop(function () {
			var transition = $.support.transition && that.$element.hasClass('fade');

			if (!that.$element.parent().length)
			{
				that.$element.appendTo(that.$body); // don't move modals dom position
			}

			that.$element
				.show()
				.scrollTop(0);

			that.adjustDialog();

			if (transition) {
				that.$element[0].offsetWidth; // force reflow
			}

			that.$element
				.addClass('in')
				.attr('aria-hidden', false);

			that.enforceFocus();

			var e = $.Event('shown.sp.modal', {relatedTarget: _relatedTarget});

			transition ?
				that.$dialog // wait for modal to slide in
				.one('spTransitionEnd', function () {
					that.$element.trigger('focus').trigger(e);
				})
				.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
				that.$element.trigger('focus').trigger(e);
		});
	};

	Modal.prototype.hide = function (e) {
		if (e)
		{
			e.preventDefault();
		}

		e = $.Event('hide.sp.modal');

		this.$element.trigger(e);

		if (!this.isShown || e.isDefaultPrevented())
		{
			return;
		}

		this.isShown = false;

		this.escape();
		this.resize();

		$(document).off('focusin.sp.modal');

		this.$element
			.removeClass('in')
			.attr('aria-hidden', true)
			.off('click.dismiss.sp.modal')
			.off('mouseup.dismiss.sp.modal');

		this.$dialog.off('mousedown.dismiss.sp.modal');

		$.support.transition && this.$element.hasClass('fade') ?
			this.$element
			.one('spTransitionEnd', $.proxy(this.hideModal, this))
			.emulateTransitionEnd(Modal.TRANSITION_DURATION) :
			this.hideModal();
	};

	Modal.prototype.enforceFocus = function () {
		$(document)
			.off('focusin.sp.modal') // guard against infinite focus loop
			.on('focusin.sp.modal', $.proxy(function (e) {
				if (this.$element[0] !== e.target && !this.$element.has(e.target).length)
				{
					this.$element.trigger('focus');
				}
			}, this));
	};

	Modal.prototype.escape = function () {
		if (this.isShown && this.options.keyboard)
		{
			this.$element.on('keydown.dismiss.sp.modal', $.proxy(function (e) {
				e.which == 27 && this.hide();
			}, this));
		}
		else if (!this.isShown)
		{
			this.$element.off('keydown.dismiss.sp.modal');
		}
	};

	Modal.prototype.resize = function () {
		if (this.isShown)
		{
			$(window).on('resize.sp.modal', $.proxy(this.handleUpdate, this));
		}
		else
		{
			$(window).off('resize.sp.modal');
		}
	};

	Modal.prototype.hideModal = function () {
		var that = this;
		this.$element.hide();
		this.backdrop(function () {
			that.$body.removeClass('modal-open');
			that.resetAdjustments();
			that.resetScrollbar();
			that.$element.trigger('hidden.sp.modal');
		});
	};

	Modal.prototype.removeBackdrop = function () {
		this.$backdrop && this.$backdrop.remove();
		this.$backdrop = null;
	};

	Modal.prototype.backdrop = function (callback) {
		var that    = this;
		var animate = this.$element.hasClass('fade') ? 'fade' : '';

		if (this.isShown && this.options.backdrop) {
			var doAnimate = $.support.transition && animate;

			this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
				.appendTo(this.$body);

			this.$element.on('click.dismiss.sp.modal', $.proxy(function (e) {
				if (this.ignoreBackdropClick)
				{
					this.ignoreBackdropClick = false;
					return;
				}
				if (e.target !== e.currentTarget)
				{
					return;
				}
				this.options.backdrop == 'static'
					? this.$element[0].focus()
					: this.hide();
			}, this));

			if (doAnimate)
			{
				this.$backdrop[0].offsetWidth; // force reflow	
			}

			this.$backdrop.addClass('in');

			if (!callback)
			{
				return;
			}
			doAnimate ?
				this.$backdrop
				.one('spTransitionEnd', callback)
				.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
				callback();
		}
		else if (!this.isShown && this.$backdrop)
		{
			this.$backdrop.removeClass('in');

			var callbackRemove = function () {
				that.removeBackdrop();
				callback && callback();
			};
			$.support.transition && this.$element.hasClass('fade') ?
				this.$backdrop
					.one('spTransitionEnd', callbackRemove)
					.emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION):
					callbackRemove();

		}
		else if (callback)
		{
			callback();
		}
	};

	// these following methods are used to handle overflowing modals

	Modal.prototype.handleUpdate = function () {
		this.adjustDialog();
	};

	Modal.prototype.adjustDialog = function () {
		var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

		if (this.$body.innerHeight() > this.$dialog.innerHeight())
		{
			this.$dialog.css({
				marginTop: Math.max((this.$body.innerHeight() - this.$dialog.innerHeight()) / 2, this.$body.width() > 768 ? 30 : 10)
			});
		}

		this.$element.css({
			paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
			paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
		});
	};

	Modal.prototype.resetAdjustments = function () {
		this.$element.css({
			paddingLeft: '',
			paddingRight: ''
		});
	};

	Modal.prototype.checkScrollbar = function () {
		var fullWindowWidth = window.innerWidth;
		if (!fullWindowWidth)
		{
			// workaround for missing window.innerWidth in IE8
			var documentElementRect = document.documentElement.getBoundingClientRect();
			fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
		}
		this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
		this.scrollbarWidth = this.measureScrollbar();
	};

	Modal.prototype.setScrollbar = function () {
		var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
		this.originalBodyPad = document.body.style.paddingRight || '';
		if (this.bodyIsOverflowing)
		{
			this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
		}
	};

	Modal.prototype.resetScrollbar = function () {
		this.$body.css('padding-right', this.originalBodyPad);
	};

	Modal.prototype.measureScrollbar = function () {
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'modal-scrollbar-measure';
		this.$body.append(scrollDiv);
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		this.$body[0].removeChild(scrollDiv);
		return scrollbarWidth;
	};


	// MODAL PLUGIN DEFINITION
	// =======================
	function Plugin(option, _relatedTarget) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('sp.modal');
			var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);
			if (!data)
			{
				$this.data('sp.modal', (data = new Modal(this, options)));
			}
			if (typeof option == 'string')
			{
				data[option](_relatedTarget);
			}
			else if (options.show)
			{
				data.show(_relatedTarget);
			}
		});
	}

	var old = $.fn.modal;

	$.fn.modal = Plugin;
	$.fn.modal.Constructor = Modal;


	// MODAL NO CONFLICT
	// =================
	$.fn.modal.noConflict = function () {
		$.fn.modal = old;
		return this;
	};


	// MODAL DATA-API
	// ==============
	$(document).on('click.sp.modal.data-api', '[data-toggle="modal"]', function (e) {
		var $this   = $(this);
		var href    = $this.attr('href');
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
		var option  = $target.data('sp.modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data());
		if ($this.is('a'))
		{
			e.preventDefault();
		}
		$target.one('show.sp.modal', function (showEvent) {
			if (showEvent.isDefaultPrevented())
			{
				return; // only register focus restorer if modal will actually get shown
			}
			$target.one('hidden.sp.modal', function () {
				$this.is(':visible') && $this.trigger('focus');
			});
		});
		Plugin.call($target, option, this);
	});
}(jQuery);
