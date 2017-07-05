var exec = require('child_process').execSync,
	username, email;

try {
	username = exec('git config --get user.name').toString();
	email = exec('git config --get user.email').toString();
} catch (e) {

}

module.exports = function (metalsmith) {
	var data = metalsmith.metadata(),
		quizData = data.prompt,
		name = quizData.name;

	quizData.author = "<" + username.replace("\n", "") + ">" + email.replace("\n", "");
	quizData.createFn = "create" + name.charAt(0).toUpperCase() + name.substr(1);

	return function (files, metalsmith, done) {
		for (var key in files) {
			if (files[key]["render"]) {
				files[key]["contents"] = files[key]["render"](quizData);
			}
		}
		done();
	}
}