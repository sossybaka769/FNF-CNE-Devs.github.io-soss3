(function () {
var input = document.getElementById("input");
var output = document.getElementById("output");

var dropzone = document.getElementById("dropzone");
var fileInput = document.getElementById("file");

var saveButton = document.getElementById("save");

var fileNameDisplay = document.getElementById('file-name');

saveButton.addEventListener("click", function (e) {
	e.preventDefault();
	if(input.value.trim() == "") {
		alert("Please paste your character data first!");
		return;
	}
	var fileName = "character.xml";
	if(lastFile != null) {
		fileName = lastFile.name.replace(/\.json$/, ".xml");
	}
	saveFile(output.value, fileName);
});

function saveFile(content, filename) {
	var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
	var link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function saveBinaryFile(content, filename) {
	var blob = new Blob([content], { type: "application/octet-stream" });
	var link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropzone.addEventListener(eventName, preventDefaults, false);
	document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
	dropzone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop', "dragend"].forEach(eventName => {
	dropzone.addEventListener(eventName, unhighlight, false);
});

dropzone.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

var highlightTimeout = null;

function highlight() {
	dropzone.classList.add('highlight');
	clearTimeout(highlightTimeout);
	highlightTimeout = setTimeout(() => {
		unhighlight();
	}, 1000);
}

function unhighlight() {
	dropzone.classList.remove('highlight');
}

function handleDrop(e) {
	var dt = e.dataTransfer;
	var files = dt.files;
	handleFiles(files);
}

var lastFile = null;

//fileInput.addEventListener('change', function() {
//	const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
//	fileNameDisplay.textContent = fileName;
//});

fileInput.addEventListener('change', () => {
	handleFiles(fileInput.files);
}, false);

function handleFiles(files) {
	var fileArray = Array.from(files);
	if(fileArray.length > 0) {
		var files = fileArray.filter(file => file.type.startsWith("application/json"));
		if(files.length > 0) {
			var file = files[0];
			fileNameDisplay.textContent = file.name;
			lastFile = file;
			var reader = new FileReader();
			reader.onload = function(e) {
				input.value = e.target.result;

				var xml = convert(input.value);
				output.value = xml;
			};
			reader.readAsText(file);
		} else {
			fileNameDisplay.textContent = "No file chosen";
		}
	} else {
		fileNameDisplay.textContent = "No file chosen";
	}
}

function formatNumberRange(numbers, separator = ",") {
	if (numbers.length === 0) return "";

	const result = [];
	let i = 0;

	while (i < numbers.length) {
		let start = numbers[i];
		let end = start;
		let direction = 0; // 0: no sequence, 1: increasing, -1: decreasing

		if (i + 1 < numbers.length) { // detect direction of sequence
			if (numbers[i + 1] === end + 1) {
				direction = 1;
			} else if (numbers[i + 1] === end - 1) {
				direction = -1;
			}
		}

		if (direction !== 0) {
			while (i + 1 < numbers.length && (numbers[i + 1] === end + direction)) {
				end = numbers[i + 1];
				i++;
			}
		}

		if (start === end) { // no direction
			result.push(`${start}`);
		} else if (start + direction === end) { // 1 step increment
			result.push(`${start},${end}`);
		} else { // store as range
			result.push(`${start}..${end}`);
		}

		i++;
	}

	return result.join(separator);
}

var convertFolderButton = document.getElementById("convert-folder");
convertFolderButton.addEventListener("change", function cFolder() {
	const files = convertFolderButton.files;

	var promises = [];

	function conve(file) {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.onload = function(event) {
				zip.file(file.name.replace('.json', '.xml'), convert(event.target.result));
				//console.log('converted ' + file.name);
				resolve("wiz really likes furries");
			};
			reader.readAsText(file);
		});
	}

	var zip = new JSZip();

	const currDate = new Date();
	const dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
	JSZip.defaults.date = dateWithOffset;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		if (file.name.includes('.json')) {
			promises.push(conve(file));
		}
	}

	Promise.all(promises).then((values) => {
		zip.generateAsync({type:"blob"}).then(function(content) {
			saveBinaryFile(content, "characters.zip");
		});
	});
});

function std_parseInt() {
	let v = parseInt(x);
	if(isNaN(v)) {
		return null;
	}
	return v;
}

var colorMapping = {
	"TRANSPARENT":0x00000000,
	"WHITE":0xFFFFFFFF,
	"GRAY":0xFF808080,
	"BLACK":0xFF000000,
	"GREEN":0xFF008000,
	"LIME":0xFF00FF00,
	"YELLOW":0xFFFFFF00,
	"ORANGE":0xFFFFA500,
	"RED":0xFFFF0000,
	"PURPLE":0xFF800080,
	"BLUE":0xFF0000FF,
	"BROWN":0xFF8B4513,
	"PINK":0xFFFFC0CB,
	"MAGENTA":0xFFFF00FF,
	"CYAN":0xFF00FFFF,
}

var COLOR_REGEX = /^(0x|#)(([A-F0-9]{2}){3,4})$/i;
function colorFromString(str) {
	var result = null;
	if (COLOR_REGEX.test(str)) {
		var match = COLOR_REGEX.exec(str);
		var hexColor = "0x" + match[2];
		result = std_parseInt(hexColor);
		if (hexColor.length == 8) {
			result = result | 0xFF000000;
		}
	} else {
		if (colorMapping.hasOwnProperty(str.toUpperCase())) {
			result = colorMapping[str.toUpperCase()];
		} else {
			result = null;
		}
	}

	return result;
}

function hex(num, size) {
	var s = num.toString(16);
	while (s.length < size) {
		s = "0" + s;
	}
	return s;
}

function fromRGBArray(arr) {
	var r = arr[0];
	var g = arr[1];
	var b = arr[2];
	return 0xFF000000 | (r << 16) | (g << 8) | b;
}

function toWebColor(color, Alpha=true, Prefix=true) {
	var color = color | 0;
	var alpha = (color >> 24) & 0xFF;
	var red = (color >> 16) & 0xFF;
	var green = (color >> 8) & 0xFF;
	var blue = color & 0xFF;
	var prefix = Prefix ? "#" : "";
	if (Alpha && alpha < 255) {
		return prefix + hex(alpha, 2) + hex(red, 2) + hex(green, 2) + hex(blue, 2);
	}
	return prefix + ((red << 16) | (green << 8) | blue).toString(16);
}


function convert(jsonInput) {
	var json = JSON.parse(jsonInput);

	var xmlOutput = "<!DOCTYPE codename-engine-character>\n\t<!-- Made with WizardMantis's Character Converter on https://codename-engine.com/ -->\n<character";

	if (json.no_antialiasing) xmlOutput +=" antialiasing=\"false\"";
	if (json.image != null) {
		if(json.image.startsWith("characters/")) {
			json.image = json.image.replace("characters/", "");
		}
		xmlOutput += " sprite=\"" + json.image + "\"";
	}
	if (json.position[0] !== 0) xmlOutput += " x=\"" + json.position[0] + "\"";
	if (json.position[1] !== 0) xmlOutput += " y=\"" + json.position[1] + "\"";
	// icon - healthicon
	if (json.healthicon != null) {
		xmlOutput += " icon=\"" + json.healthicon + "\"";
	}
	if (json.flip_x) xmlOutput += " flipX=\"true\"";
	if (json.healthbar_colors != null) {
		xmlOutput += " color=\"" + toWebColor(fromRGBArray(json.healthbar_colors)) + "\"";
	}
	if (json.camera_position[0] !== 0) xmlOutput += " camx=\"" + json.camera_position[0] + "\"";
	if (json.camera_position[1] !== 0) xmlOutput += " camy=\"" + json.camera_position[1] + "\"";
	if (json.sing_duration !== 4) xmlOutput += " holdTime=\"" + json.sing_duration + "\"";
	if (json.scale !== 1) xmlOutput += " scale=\"" + json.scale + "\"";

	xmlOutput += ">\n"

	json.animations.forEach(function (a) {
		xmlOutput += "\t<anim";
		xmlOutput += " name=\"" + a.anim + "\"";
		xmlOutput += " anim=\"" + a.name + "\"";
		if (a.offsets[0] !== 0)     xmlOutput += " x=\"" + a.offsets[0] + "\"";
		if (a.offsets[1] !== 0)     xmlOutput += " y=\"" + a.offsets[1] + "\"";
		if (a.fps !== 24)           xmlOutput += " fps=\"" + a.fps + "\"";
		if (a.loop)                 xmlOutput += " loop=\"true\"";
		if (a.indices.length !== 0) xmlOutput += " indices=\"" + formatNumberRange(a.indices) + "\"";
		xmlOutput += '/>\n'
	});

	xmlOutput += "</character>";

	return xmlOutput;
}
})();