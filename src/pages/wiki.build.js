const { Remarkable } = require('remarkable');
const path = require("path");
const fs = require('fs');
const matter = require('gray-matter');

var { fixHtmlRefs, copyDir, parseTemplate, fixPath, parseHtml, htmlToString } = require("../utils.js");

var header = fs.readFileSync("./src/pages/templates/header.html", 'utf8');

function generateSidebar(list, basePath = '', selected = null, idx = null, nameMap = null, pagination = null) {
	if(!idx) {
		idx = {
			value: 0
		}
	}
	if(!nameMap) {
		nameMap = {};
	}
	let html = '';

	list.forEach(item => {
		var parity = idx.value % 2 == 0 ? "even" : "odd";
		idx.value++;

		var href = `/${basePath}/${item[0]}.md`;

		var visualName = item[0];
		if(item.length > 1 && item[1] != null) {
			visualName = item[1];
		}

		href = href.replace(/\/{2,}/g, "/");

		var nameMapKey = href.replace(/\.md$/, "").replace(/^\/+/, "");

		nameMap[nameMapKey] = visualName.replace(" - UNFINISHED", "");

		visualName = visualName.replace("UNFINISHED", "<span style='color: #FF0000;'>UNFINISHED</span>")
		var isSelected = href.replace(/^\/+/g, "") == selected.replace(/^\/+/g, "");

		var selectedClass = isSelected ? " selected" : "";

		var hasChildren = item.length > 2 && item[2] != null;
		html += `<li class="sidebar-list-item ${parity}${selectedClass}">`;

		href = href.replace(/\/index\.(html|md)$/g, "/");
		if(isSelected)
			html += `<a href="#main" class="${parity}${selectedClass}">${visualName}</a>`;
		else
			html += `<a href="${href}" class="${parity}${selectedClass}">${visualName}</a>`;

		if(pagination != null && isSelected) {
			html += `<ul class="sidebar-unordered-list ${parity} pagination">\n`;
			for(const {id, name} of pagination) {
				html += `<li><a href="${id}">${name}</a></li>\n`;
			}
			html += `</ul>\n`;
		}
		if(hasChildren) {
			var path = item[0].split("/")[0];
			const subPath = basePath ? `${basePath}/${path}` : path;
			html += `<ul class="sidebar-unordered-list ${parity}">\n`;
			html += generateSidebar(item[2], subPath, selected, idx, nameMap, pagination).html;
			html += `</ul>\n`;
		}
		html += `</li>\n`;
	});

	return {html, nameMap};
}

function getGiscusID(pageDir) {
	// dont do index.html to /, causes issues
	//if(pageDir.endsWith("index.html")) {
	//	return pageDir.replace("index.html", "");
	//}
	return pageDir.replace(".html", "");
}

var wikiDir = "pages/wiki/";

var sidebarRaw = fs.readFileSync("./src/pages/wiki.json", "utf8");
var parsedSidebar = JSON.parse(sidebarRaw);

function buildHtml(_pageDir, _exportPath) {
	var pageDir = _pageDir + "wiki/";
	var exportPath = _exportPath + "wiki/";
	if (!fs.existsSync(exportPath)) {
		fs.mkdirSync(exportPath, {recursive: true});
	}
	console.log("Building Wiki");

	var templatePage = fs.readFileSync("./src/pages/wiki.html", 'utf8');
	var filenames = fs.readdirSync("./src/" + wikiDir, {recursive: true});
	var renderer = new Remarkable({
		html: true,
	});

	for (i of filenames) {
		i = fixPath(i);
		var parsedName = path.parse(i);
		var ext = parsedName.ext;
		if (ext == "" && !fs.existsSync(exportPath + i))
			fs.mkdirSync(exportPath + i, {recursive: true});
		if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".gif" || ext == ".webm" || ext == ".mp4") {
			fs.copyFile("./src/" + wikiDir + i, exportPath + i, () => {});
		}
		if (ext == ".md") {
			var filename = parsedName.name;

			var rawData = fs.readFileSync("./src/" + wikiDir + i, 'utf8');
			var markdown = matter(rawData, { excerpt: true });
			var content = markdown.content;

			var renderedContent = renderer.render(content);

			var pagination = [];

			var parsedHtml = parseHtml(renderedContent);
			var children = parsedHtml.window.document.querySelectorAll("h1, h2, h3, h4, h5, h6");
			for(const child of children) {
				if(!child.id)
					continue;

				var visibleName = child.textContent;
				if(!!child.attributes["sidebar"])
					visibleName = child.attributes["sidebar"].value;

				child.removeAttribute("sidebar");

				var id = child.id;
				pagination.push({
					id: `#${id}`,
					name: visibleName
				});
			}

			renderedContent = htmlToString(parsedHtml);

			// sidebar
			var {html:sidebar, nameMap:nameMap} = generateSidebar(parsedSidebar, "", i, null, null, pagination);

			var visualName = nameMap[i] || filename.replace(/\.md$/, "");

			var title = visualName;
			var nameMapKey = i.replace(/\.md$/, "").replace(/^\/+/, "");
			if(nameMap[nameMapKey]) {
				title = nameMap[nameMapKey];
			}
			// end sidebar

			var vars = {
				pageTitle: markdown.data.title ?? title,
				title: markdown.data.title ?? title,
				content: renderedContent,
				sidebar: sidebar,
				header: header,
				shortDesc: markdown.data.desc ?? null,
				lastUpdated: markdown.data.lastUpdated ?? null,
				author: markdown.data.author ?? null,

				url: i,
				giscusID: getGiscusID("wiki/" + i.replace(/\.md$/, ".html")),
			};
			console.log(i);

			let html = parseTemplate(templatePage, vars);

			var dom = fixHtmlRefs(html, pageDir, _pageDir);

			fs.writeFileSync(
				exportPath + i.replace(/\.md$/, ".html"),
				htmlToString(dom),
				'utf8'
			);
		}
	}
};

module.exports = {
	buildHtml: buildHtml
}