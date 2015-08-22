/*
 *  Base on jQuery OwslCarousel
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owslgraphic.com/owslcarousel/
 */

+function ($) {
	'use strict';

	// CAROUSEL CLASS DEFINITION
	// =========================

	var Carousel = function (element, options) {
		var base     = this;
		base.$elem   = $(element);
		base.options = options;
		base.loadContent();
	};

	Carousel.prototype.loadContent = function () {
		var base = this;
		var url;
		function getData(data) {
			var i, content = "";
			if (typeof base.options.jsonSuccess === "function") {
				base.options.jsonSuccess.apply(this, [data]);
			} else {
				for (i in data.carousel) {
					if (data.carousel.hasOwnProperty(i)) {
						content += data.carousel[i].item;
					}
				}
				base.$elem.html(content);
			}
			base.logIn();
		}
		if (typeof base.options.beforeInit === "function") {
			base.options.beforeInit.apply(this, [base.$elem]);
		}
		if (typeof base.options.jsonPath === "string") {
			url = base.options.jsonPath;
			$.getJSON(url, getData);
		} else {
			base.logIn();
		}
	};

	Carousel.prototype.logIn = function () {
		var base = this;
		base.$elem.data("sp.carousel.originalStyles", base.$elem.attr("style"));
		base.$elem.data("sp.carousel.originalClasses", base.$elem.attr("class"));
		base.$elem.css({opacity: 0});
		base.orignalItems = base.options.items;
		base.checkBrowser();
		base.wrapperWidth = 0;
		base.checkVisible = null;
		base.setVars();
	};

	Carousel.prototype.checkBrowser = function () {
		var base        = this,
			translate3D = "translate3d(0px, 0px, 0px)",
			tempElem    = document.createElement("div"),
			regex,
			asSupport,
			support3d,
			isTouch;
		tempElem.style.cssText = "  -moz-transform:" + translate3D +
			"; -ms-transform:" + translate3D +
			"; -o-transform:" + translate3D +
			"; -webkit-transform:" + translate3D +
			"; transform:" + translate3D;
		regex     = /translate3d\(0px, 0px, 0px\)/g;
		asSupport = tempElem.style.cssText.match(regex);
		support3d = (asSupport !== null && asSupport.length === 1);
		isTouch   = "ontouchstart" in window || window.navigator.msMaxTouchPoints;
		base.browser = {
			"support3d" : support3d,
			"isTouch"   : isTouch
		};
	};

	Carousel.prototype.setVars = function () {
		var base = this;
		if (base.$elem.children().length === 0) {
			return false;
		}
		base.baseClass();
		base.eventTypes();
		base.$userItems       = base.$elem.children();
		base.itemsAmount      = base.$userItems.length;
		base.wrapItems();
		base.$carouselItems   = base.$elem.find(".carousel-item");
		base.$carouselWrapper = base.$elem.find(".carousel-wrapper");
		base.playDirection    = "next";
		base.prevItem         = 0;
		base.prevArr          = [0];
		base.currentItem      = 0;
		base.customEvents();
		base.onStartup();
	};

	Carousel.prototype.updateVars = function () {
		var base = this;
		if (typeof base.options.beforeUpdate === "function") {
			base.options.beforeUpdate.apply(this, [base.$elem]);
		}
		base.watchVisibility();
		base.updateItems();
		base.calculateAll();
		base.updatePosition();
		base.updateControls();
		base.eachMoveUpdate();
		if (typeof base.options.afterUpdate === "function") {
			base.options.afterUpdate.apply(this, [base.$elem]);
		}
	};

	Carousel.prototype.updatePosition = function () {
		var base = this;
		base.jumpTo(base.currentItem);
		if (base.options.autoPlay !== false) {
			base.checkAp();
		}
	};

	Carousel.prototype.baseClass = function () {
		var base          = this,
			hasBaseClass  = base.$elem.hasClass(base.options.baseClass),
			hasThemeClass = base.$elem.hasClass(base.options.theme);
		if (!hasBaseClass) {
			base.$elem.addClass(base.options.baseClass);
		}
		if (!hasThemeClass) {
			base.$elem.addClass(base.options.theme);
		}
	};

	Carousel.prototype.onStartup = function () {
		var base = this;
		base.updateItems();
		base.calculateAll();
		base.buildControls();
		base.updateControls();
		base.response();
		base.moveEvents();
		base.stopOnHover();
		base.carouselStatus();
		if (base.options.transitionStyle !== false) {
			base.transitionTypes(base.options.transitionStyle);
		}
		if (base.options.autoPlay === true) {
			base.options.autoPlay = 5000;
		}
		base.play();
		base.$elem.find(".carousel-wrapper").css("display", "block");
		if (!base.$elem.is(":visible")) {
			base.watchVisibility();
		} else {
			base.$elem.css("opacity", 1);
		}
		base.onstartup = false;
		base.eachMoveUpdate();
		if (typeof base.options.afterInit === "function") {
			base.options.afterInit.apply(this, [base.$elem]);
		}
	};

	Carousel.prototype.carouselStatus = function () {
		var base = this;
		base.carousel = {
			"userOptions"  : base.userOptions,
			"baseElement"  : base.$elem,
			"userItems"    : base.$userItems,
			"carouselItems": base.$carouselItems,
			"currentItem"  : base.currentItem,
			"prevItem"     : base.prevItem,
			"visibleItems" : base.visibleItems,
			"isTouch"      : base.browser.isTouch,
			"browser"      : base.browser,
			"dragDirection": base.dragDirection
		};
	};

	Carousel.prototype.response = function () {
		var base = this,
			smallDelay,
			lastWindowWidth;
		if (base.options.responsive !== true) {
			return false;
		}
		lastWindowWidth = $(window).width();
		base.resizer = function () {
			if ($(window).width() !== lastWindowWidth) {
				if (base.options.autoPlay !== false) {
					window.clearInterval(base.autoPlayInterval);
				}
				window.clearTimeout(smallDelay);
				smallDelay = window.setTimeout(function () {
					lastWindowWidth = $(window).width();
					base.updateVars();
				}, base.options.responsiveRefreshRate);
			}
		};
		$(window).resize(base.resizer);
	};

	Carousel.prototype.reload = function () {
		var base = this;
		window.setTimeout(function () {
			base.updateVars();
		}, 0);
	};

	Carousel.prototype.watchVisibility = function () {
		var base = this;
		if (base.$elem.is(":visible") === false) {
			base.$elem.css({opacity: 0});
			window.clearInterval(base.autoPlayInterval);
			window.clearInterval(base.checkVisible);
		} else {
			return false;
		}
		base.checkVisible = window.setInterval(function () {
			if (base.$elem.is(":visible")) {
				base.reload();
				base.$elem.animate({opacity: 1}, 200);
				window.clearInterval(base.checkVisible);
			}
		}, 500);
	};

	Carousel.prototype.eachMoveUpdate = function () {
		var base = this;
		if (base.options.lazyLoad === true) {
			base.lazyLoad();
		}
		if (base.options.autoHeight === true) {
			base.autoHeight();
		}
		base.onVisibleItems();
		if (typeof base.options.afterAction === "function") {
			base.options.afterAction.apply(this, [base.$elem]);
		}
	};

	Carousel.prototype.eventTypes = function () {
		var base  = this,
			types = ["s", "e", "x"];
		base.ev_types = {};
		if (base.options.mouseDrag === true && base.options.touchDrag === true) {
			types = [
				"touchstart.carousel mousedown.carousel",
				"touchmove.carousel mousemove.carousel",
				"touchend.carousel touchcancel.carousel mouseup.carousel"
			];
		} else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
			types = [
				"touchstart.carousel",
				"touchmove.carousel",
				"touchend.carousel touchcancel.carousel"
			];
		} else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
			types = [
				"mousedown.carousel",
				"mousemove.carousel",
				"mouseup.carousel"
			];
		}
		base.ev_types.start = types[0];
		base.ev_types.move  = types[1];
		base.ev_types.end   = types[2];
	};

	Carousel.prototype.customEvents = function () {
		var base = this;
		base.$elem.on("carousel.next", function () {
			base.next();
		});
		base.$elem.on("carousel.prev", function () {
			base.prev();
		});
		base.$elem.on("carousel.play", function (event, speed) {
			base.options.autoPlay = speed;
			base.play();
			base.hoverStatus = "play";
		});
		base.$elem.on("carousel.stop", function () {
			base.stop();
			base.hoverStatus = "stop";
		});
		base.$elem.on("carousel.goTo", function (event, item) {
			base.goTo(item);
		});
		base.$elem.on("carousel.jumpTo", function (event, item) {
			base.jumpTo(item);
		});
	};

	Carousel.prototype.moveEvents = function () {
		var base = this;
		if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
			base.gestures();
			base.disabledEvents();
		}
	};

	Carousel.prototype.disabledEvents = function () {
		var base = this;
		base.$elem.on("dragstart.carousel", function (event) {
			event.preventDefault();
		});
		base.$elem.on("mousedown.disableTextSelect", function (e) {
			return $(e.target).is('input, textarea, select, option');
		});
	};

	Carousel.prototype.clearEvents = function () {
		var base = this;
		base.$elem.off(".carousel carousel mousedown.disableTextSelect");
		$(document).off(".carousel carousel");
		$(window).off("resize", base.resizer);
	};

	Carousel.prototype.stopOnHover = function () {
		var base = this;
		if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
			base.$elem.on("mouseover", function () {
				base.stop();
			});
			base.$elem.on("mouseout", function () {
				if (base.hoverStatus !== "stop") {
					base.play();
				}
			});
		}
	};

	Carousel.prototype.gestures = function () {
		var base = this,
			locals = {
				offsetX: 0,
				offsetY: 0,
				baseElWidth: 0,
				relativePos: 0,
				position: null,
				minSwipe: null,
				maxSwipe: null,
				sliding: null,
				dargging: null,
				targetElement: null
			};
		base.isCssFinish = true;
		function getTouches(event) {
			if (event.touches !== undefined) {
				return {
					x: event.touches[0].pageX,
					y: event.touches[0].pageY
				};
			}
			if (event.touches === undefined) {
				if (event.pageX !== undefined) {
					return {
						x: event.pageX,
						y: event.pageY
					};
				}
				if (event.pageX === undefined) {
					return {
						x: event.clientX,
						y: event.clientY
					};
				}
			}
		}
		function swapEvents(type) {
			if (type === "on") {
				$(document).on(base.ev_types.move, dragMove);
				$(document).on(base.ev_types.end, dragEnd);
			} else if (type === "off") {
				$(document).off(base.ev_types.move);
				$(document).off(base.ev_types.end);
			}
		}
		function dragStart(event) {
			var ev = event.originalEvent || event || window.event,
				position;
			if (ev.which === 3) {
				return false;
			}
			if (base.itemsAmount <= base.options.items) {
				return;
			}
			if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
				return false;
			}
			if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
				return false;
			}
			if (base.options.autoPlay !== false) {
				window.clearInterval(base.autoPlayInterval);
			}
			if (base.browser.isTouch !== true && !base.$carouselWrapper.hasClass("grabbing")) {
				base.$carouselWrapper.addClass("grabbing");
			}
			base.newPosX         = 0;
			base.newRelativeX    = 0;
			$(this).css(base.removeTransition());
			position = $(this).position();
			locals.relativePos   = position.left;
			locals.offsetX       = getTouches(ev).x - position.left;
			locals.offsetY       = getTouches(ev).y - position.top;
			swapEvents("on");
			locals.sliding       = false;
			locals.targetElement = ev.target || ev.srcElement;
		}
		function dragMove(event) {
			var ev = event.originalEvent || event || window.event,
				minSwipe,
				maxSwipe;
			base.newPosX      = getTouches(ev).x - locals.offsetX;
			base.newPosY      = getTouches(ev).y - locals.offsetY;
			base.newRelativeX = base.newPosX - locals.relativePos;
			if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
				locals.dragging = true;
				base.options.startDragging.apply(base, [base.$elem]);
			}
			if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
				if (ev.preventDefault !== undefined) {
					ev.preventDefault();
				} else {
					ev.returnValue = false;
				}
				locals.sliding = true;
			}
			if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
				$(document).off("touchmove.carousel");
			}
			minSwipe = function () {
				return base.newRelativeX / 5;
			};
			maxSwipe = function () {
				return base.maximumPixels + base.newRelativeX / 5;
			};
			base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
			if (base.browser.support3d === true) {
				base.transition3d(base.newPosX);
			} else {
				base.css2move(base.newPosX);
			}
		}
		function dragEnd(event) {
			var ev = event.originalEvent || event || window.event,
				newPosition,
				handlers,
				carouselStopEvent;
			locals.dragging = false;
			if (base.browser.isTouch !== true) {
				base.$carouselWrapper.removeClass("grabbing");
			}
			if (base.newRelativeX < 0) {
				base.dragDirection = base.carousel.dragDirection = "left";
			} else {
				base.dragDirection = base.carousel.dragDirection = "right";
			}
			if (base.newRelativeX !== 0) {
				newPosition = base.getNewPosition();
				base.goTo(newPosition, false, "drag");
				if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
					$(ev.target).on("click.disable", function (ev) {
						ev.stopImmediatePropagation();
						ev.stopPropagation();
						ev.preventDefault();
						$(ev.target).off("click.disable");
					});
					handlers = $._data(ev.target, "events").click;
					carouselStopEvent = handlers.pop();
					handlers.splice(0, 0, carouselStopEvent);
				}
			}
			swapEvents("off");
		}
		base.$elem.on(base.ev_types.start, ".carousel-wrapper", dragStart);
	};

	Carousel.prototype.getNewPosition = function () {
		var base        = this,
			newPosition = base.closestItem();
		if (newPosition > base.maximumItem) {
			base.currentItem = base.maximumItem;
			newPosition = base.maximumItem;
		} else if (base.newPosX >= 0) {
			newPosition = 0;
			base.currentItem = 0;
		}
		return newPosition;
	};

	Carousel.prototype.closestItem = function () {
		var base    = this,
			array   = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
			goal    = base.newPosX,
			closest = null;
		$.each(array, function (i, v) {
			if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
				closest = v;
				if (base.options.scrollPerPage === true) {
					base.currentItem = $.inArray(closest, base.positionsInArray);
				} else {
					base.currentItem = i;
				}
			} else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
				if (base.options.scrollPerPage === true) {
					closest = array[i + 1] || array[array.length - 1];
					base.currentItem = $.inArray(closest, base.positionsInArray);
				} else {
					closest = array[i + 1];
					base.currentItem = i + 1;
				}
			}
		});
		return base.currentItem;
	};

	Carousel.prototype.moveDirection = function () {
		var base = this,
			direction;
		if (base.newRelativeX < 0) {
			direction = "right";
			base.playDirection = "next";
		} else {
			direction = "left";
			base.playDirection = "prev";
		}
		return direction;
	};

	Carousel.prototype.wrapItems = function () {
		var base = this;
		base.$userItems
			.wrapAll("<div class=\"carousel-wrapper\">")
			.wrap("<div class=\"carousel-item\"></div>");
		base.$elem
			.find(".carousel-wrapper")
			.wrap("<div class=\"carousel-wrapper-outer\">");
		base.wrapperOuter = base.$elem.find(".carousel-wrapper-outer");
		base.$elem.css("display", "block");
	};

	Carousel.prototype.updateItems = function () {
		var base = this,
			width,
			i;
		if (base.options.responsive === false) {
			return false;
		}
		if (base.options.singleItem === true) {
			base.orignalItems              = 1;
			base.options.items             = base.orignalItems;
			base.options.itemsCustom       = false;
			base.options.itemsDesktop      = false;
			base.options.itemsDesktopSmall = false;
			base.options.itemsTablet       = false;
			base.options.itemsTabletSmall  = false;
			base.options.itemsMobile       = false;
			return false;
		}
		width = $(base.options.responsiveBaseWidth).width();
		if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
			base.options.items = base.orignalItems;
		}
		if (base.options.itemsCustom !== false) {
			base.options.itemsCustom.sort(function (a, b) {
				return a[0] - b[0];
			});
			for (i = 0; i < base.options.itemsCustom.length; i += 1) {
				if (base.options.itemsCustom[i][0] <= width) {
					base.options.items = base.options.itemsCustom[i][1];
				}
			}
		} else {
			if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
				base.options.items = base.options.itemsDesktop[1];
			}
			if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
				base.options.items = base.options.itemsDesktopSmall[1];
			}
			if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
				base.options.items = base.options.itemsTablet[1];
			}
			if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
				base.options.items = base.options.itemsTabletSmall[1];
			}
			if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
				base.options.items = base.options.itemsMobile[1];
			}
		}
		if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
			base.options.items = base.itemsAmount;
		}
	};

	Carousel.prototype.calculateAll = function () {
		var base = this;
		base.calculateWidth();
		base.appendWrapperSizes();
		base.loops();
		base.max();
	};

	Carousel.prototype.calculateWidth = function () {
		var base = this;
		base.itemWidth = Math.round(base.$elem.width() / base.options.items);
	};

	Carousel.prototype.appendWrapperSizes = function () {
		var base  = this,
			width = base.$carouselItems.length * base.itemWidth;
		base.$carouselWrapper.css({
			"width" : width * 2,
			"left"  : 0
		});
		base.appendItemsSizes();
	};

	Carousel.prototype.appendItemsSizes = function () {
		var base       = this,
			roundPages = 0,
			lastItem   = base.itemsAmount - base.options.items;
		base.$carouselItems.each(function (index) {
			var $this = $(this);
			$this
				.css({"width": base.itemWidth})
				.data("carousel-item", Number(index));
			if (index % base.options.items === 0 || index === lastItem) {
				if (!(index > lastItem)) {
					roundPages += 1;
				}
			}
			$this.data("carousel-roundPages", roundPages);
		});
	};

	Carousel.prototype.loops = function () {
		var base    = this,
			prev    = 0,
			elWidth = 0,
			i,
			item,
			roundPageNum;
		base.positionsInArray = [0];
		base.pagesInArray     = [];
		for (i = 0; i < base.itemsAmount; i += 1) {
			elWidth += base.itemWidth;
			base.positionsInArray.push(-elWidth);
			if (base.options.scrollPerPage === true) {
				item = $(base.$carouselItems[i]);
				roundPageNum = item.data("carousel-roundPages");
				if (roundPageNum !== prev) {
					base.pagesInArray[prev] = base.positionsInArray[i];
					prev = roundPageNum;
				}
			}
		}
	};

	Carousel.prototype.max = function () {
		var base    = this,
			maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
		if (base.options.items > base.itemsAmount) {
			base.maximumItem   = 0;
			maximum            = 0;
			base.maximumPixels = 0;
		} else {
			base.maximumItem   = base.itemsAmount - base.options.items;
			base.maximumPixels = maximum;
		}
		return maximum;
	};

	Carousel.prototype.min = function () {
		return 0;
	};

	Carousel.prototype.buildControls = function () {
		var base = this;
		if (base.options.navigation === true || base.options.pagination === true) {
			base.carouselControls = $("<div class=\"carousel-controls\"/>")
				.toggleClass("clickable", !base.browser.isTouch)
				.appendTo(base.$elem);
		}
		if (base.options.pagination === true) {
			base.buildPagination();
		}
		if (base.options.navigation === true) {
			base.buildButtons();
		}
	};

	Carousel.prototype.updateControls = function () {
		var base = this;
		base.updatePagination();
		base.checkNavigation();
		if (base.carouselControls) {
			if (base.options.items >= base.itemsAmount) {
				base.carouselControls.hide();
			} else {
				base.carouselControls.show();
			}
		}
	};

	Carousel.prototype.destroyControls = function () {
		var base = this;
		if (base.carouselControls) {
			base.carouselControls.remove();
		}
	};

	Carousel.prototype.buildPagination = function () {
		var base = this;
		base.paginationWrapper = $("<div class=\"carousel-pagination\"/>");
		base.carouselControls.append(base.paginationWrapper);
		base.paginationWrapper.on("touchend.carouselControls mouseup.carouselControls", ".carousel-page", function (event) {
			event.preventDefault();
			if (Number($(this).data("carousel-page")) !== base.currentItem) {
				base.goTo(Number($(this).data("carousel-page")), true);
			}
		});
	};

	Carousel.prototype.updatePagination = function () {
		var base = this,
			counter,
			lastPage,
			lastItem,
			i,
			paginationButton,
			paginationButtonInner;
		if (base.options.pagination === false) {
			return false;
		}
		base.paginationWrapper.html("");
		counter  = 0;
		lastPage = base.itemsAmount - base.itemsAmount % base.options.items;
		for (i = 0; i < base.itemsAmount; i += 1) {
			if (i % base.options.items === 0) {
				counter += 1;
				if (lastPage === i) {
					lastItem = base.itemsAmount - base.options.items;
				}
				paginationButton = $("<div/>", {
					"class": "carousel-page"
				});
				paginationButtonInner = $("<span></span>", {
					"text": base.options.paginationNumbers === true ? counter : "",
					"class": base.options.paginationNumbers === true ? "carousel-numbers" : ""
				});
				paginationButton.append(paginationButtonInner);

				paginationButton.data("carousel-page", lastPage === i ? lastItem : i);
				paginationButton.data("carousel-roundPages", counter);

				base.paginationWrapper.append(paginationButton);
			}
		}
		base.checkPagination();
	};

	Carousel.prototype.checkPagination = function () {
		var base = this;
		if (base.options.pagination === false) {
			return false;
		}
		base.paginationWrapper.find(".carousel-page").each(function () {
			if ($(this).data("carousel-roundPages") === $(base.$carouselItems[base.currentItem]).data("carousel-roundPages")) {
				base.paginationWrapper
					.find(".carousel-page")
					.removeClass("active");
				$(this).addClass("active");
			}
		});
	};

	Carousel.prototype.checkNavigation = function () {
		var base = this;
		if (base.options.navigation === false) {
			return false;
		}
		if (base.options.rewindNav === false) {
			if (base.currentItem === 0 && base.maximumItem === 0) {
				base.buttonPrev.addClass("disabled");
				base.buttonNext.addClass("disabled");
			} else if (base.currentItem === 0 && base.maximumItem !== 0) {
				base.buttonPrev.addClass("disabled");
				base.buttonNext.removeClass("disabled");
			} else if (base.currentItem === base.maximumItem) {
				base.buttonPrev.removeClass("disabled");
				base.buttonNext.addClass("disabled");
			} else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
				base.buttonPrev.removeClass("disabled");
				base.buttonNext.removeClass("disabled");
			}
		}
	};

	Carousel.prototype.buildButtons = function () {
		var base           = this,
			buttonsWrapper = $("<div class=\"carousel-buttons\"/>");
		base.carouselControls.append(buttonsWrapper);
		base.buttonPrev = $("<div/>", {
			"class": "carousel-prev",
			"html": base.options.navigationText[0] || ""
		});
		base.buttonNext = $("<div/>", {
			"class": "carousel-next",
			"html": base.options.navigationText[1] || ""
		});
		buttonsWrapper
			.append(base.buttonPrev)
			.append(base.buttonNext);
		buttonsWrapper.on("touchstart.carouselControls mousedown.carouselControls", "div[class^=\"carousel\"]", function (event) {
			event.preventDefault();
		});
		buttonsWrapper.on("touchend.carouselControls mouseup.carouselControls", "div[class^=\"carousel\"]", function (event) {
			event.preventDefault();
			if ($(this).hasClass("carousel-next")) {
				base.next();
			} else {
				base.prev();
			}
		});
	};

	Carousel.prototype.play = function () {
		var base = this;
		base.apStatus = "play";
		if (base.options.autoPlay === false) {
			return false;
		}
		window.clearInterval(base.autoPlayInterval);
		base.autoPlayInterval = window.setInterval(function () {
			base.next(true);
		}, base.options.autoPlay);
	};

	Carousel.prototype.next = function (speed) {
		var base = this;
		if (base.isTransition) {
			return false;
		}
		base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
		if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
			if (base.options.rewindNav === true) {
				base.currentItem = 0;
				speed = "rewind";
			} else {
				base.currentItem = base.maximumItem;
				return false;
			}
		}
		base.goTo(base.currentItem, speed);
	};

	Carousel.prototype.prev = function (speed) {
		var base = this;
		if (base.isTransition) {
			return false;
		}
		if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
			base.currentItem = 0;
		} else {
			base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
		}
		if (base.currentItem < 0) {
			if (base.options.rewindNav === true) {
				base.currentItem = base.maximumItem;
				speed = "rewind";
			} else {
				base.currentItem = 0;
				return false;
			}
		}
		base.goTo(base.currentItem, speed);
	};

	Carousel.prototype.goTo = function (position, speed, drag) {
		var base = this,
			goToPixel;
		if (base.isTransition) {
			return false;
		}
		if (typeof base.options.beforeMove === "function") {
			base.options.beforeMove.apply(this, [base.$elem]);
		}
		if (position >= base.maximumItem) {
			position = base.maximumItem;
		} else if (position <= 0) {
			position = 0;
		}
		base.carousel.currentItem = position;
		base.currentItem          = base.carousel.currentItem;
		if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
			base.swapSpeed(0);
			if (base.browser.support3d === true) {
				base.transition3d(base.positionsInArray[position]);
			} else {
				base.css2slide(base.positionsInArray[position], 1);
			}
			base.afterGo();
			base.singleItemTransition();
			return false;
		}
		goToPixel = base.positionsInArray[position];
		if (base.browser.support3d === true) {
			base.isCss3Finish = false;
			if (speed === true) {
				base.swapSpeed("paginationSpeed");
				window.setTimeout(function () {
					base.isCss3Finish = true;
				}, base.options.paginationSpeed);

			} else if (speed === "rewind") {
				base.swapSpeed(base.options.rewindSpeed);
				window.setTimeout(function () {
					base.isCss3Finish = true;
				}, base.options.rewindSpeed);

			} else {
				base.swapSpeed("slideSpeed");
				window.setTimeout(function () {
					base.isCss3Finish = true;
				}, base.options.slideSpeed);
			}
			base.transition3d(goToPixel);
		} else {
			if (speed === true) {
				base.css2slide(goToPixel, base.options.paginationSpeed);
			} else if (speed === "rewind") {
				base.css2slide(goToPixel, base.options.rewindSpeed);
			} else {
				base.css2slide(goToPixel, base.options.slideSpeed);
			}
		}
		base.afterGo();
	};

	Carousel.prototype.jumpTo = function (position) {
		var base = this;
		if (typeof base.options.beforeMove === "function") {
			base.options.beforeMove.apply(this, [base.$elem]);
		}
		if (position >= base.maximumItem || position === -1) {
			position = base.maximumItem;
		} else if (position <= 0) {
			position = 0;
		}
		base.swapSpeed(0);
		if (base.browser.support3d === true) {
			base.transition3d(base.positionsInArray[position]);
		} else {
			base.css2slide(base.positionsInArray[position], 1);
		}
		base.currentItem = base.carousel.currentItem = position;
		base.afterGo();
	};

	Carousel.prototype.afterGo = function () {
		var base = this;
		base.prevArr.push(base.currentItem);
		base.prevItem = base.carousel.prevItem = base.prevArr[base.prevArr.length - 2];
		base.prevArr.shift(0);
		if (base.prevItem !== base.currentItem) {
			base.checkPagination();
			base.checkNavigation();
			base.eachMoveUpdate();
			if (base.options.autoPlay !== false) {
				base.checkAp();
			}
		}
		if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
			base.options.afterMove.apply(this, [base.$elem]);
		}
	};

	Carousel.prototype.stop = function () {
		var base = this;
		base.apStatus = "stop";
		window.clearInterval(base.autoPlayInterval);
	};

	Carousel.prototype.checkAp = function () {
		var base = this;
		if (base.apStatus !== "stop") {
			base.play();
		}
	};

	Carousel.prototype.swapSpeed = function (action) {
		var base = this;
		if (action === "slideSpeed") {
			base.$carouselWrapper.css(base.addCssSpeed(base.options.slideSpeed));
		} else if (action === "paginationSpeed") {
			base.$carouselWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
		} else if (typeof action !== "string") {
			base.$carouselWrapper.css(base.addCssSpeed(action));
		}
	};

	Carousel.prototype.addCssSpeed = function (speed) {
		return {
			"-webkit-transition": "all " + speed + "ms ease",
			"-moz-transition": "all " + speed + "ms ease",
			"-o-transition": "all " + speed + "ms ease",
			"transition": "all " + speed + "ms ease"
		};
	};

	Carousel.prototype.removeTransition = function () {
		return {
			"-webkit-transition": "",
			"-moz-transition": "",
			"-o-transition": "",
			"transition": ""
		};
	};

	Carousel.prototype.transition3d = function (value) {
		var base = this;
		base.$carouselWrapper.css(base.doTranslate(value));
	};

	Carousel.prototype.css2move = function (value) {
		var base = this;
		base.$carouselWrapper.css({"left": value});
	};

	Carousel.prototype.css2slide = function (value, speed) {
		var base = this;
		base.isCssFinish = false;
		base.$carouselWrapper.stop(true, true).animate({
			"left": value
		}, {
			duration: speed || base.options.slideSpeed,
			complete: function () {
				base.isCssFinish = true;
			}
		});
	};

	Carousel.prototype.doTranslate = function (pixels) {
		return {
			"-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
			"-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
			"-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
			"-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
			"transform": "translate3d(" + pixels + "px, 0px,0px)"
		};
	};

	Carousel.prototype.transitionTypes = function (className) {
		var base = this;
		base.outClass = "carousel-" + className + "-out";
		base.inClass = "carousel-" + className + "-in";
	};

	Carousel.prototype.singleItemTransition = function () {
		var base          = this,
			outClass      = base.outClass,
			inClass       = base.inClass,
			$currentItem  = base.$carouselItems.eq(base.currentItem),
			$prevItem     = base.$carouselItems.eq(base.prevItem),
			prevPos       = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
			origin        = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
			animEnd       = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';
		base.isTransition = true;
		base.$carouselWrapper
			.addClass('carousel-origin')
			.css({
				"-webkit-transform-origin": origin + "px",
				"-moz-perspective-origin": origin + "px",
				"perspective-origin": origin + "px"
			});
		function transStyles(prevPos) {
			return {
				"position": "relative",
				"left": prevPos + "px"
			};
		}
		$prevItem
			.css(transStyles(prevPos, 10))
			.addClass(outClass)
			.on(animEnd, function () {
				base.endPrev = true;
				$prevItem.off(animEnd);
				base.clearTransStyle($prevItem, outClass);
			});
		$currentItem
			.addClass(inClass)
			.on(animEnd, function () {
				base.endCurrent = true;
				$currentItem.off(animEnd);
				base.clearTransStyle($currentItem, inClass);
			});
	};

	Carousel.prototype.clearTransStyle = function (item, classToRemove) {
		var base = this;
		item.css({
			"position": "",
			"left": ""
		}).removeClass(classToRemove);
		if (base.endPrev && base.endCurrent) {
			base.$carouselWrapper.removeClass('carousel-origin');
			base.endPrev = false;
			base.endCurrent = false;
			base.isTransition = false;
		}
	};

	Carousel.prototype.autoHeight = function () {
		var base = this,
			$currentimg = $(base.$carouselItems[base.currentItem]).find("img"),
			iterations;
		function addHeight() {
			var $currentItem = $(base.$carouselItems[base.currentItem]).height();
			base.wrapperOuter.css("height", $currentItem + "px");
			if (!base.wrapperOuter.hasClass("auto-height")) {
				window.setTimeout(function () {
					base.wrapperOuter.addClass("auto-height");
				}, 0);
			}
		}
		function checkImage() {
			iterations += 1;
			if (base.completeImg($currentimg.get(0))) {
				addHeight();
			} else if (iterations <= 100) {
				window.setTimeout(checkImage, 100);
			} else {
				base.wrapperOuter.css("height", "");
			}
		}
		if ($currentimg.get(0) !== undefined) {
			iterations = 0;
			checkImage();
		} else {
			addHeight();
		}
	};

	Carousel.prototype.completeImg = function (img) {
		var naturalWidthType;
		if (!img.complete) {
			return false;
		}
		naturalWidthType = typeof img.naturalWidth;
		if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
			return false;
		}
		return true;
	};

	Carousel.prototype.onVisibleItems = function () {
		var base = this,
			i;
		if (base.options.addClassActive === true) {
			base.$carouselItems.removeClass("active");
		}
		base.visibleItems = [];
		for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
			base.visibleItems.push(i);

			if (base.options.addClassActive === true) {
				$(base.$carouselItems[i]).addClass("active");
			}
		}
		base.carousel.visibleItems = base.visibleItems;
	};

	Carousel.prototype.lazyLoad = function () {
		var base = this,
			i,
			$item,
			itemNumber,
			$lazyImg,
			follow;

		if (base.options.lazyLoad === false) {
			return false;
		}
		for (i = 0; i < base.itemsAmount; i += 1) {
			$item = $(base.$carouselItems[i]);

			if ($item.data("carousel-loaded") === "loaded") {
				continue;
			}

			itemNumber = $item.data("carousel-item");
			$lazyImg = $item.find(".lazyCarousel");

			if (typeof $lazyImg.data("src") !== "string") {
				$item.data("carousel-loaded", "loaded");
				continue;
			}
			if ($item.data("carousel-loaded") === undefined) {
				$lazyImg.hide();
				$item.addClass("loading").data("carousel-loaded", "checked");
			}
			if (base.options.lazyFollow === true) {
				follow = itemNumber >= base.currentItem;
			} else {
				follow = true;
			}
			if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
				base.lazyPreload($item, $lazyImg);
			}
		}
	};

	Carousel.prototype.lazyPreload = function ($item, $lazyImg) {
		var base       = this,
			iterations = 0,
			isBackgroundImg;
		if ($lazyImg.prop("tagName") === "DIV") {
			$lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
			isBackgroundImg = true;
		} else {
			$lazyImg[0].src = $lazyImg.data("src");
		}
		function showImage() {
			$item.data("carousel-loaded", "loaded").removeClass("loading");
			$lazyImg.removeAttr("data-src");
			if (base.options.lazyEffect === "fade") {
				$lazyImg.fadeIn(400);
			} else {
				$lazyImg.show();
			}
			if (typeof base.options.afterLazyLoad === "function") {
				base.options.afterLazyLoad.apply(this, [base.$elem]);
			}
		}
		function checkLazyImage() {
			iterations += 1;
			if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
				showImage();
			} else if (iterations <= 100) {
				window.setTimeout(checkLazyImage, 100);
			} else {
				showImage();
			}
		}
		checkLazyImage();
	};

	Carousel.DEFAULTS = {
		baseClass: "carousel",
		theme: "carousel-theme",
		items: 6,
		itemsDesktop: false,
		itemsDesktopSmall: [1199, 4],
		itemsTablet: [991, 3],
        itemsTabletSmall : [767, 4],
		itemsMobile: [479, 3],
		itemsCustom: false,
		itemsScaleUp: false,
		singleItem: false,
		slideSpeed: 200,
		paginationSpeed: 800,
		rewindSpeed: 1000,
		autoPlay: false,
		stopOnHover: false,
		navigation: false,
		navigationText: ["prev", "next"],
		rewindNav: true,
		scrollPerPage: false,
		pagination: false,
		paginationNumbers: false,
		responsive: true,
		responsiveRefreshRate: 200,
		responsiveBaseWidth: window,
		lazyLoad: true,
		lazyFollow: true,
		lazyEffect: "fade",
		autoHeight: true,
		mouseDrag: true,
		touchDrag: true,
		dragBeforeAnimFinish: true,
		addClassActive: false,
		transitionStyle: false,
		jsonPath: false,
		jsonSuccess: false,
		beforeInit: false,
		afterInit: false,
		beforeUpdate: false,
		afterUpdate: false,
		beforeMove: false,
		afterMove: false,
		afterAction: false,
		startDragging: false,
		afterLazyLoad: false
	};

	// CAROUSEL PLUGIN DEFINITION
	// ==========================
	function Plugin(option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('sp.carousel');
			var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
			if (!data)
			{
				$this.data('sp.carousel', (data = new Carousel(this, options)));
			}
		});
	}

	var old = $.fn.spCarousel;

	$.fn.spCarousel = Plugin;
	$.fn.spCarousel.Constructor = Carousel;

	// CAROUSEL NO CONFLICT
	// ====================
	$.fn.spCarousel.noConflict = function () {
		$.fn.spCarousel = old;
		return this;
	};

	// CAROUSEL DATA-API
	// =================
	$('[data-plugin="carousel"]').spCarousel();
}(jQuery);