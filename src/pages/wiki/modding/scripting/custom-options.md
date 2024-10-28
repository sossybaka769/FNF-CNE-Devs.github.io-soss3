---
author: Frakits & Swordcube
desc: This page explains how to create custom options for your mod!
lastUpdated: 2024-09-11T09:27:20.000Z
title: Custom Options
---
# Custom Options
You may find it useful to have custom options specific to your mod, thankfully you can do just that!

To get started, put a file in `./data/config` called `options.xml`.

There already exists a template for you to look on, and it looks something like this:

```xml
<menu name="Mod Options" desc="Modify mod options here">

	<checkbox id="checkboxExample" name="Checkbox example" />

	<number id="numberExample" name="Number example" min="0" max="10" change="1"/>

	<choice id="choiceExample" name="Choice Example">
		<value name="Disabled" value="disabled"/>
		<value name="This only" value="thisOnly"/>
		<value name="All" value="all"/>
	</choice>

	<menu name="Submenu Example" desc="Submenu test">
		<checkbox id="levelOfIdk2" name="Level of idk" />
	</menu>

</menu>
```

<img src="./Custom Options.png"/>

You're likely wondering: "how does each type of option work?"
That's what is about to be explained!!

All option types (except for <syntax lang="xml">&lt;menu&gt;</syntax>) share 2 common properties:
- `id` - The ID of the option to pull from save data (which we cover just below this section!)
- `name` - This is the name of the option displayed on screen

## <h2 id="properties" sidebar="Properties">Here's what the properties for each type are:</h2>

- <syntax lang="xml">&lt;menu&gt;</syntax> - A menu to put your options into, you can have sub-menus inside of them as well
    - `name` - This is the name of the menu displayed on screen
    - `desc` - This is the description of the menu displayed on screen

- <syntax lang="xml">&lt;checkbox&gt;</syntax> - Makes a checkbox to toggle an option on and off
    - There is no properties, this is the simplest an option can get

- <syntax lang="xml">&lt;number&gt;</syntax> - Self-explanatory i think
    - `min` - The minimum value this number is allowed to stay at
    - `max` - The maximum value this number is allowed to stay at
    - `change` - How much this number is allowed to change by, could be in 5s, 10s, etc

- <syntax lang="xml">&lt;choice&gt;</syntax> - A multiple choice option, which can cycle through several given values
    - <syntax lang="xml">&lt;value&gt;</syntax> - A value that can be chosen
        - `name` - This is the name of the value displayed on screen
        - `value` - This is the actual data/value applied to the option when chosen

Accessing them in Scripts is done via <syntax lang="haxe">FlxG.save.data</syntax>, as you can see below.
```haxe
var checkboxExample = FlxG.save.data.checkboxExample;
```

You may have noticed that none of the option types have a default value property,
this is because you have to set the default values yourself *(in a global script)*.<br>
You have to do this otherwise your options won't save correctly!

This is rather easy to do, put this in `./data/global.hx`:
```haxe
function new() {
    // FlxG.save is your mod's save data
    if(FlxG.save.data.checkboxExample == null)
        FlxG.save.data.checkboxExample = true;

    // You can also do
    // FlxG.save.data.checkboxExample ??= true;
}
```
