//! highlighter adapted/modified from code.haxe.org
//! cleaned up by Ne_Eo
(function () { "use strict";
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
};
var kwds = ["abstract","break","case","cast","catch","class","continue","default","do","dynamic","else","enum","extends","extern","false","final","for","function","if","implements","import","in","inline","interface","macro","new","operator","overload","override","package","private","public","return","static","switch","this","throw","true","try","typedef","untyped","using","var","while"];
var kwds1 = new EReg("\\b(" + kwds.join("|") + ")\\b","g");
var vals = ["null","true","false","this"];
var vals1 = new EReg("\\b(" + vals.join("|") + ")\\b","g");
var types = new EReg("\\b([A-Z][a-zA-Z0-9]*)\\b","g");
var strreg = new EReg("(\"[^\"]*\")","g")
var commentreg = new EReg("(//.+?)(\n|$)","g");
var blockcmtreg = new EReg("(/\\*\\*?(.|\n)+?\\*?\\*/)","g");
function syntaxHighlight(html) {
	html = kwds1.replace(html,"<span class='kwd'>$1</span>");
	html = vals1.replace(html,"<span class='val'>$1</span>");
	html = types.replace(html,"<span class='type'>$1</span>");
	html = strreg.replace(html,"<span class='str'>$1</span>");
	html = commentreg.replace(html,"<span class='cmt'>$1</span>$2");
	html = blockcmtreg.replace(html,"<span class='cmt'>$1</span>");
	return html;
};


var items = window.document.body.querySelectorAll("pre code");
var len = items.length;
for(var i = 0; i < len; i++) {
	var el = items[i];
	if(el.className.indexOf("highlighted") != -1) {
		continue;
	}

	el.innerHTML = syntaxHighlight(el.innerHTML);
	el.className += " highlighted";
}

})();