---
author: Ne_Eo & Frakits
desc: This page explains how to create custom classes for your mod!
lastUpdated: 2024-09-11T09:37:50.000Z
title: Custom Classes
---
# Custom Classes

Custom classes can be made either inside the script you need it in or you can make a script file corresponding with the name of the class in ``./source``, and using <syntax lang="haxe">import</syntax> to import it.

Here is a basic Song Script code that uses it:
```haxe
class SpecialSprite extends FlxSprite {
    public var customValue:String = null;
    public function new(?x:Float = 0, ?y:Float = 0, ?graphic:FlxGraphicAsset, customValue:String) { // it also has to start with the same arguments as the super class, (limitation for now)
        super(x, y, graphic); // this does nothing currently, its purely visual for now, but it will be used in the future
        this.customValue = customValue;
        //other code stuff
    }

    public override function update(elapsed) {
        super.update(elapsed);
    }
}

function create() {
    var spr = new SpecialSprite(200, 400, null, "powerful");
    add(spr);
}
```

## Particularities
As of writing this, this system is very limited and also presents some defects. For example:
- You cannot extend FlxGroups or other typed classes *(the ones that end with a ``<T>``)*.
- Classes that override a class needs to have the same arguments on the constructor as the class it overrides. Same when creating the instance of the class.
- Compiled Classes that do not override a function in their code cannot have that function overridden by custom classes. For example, you can't override the `draw` method in a custom class that extends <syntax lang="haxe">FlxParticle</syntax>, because <syntax lang="haxe">FlxParticle</syntax> does not override `draw`.
- all variables need to be public in order to be accessed inside the class.
- static variables are not supported. (yet)
- static functions are not supported. (yet)
- private variables are not supported. They act as public variables.
- private functions are not supported. They act as public functions.
- You cannot extend a custom class. (yet)
- You can only extend a class that is in the packages, `flixel`, `funkin`