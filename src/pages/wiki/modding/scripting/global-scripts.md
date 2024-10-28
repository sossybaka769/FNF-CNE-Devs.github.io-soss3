---
author: Frakits
desc: This page explains how to use Global Scripts
lastUpdated: 2024-08-31T12:09:41.000Z
title: Global Scripts
---
# Global Scripts
Global Scripts always run during the game, doesn't matter in which state or where, it always runs. *(runs from when the mod is loaded/game opened up until the game is closed/different mod is loaded)*<br>
You can make one by creating a file in ``./data/`` called ``global.hx``

Global Scripts are useful for certain things, for example, here's the default code in the base's global script:
```haxe
function update(elapsed:Float)
	if (FlxG.keys.justPressed.F5) FlxG.resetState();
```
Which makes it so that pressing F5 will refresh any state you are currently in.

Or a different example:
```haxe
static var cashAmount:Float = 0;
static var playerTitle = "poor";

function update(elapsed:Float) {
    if (cashAmount > 1000000) playerTitle = "millionaire";
}
```
This basic example shows how you can use <syntax lang="haxe">static</syntax> variables and trigger actions depending on them. As you can see, these variables are accessible in any script, so you can basically use them in any PlayState Scripts and State Scripts too.

<a href="./script-snippets.md">Useful script snippets for modders</a> contains a few useful code snippets that take advantage of Global Scripts.