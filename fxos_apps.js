(function(exports) {

	// Hidden manifest roles that we do not show
	const HIDDEN_ROLES = ['system', 'input', 'homescreen', 'theme'];

	// List of all application icons.
	var icons = [];

	// List of all application icons by identifier.
	var iconsMap = {};

	/**
	 * Creates icons for an app based on hidden roles and entry points.
	 */
	function makeIcons(app) {
		if (HIDDEN_ROLES.indexOf(app.manifest.role) !== -1) {
			return;
		}

		var newIcon;
		if (app.manifest.entry_points) {
			for (var i in app.manifest.entry_points) {
				newIcon = new Icon(app, i);
				icons.push(newIcon);
				iconsMap[newIcon.identifier] = newIcon;
			}
		} else {
			newIcon = new Icon(app);
			icons.push(newIcon);
			iconsMap[newIcon.identifier] = newIcon;
		}
	}

	/**
	 * Represents a single app icon on the homepage.
	 */
	function Icon(app, entryPoint) {
		this.app = app;
		this.entryPoint = entryPoint;

		this.identifier = [app.manifestURL, entryPoint].join('-');
	}

	Icon.prototype = {

		get name() {
			var userLang = document.documentElement.lang;
			var locales = this.descriptor.locales;
			var localized = locales && locales[userLang] && locales[userLang].name;

			return localized || this.descriptor.name;
		},

		get icon() {
			var icons = this.descriptor.icons;
			if (!icons) {
				return '';
			}

			for (var i in icons) {
				return this.app.origin + icons[i];
			}
		},

		get descriptor() {
			if (this.entryPoint) {
				return this.app.manifest.entry_points[this.entryPoint];
			}
			return this.app.manifest;
		},

		/**
		 * Launches the application for this icon.
		 */
		launch: function() {
			if (this.entryPoint) {
				this.app.launch(this.entryPoint);
			} else {
				this.app.launch();
			}
		}
	};


	exports.FxosApps = {

		/**
		 * Exports the Icon class.
		 */
		Icon: Icon,

		/**
		 * Fetches all icons from mozApps.mgmt.
		 */
		all: function() {
			return new Promise((resolve, reject) => {
				navigator.mozApps.mgmt.getAll().onsuccess = function(event) {
					event.target.result.forEach(makeIcons);
					resolve(icons);
				};
			});
		},

		/**
		 * Gets an icon by identifier.
		 */
		get: function(identifier) {
			return iconsMap[identifier];
		}
	};

}(window));
