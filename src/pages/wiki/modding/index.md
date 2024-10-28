---
author: Frakits
desc: How to mod the engine.
lastUpdated: 2024-09-20T15:19:41.000Z
title: Modding The Engine
---
# Modding The Engine

To start modding the engine, you simply make a folder in ``./mods``. It's really that simple, as making a mod does not require any setup.

You can make the mod run constantly by putting it in ``./addons`` instead.

As for the next steps, we will cover those in this documentation as well.

For starters, we have to know what a mod structure looks like. A mod with only the essential features looks something like this:
```
songs
    example song
        song
            Inst.ogg
            Voices.ogg
            Voices-dad.ogg
            Voices-bf.ogg
        charts
            easy.json
            normal.json
            hard.json
        scripts
            modchart.hx
        meta.json
data
    characters
        example character.xml
    stages
        example stage.xml
    states
        MainMenuState.hx
images
    characters
        example character.xml
        example character.png
    stages
        example stage
            stage.png
            animated element.xml
            animated element.png
```

This is the super basic structure of a minimal mod. It doesn't look much, but trust me, you can totally do a lot more than that.

<details>
    <summary>(btw if you're curious this is how a mod looks like fully decked out)</summary>

```
songs
    example song
        song
            Inst.ogg
            Voices.ogg
            Voices-dad.ogg
            Voices-bf.ogg
            Inst-hard.ogg
            Voices-hard.ogg
            Voices-dad-hard.ogg
            Voices-bf-hard.ogg
        charts
            easy.json
            normal.json
            hard.json
            example custom difficulty.json
        scripts
            modchart.hx
            example script.hx
        meta.json
data
    characters
        example character.xml
        example character.hx
    stages
        example stage.xml
        example stage.hx
    notes
        example notetype.hx
    splashes
        example splashes.xml
    dialogue
        boxes
            example box.xml
            example box.hx
        characters
            example portrait.xml
            example portrait.hx
    config
        credits.xml
        discord.json
        menuItems.txt
        options.xml
    titlescreen
        introText.txt
        titlescreen.xml
    weeks
        weeks
            example week.xml
        characters
            example character.xml
        weeks.txt
images
fonts
sounds
music
shaders
videos
```

fill this shit later
</details>
<br>

Once you're done looking at this structure, you can begin with recreating it in your mods folder.

Afterwards, you have to find the devtools (or basically just the editors), by going to the game's Main Menu and pressing 7.

<img src="./index.png"/>

Here you'll find the essential tools, and some options for debug *(for example, enabling the console in Debug Options)*

The next steps are covered in these articles:
- <a href="./songs/">Creating songs</a>
- <a href="./characters/">Creating characters</a>
- <a href="./stages/">Creating stages</a>
- <a href="./scripting/">Scripting</a>

And when you're done with the basic steps you're finally ready for release, or if you want, go through more advanced stuff, like these:
- <a href="./cutscenes-dialogues.md">Cutscenes/Dialogues</a>
- <a href="./scripting/shaders.md">Shaders</a>
- <a href="./scripting/3d-rendering.md">3D rendering</a>
- <a href="./scripting/global-scripts.md">Global Scripts</a>
- <a href="./scripting/custom-options.md">Custom Options</a>
- <a href="./scripting/scripted-assets-libraries.md">Scripted Assets Libraries</a>
- <a href="./scripting/ndll-scripting.md">NDLL Scripting</a>

## <h2 id="config" sidebar="Config">Config</h2>

Some config is still required for things like Discord RPC. so we're gonna get over them here.<br>
All of these configs can be found in ``./data/config/``

### discord.json
```json
{
	"clientID": "discord token",
	"logoKey": "icon"
}
```
Before doing this, make sure to make a discord application at [https://discord.com/developers/applications](https://discord.com/developers/applications), if you don't know how... please search for a guide on google. After that, copy the application ID and insert it there.

### credits.xml
Crediting people also uses XML data to parse members, though it has a lot of features to cover.<br>
Here's a template provided by the engine:
```xml
<menu name="Mod Credits" desc="Modify mod credits here">

    <credit name="Credit Example" desc="Click me to know more about me!" icon="credit icon example" size="130" url="https://youtu.be/fugtxz1znVw"/>

    <github user="NexIsDumb" customName="Nex is Dumb" desc="The bitch who made these credits menus" size="100" portrait="false"/>

</menu>
```
As you can see, there's 2 types of nodes: <syntax lang="xml">&lt;credit&gt;</syntax> and <syntax lang="xml">&lt;github&gt;</syntax>. <syntax lang="xml">&lt;credit&gt;</syntax> is the basic crediting node which can be applied to anyone, and <syntax lang="xml">&lt;github&gt;</syntax> pulls the user from it's database and can only be used for people who have accounts on GitHub *(also automatically redirects to their GitHub profile page.)*

Their parameters are as follows:
- <syntax lang="xml">&lt;credit&gt;</syntax>
    - ``name`` which is the name of the person.
    - ``desc`` determines the description of that person.
    - ``icon`` determines which PNG file to pick from ``./images/credits``.
    - ``size`` defines the size of the icon i think.
    - ``url`` is the page where you get redirected when pressing enter on the person.
    - ``color`` changes the color of the text that displays the name.
    - ``portrait`` determines whether or not to crop the picture to a circular form.
- <syntax lang="xml">&lt;github&gt;</syntax>
    - ``user`` determines which user to grab from the GitHub database.
    - ``customName`` is the display name you wish to refer to the person.
    - ``size`` defines the size of the icon i think.
    - ``color`` changes the color of the text that displays the name.
    - ``portrait`` determines whether or not to crop the picture to a circular form.

Also, if you notice, you can wrap these with the <syntax lang="xml">&lt;menu&gt;</syntax> node to separate the credits *(like probably having an artist submenu and stuff)*

### options.xml
options.xml is explained in this article <a href="./scripting/custom-options.md">Custom options</a>.