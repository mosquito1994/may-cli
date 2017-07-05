var minimatch = require("minimatch");

module.exports = function (metalsmith) {
	var meta = metalsmith.metadata();

	return function (files, metalsmith, done) {
		if (!meta.filters) {
			return done();
		}

		var filterkeys = Object.keys(meta.filters),
			fileKeys = Object.keys(files),
			prompt = meta.prompt;

		filterkeys.forEach(function (item) {
			var key = meta.filters[item];

			if (typeof prompt[key] != "undefined") {
				if (prompt[key] === true) {
					return;
				} else if (prompt[key] === false) {
					fileKeys.forEach(function (item2) {
						var temp = item2.split(/\\/).join("/");

						if (minimatch(item2, item, { dot: true })) {
							delete files[item2];
						}
					});
				}
			}
		});

		done();
	}
}