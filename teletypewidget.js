/*global $ */
$.fn.teletype = function (initOnly) {
	'use strict';
	var content = $(this),
			container = content.parent(),
			contentHeight = content.innerHeight(),
			parentHeight = container.innerHeight(),
			parentWidth = container.innerWidth(),
			lineHeight = parseInt(content.css('line-height')) || 12,
			currentMargin = parentHeight,
			cover = $('<div>').css({width: '100%', right:0, height: lineHeight + 'px', bottom: 0, position: 'absolute', 'z-index': 10, 'background-color': 'white'}),
			head = $('<div>').css({width: '30px', left:0, height: lineHeight + 'px', bottom: 0, position: 'absolute', 'z-index': 11, 'background-color': 'red'}),
			headWidth = head.innerWidth(),
			done = $.Deferred(),
			pullUpContent = function (now, fx) {
				if (fx.prop === 'height') {
					content.css('top', currentMargin - now);
				}
			},
			moveHead = function (now, fx) {
				if (fx.prop === 'width') {
					head.css('left', parentWidth - Math.max(now, headWidth));
				}
			},
			moveUp = function () {
				cover.animate({'height': lineHeight}, {
					start: function () {
						currentMargin = currentMargin - lineHeight;
					},
					step: pullUpContent,
					queue: true
				});
			},
			slideRight = function () {
				cover.animate({width:0}, {
					queue: true,
					start: done.notify,
					complete: function () {
						cover.css({height: 0});
					},
					step: moveHead
				});
			},
			slideLeft = function () {
				cover.animate({width: parentWidth}, {
					queue: true,
					step: moveHead
				});
			},
			times = contentHeight / lineHeight;
	content.css({'top': parentHeight + 'px'});
	if (!initOnly) {
		cover.appendTo(content.parent());
		head.appendTo(content.parent());
		while (times > 0) {
			moveUp();
			slideRight();
			slideLeft();
			times--;
		}
		cover.queue(function () {
			cover.remove();
			head.remove();
			done.resolve();
		});
	}
	return done.promise();
};
