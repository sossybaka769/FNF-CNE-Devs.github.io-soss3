---
author: Frakits
desc: This page explains how to use Gameplay Scripts in your mod!
lastUpdated: 2024-09-03T18:08:41.000Z
title: Gameplay Scripts
---
# Gameplay Scripts

## <h2 id="gameplay-scripts" sidebar="Gameplay Scripts">Gameplay scripts run during gameplay *(yep)*</h2>

You can run Gameplay Scripts in **a song**, by putting the scripts in ``./song/YOUR SONG/scripts``, or run them in **every song**, by putting them in the ``./songs`` folder itself.

Gameplay Scripts can change the gameplay in various ways, for example, this is how you can hide the player character:
```haxe
function create() {
    boyfriend.visible = false;
}
```
Or how to create a normal sprite:
```haxe
function create() {
    var sprite = new FlxSprite(x, y).loadGraphic(Paths.image("my new sprite")); //picks the png image from the ./images folder
}
```
If you notice, this looks slightly like source code, aside from the usual <syntax lang="haxe">override function</syntax> or <syntax lang="haxe">super.create()</syntax>, which does not exist in our scripting language.<br>
If you already got the hang of source coding, then scripting will feel like a breeze. If not.. well.. prepare to learn!

## <h2 id="particularities">Particularities</h2>

### Accessing characters.

Characters are actually accessed differently. Due to the modularity of having more than one Strumline, and having more than one character in a Strumline, characters are accessible like this:
```haxe
trace(strumLines.members[0].characters[0]); // opponent character
trace(strumLines.members[1].characters[0]); // player character
trace(strumLines.members[2].characters[0]); // girlfriend character
```
Though we have also established a few shortcuts to avoid typing this much code
```haxe
trace(dad);
trace(boyfriend);
trace(gf);
```

### Replacing ``mustHitSection``.

Sections do not exists, and therefore, ``mustHitSection`` no longer works. But, as a workaround, you can use ``curCameraTarget`` to replace it.

```haxe
if (curCameraTarget == 1) // mustHitSection == true
```
