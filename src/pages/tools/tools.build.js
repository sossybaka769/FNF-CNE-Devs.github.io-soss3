var fs = require('fs');
var { fixHtmlRefs, htmlToString, parseTemplate, compileJs } = require("../../utils.js");

var header = fs.readFileSync("./src/pages/templates/header.html", 'utf8')

const tools = [
	{
		link: "index",
		title: "Home",
		desc: "Home of the tools",
		internal: true
	},
	{
		link: "event-packer",
		title: "Event Packer",
		desc: "Tool to pack events for the engine"
	},
	{
		link: "https://neeeoo.github.io/funkin-packer/",
		title: "Funkin Packer",
		desc: "Tool to pack and repack spritesheets",
		external: true,
	},
	{
		link: "psych-char-converter",
		title: "Psych Character Converter",
		desc: "Convert characters from Psych Engine to Codename Engine",
	}
];

function buildHtml(_pageDir, _exportPath) {
	var pageDir = _pageDir + "tools/";
	var exportPath = _exportPath + "tools/";
	if (!fs.existsSync(exportPath)) {
		fs.mkdirSync(exportPath, {recursive: true});
	}
	console.log("Building Tools");

	var displayTools = tools.filter(tool => !tool.internal);

	for(const tool of tools) {
		if(tool.external) {
			continue;
		}
		var path = "./src/pages/tools/" + tool.link + "/index.html";
		var outpath = exportPath + tool.link + "/index.html";
		if(tool.link == "index") {
			path = "./src/pages/tools/index.html";
			outpath = exportPath + "index.html";
		}

		var filePath = outpath.split("/");
		filePath.pop();
		filePath = filePath.join("/");

		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath, {recursive: true});
		}

		if(fs.existsSync(path.replace(/\.html$/, ".js"))) {
			var scriptPath = path.replace(/\.html$/, ".js");

			compileJs(scriptPath, outpath.replace(/\.html$/, ".js"));
		}

		var templatePage = fs.readFileSync(path, 'utf8');
		var vars = {
			title: tool.title,
			header: header,
			tools: displayTools
		};
		console.log(tool.link);

		let html = parseTemplate(templatePage, vars);

		var dom = fixHtmlRefs(html, pageDir, _pageDir);

		//console.log(data);
		fs.writeFileSync(
			outpath,
			htmlToString(dom),
			'utf8'
		);
	}
}

module.exports = {
	buildHtml: buildHtml
}