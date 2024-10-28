import haxe.io.Path;
import haxe.macro.Expr;
import sys.FileSystem;
import sys.io.Process;

using StringTools;

class Macro {
	// meh...
	public macro static function getDoxPath():Expr {
		var output = getProcessOutput('haxelib', ['--global', 'path', 'dox']);
		for (line in output.split("\n")) {
			var path = Path.normalize(line.trim());
			if (FileSystem.exists(path)) {
				var path = Path.directory(Path.removeTrailingSlashes(path.trim()));
				return macro $v{path};
			}
		}
		throw "dox path not found";
	}

	static function getProcessOutput(cmd:String, ?args:Array<String>):String {
		try {
			var process = new Process(cmd, args);
			var output = "";

			try {
				output = process.stdout.readAll().toString();
			} catch (_:Dynamic) {}

			process.close();
			return output;
		} catch (_:Dynamic) {
			return "";
		}
	}
}