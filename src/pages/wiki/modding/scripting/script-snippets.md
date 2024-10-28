---
desc: This page contains useful script snippets for modders
lastUpdated: 2024-09-02T18:14:26.000Z
title: Script Snippets
---
# Useful script snippets for modders
Some features don't exist in our engine, luckily, we can script them in!

## Song Scripts

idk bro

## Global Scripts

## Replace pre-existing states with custom states.
```haxe
var redirectStates:Map<FlxState, String> = [
    TitleState => "CustomTitleState"
];

function preStateSwitch() {
    for (redirectState in redirectStates.keys())
        if (Std.isOfType(FlxG.game._requestedState, redirectState))
            FlxG.game._requestedState = new ModState(redirectStates.get(redirectState));
}
```

<!--
## Animated Icons support.
```haxe
function update(elapsed) {
    for (i in FlxG.state.members)
        if (Std.isOfType(i, HealthIcon))
            if (Assets.exists(Path.withoutExtension(Paths.image("icons/"+i.curCharacter)) + ".xml") && i.frames.frames[0].name != "losing0000") {
                i.frames = Paths.getFrames("icons/"+i.curCharacter);
                i.animation.addByPrefix("losing", "losing", 24, true);
                i.animation.addByPrefix("normal", "normal", 24, true);
                i.animation.play("normal", true);
                i.curAnimState = -1;
            }
}
function onHealthIconAnimChange(e) {
    if (e.healthIcon.animation.exists("normal")) {
        e.cancel();
        e.healthIcon.animation.play(e.amount == 0 ? 'normal' : 'losing', true);
    }
}
```
-->

## to be filled with other snippets