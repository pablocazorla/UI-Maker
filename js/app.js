// App
$('document').ready(function() {
	"use strict";

	// Module Store
	var modules = {};

	// Store $nodes
	var $modules = $('.element-module'),
		$ul = $('#element-menu-list'),
		mainConfigurationStr = '',
		$inputSaver = $('#inputSaver'),
		updateInputSaver = function() {
			var str = '';
			for (var a in modules) {
				if (modules[a].selected) {
					str += ',' + a;
				}
			}
			str = str.substring(1);
			$inputSaver.val(str);
		};



	// Dependencies
	var dependencies = {
		'button-extends': ['button'],
		'dropdown': ['button'],
		'button-group': ['button', 'dropdown'],
		'form-advance': ['form']
	};

	// Module /////////////////////////
	var m = function($mod) {
		return this.init($mod);
	};
	m.prototype = {
		init: function($mod) {
			this.selected = false;
			this.$mod = $mod;
			var $title = $mod.find('>.element-module-title');
			this.id = $title.attr('id');
			this.$li = $('<li></li>').appendTo($ul);
			var $sp = $('<span class="element-menu-selector"></span>').appendTo(this.$li),
				$a = $('<a href="#' + this.id + '">' + $title.text() + '</a>').appendTo(this.$li);
			var self = this;

			if (this.$mod.hasClass('required')) {
				//this.toggle(true);
				$sp.hide();
			} else {
				$sp.click(function() {
					self.toggle();
				});
			}

			// Less
			this.saved = true;
			this.lessContent = '';
			this.$ec = $('<div class="element-code"></div>').appendTo(this.$mod);
			var $ect = $('<div class="element-code-tools"></div>').appendTo(this.$ec);

			this.$btnSaveLess = $('<span class="element-code-tool-a">Save less</span>').appendTo($ect);

			this.$textarea = $('<textarea class="element-code-textarea"></textarea>').appendTo(this.$ec);

			this.$style = $('<style type="text/css" id="' + this.id + '-style"></style>').appendTo('body');

			var self = this;
			$.ajax({
				url: 'edit_here/less/' + self.id + '.less',
				success: function(data) {
					self.$textarea.val(data);
					self.update();
				}
			});

			this.$textarea.blur(function() {
				self.update().toggleUnsaved(false);
			});
			this.$btnSaveLess.click(function() {
				self.save();
			});

			modules[this.id] = this;
			return this;
		},
		update: function() {
			var self = this;
			setTimeout(function() {
				var str = self.$textarea.val();
				if (self.id === 'main-configuration') {
					mainConfigurationStr = str;
				}
				less.render(mainConfigurationStr + str).then(function(out) {
					self.$style.html(out.css);
				});
			}, 50);
			return this;
		},
		save: function() {
			if (!this.saved) {
				var origText = this.$btnSaveLess.text();
				this.$btnSaveLess.text('Saving...');
				var dataString = 'file=' + this.id + '&content=' + this.$textarea.val();
				var self = this;
				$.ajax({
					type: 'POST',
					url: 'saveless.php',
					data: dataString,
					cache: false,
					success: function(result) {
						self.$btnSaveLess.text(origText);
						self.toggleUnsaved(true);
					}
				});
			}
			return this;
		},
		toggleUnsaved: function(force) {
			this.saved = force;
			if (!force) {
				this.$ec.addClass('unsaved');
			} else {
				this.$ec.removeClass('unsaved');
			}
			return this;
		},
		toggle: function(force) {
			var i = this.id;
			if (typeof force !== 'undefined') {
				this.selected = !force;
			}
			if (!this.selected) {
				this.$li.addClass('selected');
				this.$mod.addClass('selected');
				this.selected = true;
				if (typeof dependencies[i] !== 'undefined') {
					var arr = dependencies[i];
					for (var x = 0; x < arr.length; x++) {
						modules[arr[x]].toggle(true);
					}
				}
			} else {
				this.$li.removeClass('selected');
				this.$mod.removeClass('selected');
				this.selected = false;
				for (var a in dependencies) {
					var arr = dependencies[a];
					for (var x = 0; x < arr.length; x++) {
						if (arr[x] === i) {
							modules[a].toggle(false);
						}
					}
				}
			}
			updateInputSaver();
		}
	};
	var Module = function($mod) {
		return new m($mod);
	};
	//////////////////////////////////

	$modules.each(function() {
		var m = Module($(this));
	});

	var onstart = $inputSaver.val();
	if (onstart !== '') {
		var onstartArray = onstart.split(',');
		for (var i = 0; i < onstartArray.length; i++) {
			modules[onstartArray[i]].toggle(true);
		}
	}
});