// app
$('document').ready(function() {
	"use strict";

	var $modules = $('.element-module'),
		$ul = $('#element-menu-list'),
		modules = {},
		dependencies = {
			'button-extends': ['button'],			
			'dropdown': ['button'],
			'button-group': ['button','dropdown'],
			'form-advance': ['form']
		},
		toggle = function(i, force) {
			if (typeof force !== 'undefined') {
				modules[i] = !force;
			}
			if (!modules[i]) {
				$('#' + i + '-li,#' + i + '-module').addClass('selected');
				modules[i] = true;
				if (typeof dependencies[i] !== 'undefined') {
					var arr = dependencies[i];
					for (var x = 0; x < arr.length; x++) {
						toggle(arr[x], true);
					}
				}
			} else {
				$('#' + i + '-li,#' + i + '-module').removeClass('selected');
				modules[i] = false;
				for (var a in dependencies) {
					var arr = dependencies[a];
					for (var x = 0; x < arr.length; x++) {
						if (arr[x] === i) {
							toggle(a, false);
						}
					}
				}
			}
		};


	$modules.each(function() {
		var $mod = $(this),
			$title = $mod.find('>.element-module-title'),
			name = $title.attr('id');

		var $li = $('<li id="' + name + '-li"></li>').appendTo($ul),
			$sp = $('<span class="element-menu-selector"></span>').appendTo($li),
			$a = $('<a href="#' + name + '">' + $title.text() + '</a>').appendTo($li);

		modules[name] = false;
		$mod.attr('id', name + '-module');
		$sp.click(function() {
			toggle(name);
		});
	});
	toggle('basics',true);
});