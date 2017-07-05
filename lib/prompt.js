var fs = require("fs");
var inquirer = require('inquirer')
var async = require('async');
var Metalsmith = require('metalsmith');
var path = require('path');

function getData (src, metalsmith) {
	var route = path.join(src, "/meta.json");

	if (fs.existsSync(route)) {
		var data = JSON.parse(fs.readFileSync(route));

		metalsmith.metadata(data)

		return data;
	}
}
	
function prompt (src, metalsmith, cb) {	
	var data = getData(src, metalsmith).prompt, defaultName, arr = src.match(/[_-]+([a-zA-Z0-9]+)/);
	
	if (arr && arr.length) {
		defaultName = arr[1];
	} else {
		defaultName = src;
	}
	data.name.default = defaultName;

	async.eachSeries(Object.keys(data), function (key, next) {
  		inquirer.prompt([{
		    type: data[key]["type"] || "input",
		    name: key,
		    message: data[key]["message"],
		    default: data[key]["default"] || "",
		    choices: data[key]["choices"] || [],
		    validate: data[key]["validate"] || function () { return true }
		}], function (answers) {
			var meta = metalsmith.metadata();

			meta.prompt[key] = answers[key];
		    next();
		})
    }, function () {
    	cb && cb(metalsmith);
    });
}

module.exports = prompt;