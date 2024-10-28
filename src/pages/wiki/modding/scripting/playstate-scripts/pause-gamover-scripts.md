---
author: Frakits & usb_port_2
desc: This page explains how to use Pause and Game Over Scripts in your mod!
lastUpdated: 2024-08-31T18:37:25.000Z
title: Pause and Game Over Scripts
---
# Pause and Game Over Scripts

## <h2 id="pause">Pause Scripts</h2>
Pause Scripts can change the pause menu, either entirely or tiny bits of it.<br>
To use one, you have to load it from a Script *(any script can do, even Song Scripts)*.
```haxe
PauseSubState.script = 'data/scripts/pause';
```
This code points to the script that can be found in ``./data/scripts/`` and is called ``pause.hx``.

You can do many things in this script. For example, this is how you can override it and have your own entirely custom pause menu here:
```haxe
function create(event) {
    event.cancel();

    camera = pauseCam = new FlxCamera();
    pauseCam.bgColor = FlxColor.TRANSPARENT;
    FlxG.cameras.add(pauseCam, false);

    // your code here
}
```
*(``create``'s event has more parameters than that. Check for <a href="../script-calls.md">All of the script calls</a>, and for calls other than ``create``)*<br>
This script will prevent the base pause menu from loading and allows you to add whatever you want to it.

Important functions to use when coding the pause menu:
- <syntax lang="haxe">close();</syntax> - Closes the pause menu, resumes gameplay.
- <syntax lang="haxe">FlxG.switchState(new PlayState());</syntax> - Reloads the state, restarts the song.

## <h2 id="gameover">Game Over Scripts</h2>
Game over scripts work the same as Pause Scripts, though presents some differences.
This is how you load one:
```haxe
GameOverSubstate.script = "data/scripts/gameover"
```
This code points to the script that can be found in ``./data/scripts/`` and is called ``gameover.hx``.

Here's an example of playing a video when the player dies:
```haxe
function create(event) {
    event.cancel(); // cancels out initializing characters and stuff

    deathVideo = new FlxVideo();
    deathVideo.onEndReached.add(deathVideo.dispose);
    var path = Paths.file("videos/death.mp4");
	deathVideo.load(Assets.getPath(path));
	deathVideo.play();
}
```

``create``'s event has even more parameters for changing SFX and other stuff. Check for <a href="../script-calls.md">All of the script calls</a>, and for calls other than ``create``.