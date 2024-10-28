---
author: Frakits
desc: This page explains how to create character/stage scripts
lastUpdated: 2024-09-02T18:14:26.000Z
title: Character/Stage Scripts
---
# Character/Stage Scripts

Character/Stage Scripts run alongside them, or something like that.

## <h2 id="character-scripts">Character Scripts</h2>
You can create one of those by making a Script file alongside your character's XML data file *(``./data/characters/``)*<br>
In these scripts you don't need to specify the character, since the character becomes the Script's parent.

Here's an example of a Character Script that makes the character spin..:
```haxe
function update(elapsed) {
    angle += elapsed * 10;
}
```

## <h2 id="stage-scripts">Stage Scripts</h2>
Creating one of those also goes next to the Stage XML data file *(``./data/stages/``)*.<br>
This script also takes the Stage as it's parent, thus not needing to use <syntax lang="haxe">stage.getSprite()</syntax>, instead, sprites becomes the variables

Here's an example:
```haxe
function postCreate() {
    // animatedObject has already been defined in the XML file.
    animatedObject.frames = Paths.getFrames("animatedObject");
    animatedObject.animation.addByPrefix("idle", "idle", 24, true);
    animatedObject.animation.play("idle");
}
```