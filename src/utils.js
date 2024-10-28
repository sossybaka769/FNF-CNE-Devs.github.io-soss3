var jsdom = require("jsdom");
var Mustache = require('mustache');
var path = require("path");
var hljs = require('highlight.js');
var fs = require('fs');
var sass = require('sass');
var CleanCSS = require('clean-css');
var UglifyJS = require("uglify-js");

var wax = require('@jvitela/mustache-wax');

var isFullBuild = false;
var isWatch = false;
var isFirstRun = false;
var isRelease = false;

function setGlobals(data) {
	isFullBuild = data.isFullBuild;
	isWatch = data.isWatch;
	isFirstRun = data.isFirstRun;
	isRelease = data.isRelease;
}

function getGlobals() {
	return {isFullBuild, isWatch, isFirstRun, isRelease};
}

function fixPath(url) {
	return url.replaceAll(path.sep, path.posix.sep);
}

function parseHtml(html) {
	return new jsdom.JSDOM(html);
}

function htmlToString(html) {
	var str = html.serialize();
	str = str.replace(/href="about:blank#/g, "href=\"#");
	str = str.replace(/\<h2\>\<\/h2>/g, "");
	return str;
}

function fixHtmlRefs(html, pageDir, _pageDir) {
	var dom = new jsdom.JSDOM(html);
	var links = dom.window.document.querySelectorAll("[href]");
	var imageSrcs = dom.window.document.querySelectorAll("[src]");

	function changeTagName(el, tag) {
		const newElement = dom.window.document.createElement(tag);

		for (const { name, value } of el.attributes) {
			newElement.setAttribute(name, value);
		}

		while (el.firstChild) {
			newElement.appendChild(el.firstChild);
		}

		el.parentNode.replaceChild(newElement, el);

		return newElement;
	}

	for(const link of links) {
		if(link.href == "#") continue;
		link.href = fixPath(link.href);
		link.href = link.href.replace(/\.md$/, ".html").replace("./" + pageDir, "./");
		if(link.href.startsWith("/")) {
			link.href = path.normalize("/" + pageDir + link.href.substring(1));
		}
		if(link.href.startsWith("root/")) {
			link.href = path.normalize("/" + _pageDir + link.href.substring(5));
		}
		link.href = link.href.replace(/\.force-md$/, "");
		link.href = fixPath(link.href);
	}

	for(const image of imageSrcs) {
		if(image.src == "#") continue;

		image.src = fixPath(image.src);
		image.src = image.src.replace(/\.md$/, ".html").replace("./" + pageDir, "./");
		if(image.src.startsWith("/")) {
			image.src = path.normalize("/" + _pageDir + image.src.substring(1));
		}
		if(image.src.startsWith("root/")) {
			image.src = path.normalize("/" + _pageDir + image.src.substring(5));
		}
		image.src = image.src.replace(/\.force-md$/, "");
		image.src = fixPath(image.src);
	}

	var codeblocks = dom.window.document.querySelectorAll('pre code[class^="language-"]');
	for(const codeblock of codeblocks) {
		codeblock.innerHTML = hljs.highlight(codeblock.textContent, {language: codeblock.className.split("-")[1]}).value;
		codeblock.parentElement.classList.add("hljs");
	}

	// select all non hljs codeblocks
	var inlineCodeblocks = dom.window.document.querySelectorAll('code:not([class^="language-"])');
	for(const codeblock of inlineCodeblocks) {
		if(codeblock.classList.contains("no-inline")) {
			codeblock.classList.remove("no-inline");
			continue;
		}
		codeblock.classList.add("inline-code");
	}

	var inlineCodeblocks = dom.window.document.querySelectorAll('pre code:not([class^="language-"])');
	for(const codeblock of inlineCodeblocks) {
		if(codeblock.parentElement.classList.contains("no-inline")) {
			codeblock.parentElement.classList.remove("no-inline");
			continue;
		}
		codeblock.parentElement.classList.add("inline-code");
	}

	var inlineSyntaxBlocks = dom.window.document.querySelectorAll('syntax');
	for(let codeblock of inlineSyntaxBlocks) {
		codeblock = changeTagName(codeblock, "code");
		codeblock.classList.add("inline-syntax", "inline-code");

		var format = codeblock.getAttribute("lang");
		codeblock.removeAttribute("lang");

		if(format != null)
			codeblock.innerHTML = hljs.highlight(codeblock.textContent, {language: format}).value;
	}

	return dom
}

function copyDir(src, dest) {
	// Check if the source exists
	if (!fs.existsSync(src)) {
		console.error(`Source directory ${src} does not exist`);
		return;
	}

	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const items = fs.readdirSync(src);

	for (let item of items) {
		let srcPath = path.join(src, item);
		let destPath = path.join(dest, item);

		srcPath = fixPath(srcPath);
		destPath = fixPath(destPath);

		const stats = fs.statSync(srcPath);
		if (stats.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			if(isRelease) {
				if(item.endsWith(".js")) {
					compileJs(srcPath, destPath);
				} else if(item.endsWith(".css")) {
					compileCss(srcPath, destPath);
				} else if(item.endsWith(".scss")) {
					compileSass(srcPath, destPath);
				} else {
					fs.copyFileSync(srcPath, destPath);
				}
			} else {
				fs.copyFileSync(srcPath, destPath);
			}
		}
	}
}

function compileJs(file, dest) {
	if(isRelease) {
		var content = fs.readFileSync(file, 'utf8');
		var result = UglifyJS.minify(content);
		if(result.error) {
			console.error(result.error);
			console.error("Error minifying file: " + file);
			console.error("Skipping...");
			fs.copyFileSync(file, dest);
			return;
		}
		fs.writeFileSync(dest, result.code);
		return;
	}
	fs.copyFileSync(file, dest);
}

wax(Mustache);

Mustache.Formatters = {
	formatDate: function(rdate) {
		var date = new Date(rdate);

		var year = date.getUTCFullYear();
		var month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
		var day = ('0' + date.getUTCDate()).slice(-2);
		var hours = ('0' + date.getUTCHours()).slice(-2);
		var minutes = ('0' + date.getUTCMinutes()).slice(-2);
		var seconds = ('0' + date.getUTCSeconds()).slice(-2);

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	},
	shortDate: function(rdate) {
		var date = new Date(rdate);

		var year = date.getUTCFullYear();
		var month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
		var day = ('0' + date.getUTCDate()).slice(-2);

		return `${year}-${month}-${day}`;
	},
	isoDate: function(rdate) {
		var date = new Date(rdate);
		return date.toISOString();
	}
};


function parseTemplate(html, vars) {
	let old;
	do {
		old = html;
		html = Mustache.render(html, vars, null, {
			escape: function(text) {
				return text;
			}
		});
	} while(html != old);

	return html;
}

function compileSass(file, dest) {
	var result = sass.compileString(fs.readFileSync(file, 'utf8'), {
		importers: [{
			canonicalize(url) {
				if (!url.endsWith('.scss')) return null;
				if (!url.startsWith('root/')) return null;
				return new URL("file:///" + url.substring(5));
			},
			load(canonicalUrl) {
				if (!canonicalUrl.pathname.endsWith('.scss')) return null;

				var filePath = "./" + path.join("./src", canonicalUrl.pathname);

				//console.log(canonicalUrl.pathname, canonicalUrl);
				//console.log(filePath);

				//console.log(fs.existsSync(filePath));
				if (!fs.existsSync(filePath)) return null;

				return {
					contents: fs.readFileSync(filePath, 'utf8'),
					syntax: 'scss'
				};
			}
		}]
	});
	if(isRelease) {
		result.css = new CleanCSS({
			level: 2
		}).minify(result.css).styles;
	}
	fs.writeFileSync(dest, result.css);
}

function compileCss(file, dest) {
	var content = fs.readFileSync(file, 'utf8');
	if(isRelease) {
		content = new CleanCSS({
			level: 2
		}).minify(content).styles;
	}
	fs.writeFileSync(dest, content);
}

module.exports = {
	setGlobals: setGlobals,
	getGlobals: getGlobals,
	fixPath: fixPath,
	fixHtmlRefs: fixHtmlRefs,
	copyDir: copyDir,
	parseTemplate: parseTemplate,
	compileSass: compileSass,
	compileJs: compileJs,
	parseHtml: parseHtml,
	htmlToString: htmlToString,
}