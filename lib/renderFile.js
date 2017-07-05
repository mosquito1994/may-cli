var _ = require('lodash');
var path = require('path');
var whiteExt = ["js", "json", "jsx", "css", "sass", "less", "scss", "html", "vue", "babelrc"];
/*_.templateSettings.escape = /<%-([\s\S]+?)%>/g;
_.templateSettings.interpolate = /<%([\s\S]+?)%>/g;
_.templateSettings.evaluate = /<%=([\s\S]+?)%>/g;*/

module.exports = function (files, metalsmith, done) {
	for (var key in files) {
		var tpl = files[key]["contents"].toString();

		if (whiteExt.indexOf(path.extname(key).substr(1)) != -1) { // 不处理白名单以外的文件
			if (key.indexOf(".min.") != -1) { // 不处理压缩后的js文件
				return done();
			}
			if (files[key].size > 1024 * 100) { // 忽略100kb以上的文件
				return done();
			}
		}
		if (tpl.indexOf("<%") != -1 && tpl.indexOf("%>") != -1) {
			files[key]["render"] = _.template(tpl);
		}
	}
	done();
}